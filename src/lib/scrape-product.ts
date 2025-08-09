import * as cheerio from 'cheerio';
// import puppeteer from 'puppeteer';
import { categorizeItem } from './categorize-items';
import { WardrobeItem } from '@/types/wardrobe';

// Reusable Puppeteer browser and simple in-memory cache for Zara HTML
declare global {
  // eslint-disable-next-line no-var
  var __puppeteerBrowser: any | undefined;
  // eslint-disable-next-line no-var
  var __zaraHtmlCache: Map<string, { html: string; cachedAt: number }> | undefined;
}

async function getReusableBrowser() {
  if (global.__puppeteerBrowser) return global.__puppeteerBrowser;
  const puppeteer = await import('puppeteer');
  global.__puppeteerBrowser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
    ],
  });
  return global.__puppeteerBrowser;
}

function getZaraCache(): Map<string, { html: string; cachedAt: number }> {
  if (!global.__zaraHtmlCache) {
    global.__zaraHtmlCache = new Map();
  }
  return global.__zaraHtmlCache;
}

interface Product extends Omit<WardrobeItem, 'id' | 'userId' | 'createdAt' | 'updatedAt'> {
  sizes?: string[];
  colors?: string[];
  images?: string[];
  description?: string;
  pattern?: string;
  fabric?: string;
  quantity?: string;
  seller?: string;
  sourceRetailer?: string;
  id: string;
}

// Common selectors that work across many e-commerce sites
const commonSelectors = {
  // Open Graph meta tags
  ogImage: 'meta[property="og:image"]',
  ogTitle: 'meta[property="og:title"]',
  ogDescription: 'meta[property="og:description"]',
  
  // Schema.org meta tags
  schemaBrand: 'meta[itemprop="brand"]',
  schemaPrice: 'meta[itemprop="price"]',
  schemaImage: 'meta[itemprop="image"]',
  
  // Common class names and patterns
  productTitle: [
    '.product-title',
    '.product-name',
    '.pdp-product-name',
    '.product-item-headline',
    'h1'
  ],
  productBrand: [
    '.product-brand',
    '.brand-name',
    '.pdp-product-brand',
    '.product-item-brand'
  ],
  productPrice: [
    '.product-price',
    '.price',
    '.pdp-product-price',
    '.product-item-price'
  ],
  productImage: [
    '.product-image',
    '.product-gallery',
    '.pdp-product-images',
    '.product-item-image'
  ],
  productDescription: [
    '.product-description',
    '.description',
    '.pdp-product-description',
    '.product-item-description'
  ]
};

// Helper function to find first matching element
function findFirstMatching($: cheerio.CheerioAPI, selectors: string[]): cheerio.Cheerio<any> {
  for (const selector of selectors) {
    const element = $(selector);
    if (element.length > 0) {
      return element;
    }
  }
  return $('');
}

// Helper function to extract price
function extractPrice(text: string): string {
  const priceMatch = text.match(/(?:₹|\$|€|£)?\s*[\d,]+(?:\.\d{2})?/);
  return priceMatch ? priceMatch[0] : '';
}

// Helper function to extract brand from URL
function extractBrandFromUrl(url: string): string {
  try {
    const domain = new URL(url).hostname;
    // Handle known retailers
    if (domain.includes('hm.com')) return 'H&M';
    if (domain.includes('myntra.com')) return 'Myntra';
    if (domain.includes('zara.com')) return 'Zara';
    
    // For unknown retailers, try to get a clean brand name
    const brandPart = domain.split('.')[0];
    if (brandPart.toLowerCase().startsWith('www')) {
      // If domain starts with www, use the second part
      return domain.split('.')[1].charAt(0).toUpperCase() + domain.split('.')[1].slice(1);
    }
    return brandPart.charAt(0).toUpperCase() + brandPart.slice(1);
  } catch (error) {
    return 'Unknown Brand';
  }
}

// Helper function to extract category from URL
function extractCategoryFromUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    const path = urlObj.pathname;
    const segments = path.split('/').filter(Boolean);

    // Handle known retailers
    if (urlObj.hostname.includes('hm.com')) {
      // H&M URLs usually have category in the path before 'productpage'
      const categoryIndex = segments.findIndex(s => s !== 'productpage' && !s.includes('_'));
      if (categoryIndex >= 0) {
        return segments[categoryIndex].split('-').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
      }
    }

    // For other retailers, try to find a reasonable category
    // Skip common segments like 'product', 'item', language codes
    const validSegment = segments.find(segment => 
      !segment.includes('product') &&
      !segment.includes('page') &&
      !segment.includes('item') &&
      !segment.match(/^[a-z]{2}(_[a-z]{2})?$/) // Skip language codes like 'en_us'
    );

    if (validSegment) {
      return validSegment.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
    }

    return 'Uncategorized';
  } catch (error) {
    return 'Uncategorized';
  }
}

// Export the scrapeProduct function
export async function scrapeProduct(url: string): Promise<Product> {
  if (!url) {
    throw new Error('URL is required');
  }

  try {
    // First attempt: simple fetch
    let html: string = '';
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
          'Referer': 'https://www.google.com/'
        }
      });
      if (response.ok) {
        const text = await response.text();
        // Detect Akamai interstitial
        if (!/bm-verify|Akamai|_sec\/verify|interstitial|pow\":/.test(text)) {
          html = text;
        }
      }
    } catch {}

    // If blocked or missing content for Zara, fallback to Puppeteer
    const hostname = new URL(url).hostname;
    const isZara = hostname.includes('zara.com');

    if (!html && isZara) {
      // Cache check (TTL 6 hours)
      const cache = getZaraCache();
      const cached = cache.get(url);
      const now = Date.now();
      const ttlMs = 6 * 60 * 60 * 1000;
      if (cached && (now - cached.cachedAt) < ttlMs) {
        html = cached.html || '';
      } else {
        const browser = await getReusableBrowser();
        const page = await browser.newPage();
        try {
          // Block heavy resources to accelerate
          await page.setRequestInterception(true);
          page.on('request', (req: any) => {
            const type = req.resourceType?.();
            if (type === 'image' || type === 'media' || type === 'font' || type === 'stylesheet') {
              return req.abort();
            }
            return req.continue();
          });

          await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36');
          await page.setExtraHTTPHeaders({ 'Accept-Language': 'en-US,en;q=0.9', 'Referer': 'https://www.google.com/' });

          await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });

          // Short, bounded delay to allow SSR/meta to arrive
          await page.evaluate(() => new Promise<void>(resolve => setTimeout(resolve, 500)));

          // If interstitial exists, try a second brief wait
          const content = await page.content();
          if (/bm-verify|Akamai|_sec\/verify|interstitial|pow\":/.test(content)) {
            await page.evaluate(() => new Promise<void>(resolve => setTimeout(resolve, 1000)));
          }

          html = await page.content();
          cache.set(url, { html, cachedAt: now });
        } finally {
          await page.close().catch(() => {});
        }
      }
    }

    if (!html) {
      throw new Error('Page content could not be retrieved');
    }

    const $ = cheerio.load(html);

    // Zara-specific extraction via JSON-LD and meta tags
    const isZaraFinal = isZara;

    let zaraName = '';
    let zaraPrice = '';
    let zaraImage = '';
    let zaraColor = '';
    let zaraBrand = '';

    if (isZaraFinal) {
      $('script[type="application/ld+json"]').each((_, el) => {
        const raw = $(el).contents().text();
        try {
          const parsed = JSON.parse(raw);
          const nodes = Array.isArray(parsed) ? parsed : [parsed];
          for (const node of nodes) {
            const type = node && node['@type'];
            const isProduct = (typeof type === 'string' && type.toLowerCase() === 'product') ||
                              (Array.isArray(type) && type.map((t: string) => t.toLowerCase()).includes('product'));
            if (!isProduct) continue;

            if (!zaraName && node.name) zaraName = String(node.name).trim();
            if (!zaraBrand && node.brand) {
              if (typeof node.brand === 'string') zaraBrand = node.brand;
              else if (typeof node.brand?.name === 'string') zaraBrand = node.brand.name;
            }

            const offers = node.offers;
            const pickPrice = (o: any) => {
              if (!o) return;
              if (typeof o.price === 'number' || typeof o.price === 'string') {
                const priceStr = String(o.price);
                if (!zaraPrice) zaraPrice = extractPrice(priceStr) || priceStr;
              }
            };
            if (offers) {
              if (Array.isArray(offers)) pickPrice(offers[0]); else pickPrice(offers);
            }

            const images = node.image;
            if (!zaraImage) {
              if (Array.isArray(images) && images.length) zaraImage = String(images[0]);
              else if (typeof images === 'string') zaraImage = images;
            }

            if (!zaraColor) {
              const colorValue = node.color || node.colorName || (node.additionalProperty?.find?.((p: any) => (p.name || '').toLowerCase() === 'color')?.value);
              if (typeof colorValue === 'string') zaraColor = colorValue;
            }

            break; // First Product node is sufficient
          }
        } catch {}
      });

      // Fallbacks for Zara
      if (!zaraImage) {
        zaraImage = $('meta[name="twitter:image"]').attr('content') || $('meta[property="og:image"]').attr('content') || '';
      }
      if (!zaraPrice) {
        const twPrice = $('meta[name="twitter:data1"]').attr('content') || '';
        if (twPrice) zaraPrice = extractPrice(twPrice);
      }
      if (!zaraName) {
        zaraName = $('meta[property="og:title"]').attr('content') || $('title').text().trim() || '';
      }
    }

    // Extract basic information
    // H&M specific selectors first
    const hmName = $('.product-item-headline').first().text().trim();
    const hmPrice = $('meta[property="product:price:amount"]').attr('content') ||
                    $('[data-price="price"]').first().text().trim();
    const hmImage = $('meta[property="og:image"]').attr('content') ||
                    $('.product-detail-main-image-container img').attr('src');
    const hmColor = $('[data-swatches] [aria-checked="true"]').attr('aria-label') ||
                    $('[data-selected-color]').attr('data-selected-color') || '';

    const name = (isZaraFinal && zaraName) || hmName || $('h1').first().text().trim() || 
                $('meta[property="og:title"]').attr('content') || 
                $('title').text().trim() ||
                'Unknown Product';

    const brand = (isZaraFinal && (zaraBrand || 'Zara')) || extractBrandFromUrl(url);

    const price = (isZaraFinal && zaraPrice) || hmPrice || $('meta[property="product:price:amount"]').attr('content') ||
                 $('meta[itemprop="price"]').attr('content') ||
                 $('.price-value').first().text().trim() ||
                 '';

    // Create the product object
    const product: Product = {
      name,
      brand,
      price,
      productLink: url,
      dateAdded: new Date(),
      id: (url.match(/p(\d+)/i)?.[1]) || url.split('/').pop() || Date.now().toString(),
      sourceRetailer: brand
    };

    // Helper to absolutize URLs
    const toAbsolute = (src?: string) => {
      if (!src) return '';
      if (src.startsWith('http')) return src;
      if (src.startsWith('//')) return `https:${src}`;
      try { return new URL(src, url).href; } catch { return src; }
    };

    // Extract images
    const images: string[] = [];
    const ogImage = (isZaraFinal && zaraImage) || hmImage || $('meta[property="og:image"]').attr('content');
    if (ogImage) images.push(toAbsolute(ogImage));

    const schemaImage = $('meta[itemprop="image"]').attr('content');
    if (schemaImage) images.push(toAbsolute(schemaImage));

    $('img').each((_, el) => {
      const src = $(el).attr('src') || $(el).attr('data-src') || '';
      if (!src) return;
      if (src.includes('product') || src.includes('catalog') || src.includes('assets') || src.includes('zara') || src.includes('static')) {
        images.push(toAbsolute(src));
      }
    });

    // Add the first valid image
    if (images.length > 0) {
      product.image = images[0];
      product.images = images;
    } else {
      // Fallback placeholder image
      product.image = 'https://via.placeholder.com/300x300?text=No+Image';
    }

    // Extract description
    product.description = $('meta[property="og:description"]').attr('content') ||
                         $('meta[name="description"]').attr('content') ||
                         '';

    // Extract color if available
    product.color = (isZaraFinal && zaraColor) || hmColor || $('[data-selected-color]').attr('data-selected-color') ||
                   $('.color-name').first().text().trim() ||
                   '';

    // Use our categorization logic to determine the category
    product.category = categorizeItem({
      name: product.name,
      brand: product.brand,
      color: product.color,
      sourceRetailer: product.sourceRetailer
    });

    // Basic validation - just ensure we have a name
    if (!product.name || product.name === 'Unknown Product') {
      throw new Error('Could not extract product information from this page. Please try a direct product page URL.');
    }

    return product;
  } catch (error) {
    console.error('Error scraping product:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to scrape product information: ${error.message}`);
    }
    throw new Error('Failed to scrape product information');
  }
} 