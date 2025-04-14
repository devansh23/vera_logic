import * as cheerio from 'cheerio';
import puppeteer from 'puppeteer';
import { categorizeItem } from './categorize-items';
import { WardrobeItem } from '@/types/wardrobe';

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
    // First try with Puppeteer for dynamic content
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    
    try {
      await page.goto(url, { 
        waitUntil: 'networkidle0',
        timeout: 30000 // 30 seconds timeout
      });
    } catch (error) {
      console.error('Navigation error:', error);
      throw new Error('Failed to load the product page. Please check the URL and try again.');
    }

    const html = await page.content();
    await browser.close();

    // Parse HTML with Cheerio
    const $ = cheerio.load(html);

    // Extract basic information
    const name = $('h1').first().text().trim() || 
                $('meta[property="og:title"]').attr('content') || 
                $('title').text().trim();

    const brand = extractBrandFromUrl(url);

    const price = $('meta[property="product:price:amount"]').attr('content') ||
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
      id: url.split('/').pop() || '',
      sourceRetailer: brand
    };

    // Extract images
    const images: string[] = [];
    
    // Try Open Graph image
    const ogImage = $('meta[property="og:image"]').attr('content');
    if (ogImage) images.push(ogImage);
    
    // Try Schema.org image
    const schemaImage = $('meta[itemprop="image"]').attr('content');
    if (schemaImage) images.push(schemaImage);
    
    // Try product images
    $('img').each((_, el) => {
      const src = $(el).attr('src');
      if (src && (src.includes('product') || src.includes('catalog'))) {
        images.push(src);
      }
    });

    // Add the first valid image
    if (images.length > 0) {
      product.image = images[0];
      product.images = images;
    }

    // Extract description
    product.description = $('meta[property="og:description"]').attr('content') ||
                         $('meta[name="description"]').attr('content') ||
                         '';

    // Extract color if available
    product.color = $('[data-selected-color]').attr('data-selected-color') ||
                   $('.color-name').first().text().trim() ||
                   '';

    // Use our categorization logic to determine the category
    product.category = categorizeItem({
      name: product.name,
      brand: product.brand,
      color: product.color,
      sourceRetailer: product.sourceRetailer
    });

    // Validate required fields
    if (!product.name || !product.image) {
      throw new Error('Could not identify the product. Please try a different URL or a more popular retailer.');
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