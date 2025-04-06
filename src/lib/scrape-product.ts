import { log } from '@/lib/logger';
import puppeteer from 'puppeteer';
import { categorizeItem } from './categorize-items';
import * as cheerio from 'cheerio';

// Define the MyntraProduct interface here for better isolation
interface MyntraProduct {
  brand: string;
  name: string;
  price: string;
  originalPrice?: string;
  discount?: string;
  sizes?: string[];
  colors?: string[];
  images?: string[];
  description?: string;
  image?: string;
  myntraLink?: string;
  productLink?: string;
  category?: string;
  subCategory?: string;
  color?: string;
  pattern?: string;
  fabric?: string;
  dateAdded: string;
  size?: string;
  quantity?: string;
  seller?: string;
  sourceRetailer?: string;
  id: string;
}

// Create a helper function to use categorizeItem safely
function getCategoryForProduct(product: MyntraProduct): string {
  // If the product already has a category, return it
  if (product.category) {
    return product.category;
  }
  
  // Create a simplified object that matches what categorizeItem expects
  const itemForCategorization = {
    name: product.name,
    brand: product.brand,
    color: product.color,
    sourceRetailer: product.sourceRetailer
  };
  
  // Call categorizeItem with our simplified object
  return categorizeItem(itemForCategorization);
}

/**
 * Scrape product information from any e-commerce website
 * This is a universal scraper that tries to extract relevant product data
 * 
 * @param url The URL of the product page
 * @returns Product data with fields filled in as much as possible
 */
export async function scrapeProduct(url: string): Promise<MyntraProduct> {
  const hostname = new URL(url).hostname;
  const sourceRetailer = getRetailerName(hostname);
  log('Scraping product', { url, sourceRetailer });

  let browser;
  try {
    log('Launching browser...');
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--window-size=1920x1080'
      ]
    });

    log('Creating new page...');
    const page = await browser.newPage();
    
    // Set a realistic user agent
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');
    
    // Set viewport
    await page.setViewport({ width: 1920, height: 1080 });

    // Enable JavaScript console logging for debugging
    page.on('console', msg => log('Browser console:', { message: msg.text() }));

    log('Navigating to URL:', { url });
    await page.goto(url, { 
      waitUntil: ['networkidle0', 'domcontentloaded'],
      timeout: 30000 
    });

    // Extract the product data from the page
    const productData = await page.evaluate((retailer) => {
      // Helper function to clean text
      const cleanText = (text: string | null | undefined): string => {
        if (!text) return '';
        return text.trim().replace(/\s+/g, ' ');
      };

      // Try to find the product name
      const findProductName = (): string => {
        // Common selectors for product names
        const nameSelectors = [
          'h1.product-name', 'h1.pdp-name', 'h1.product-title',
          '.product-name', '.pdp-name', '.product-title',
          'h1[itemprop="name"]', '[data-testid="product-name"]',
          'h1.title', '.product-detail__name', '.product-single__title',
          'h1.product-title', '.product_title'
        ];
        
        for (const selector of nameSelectors) {
          const element = document.querySelector(selector);
          if (element && element.textContent) {
            return cleanText(element.textContent);
          }
        }

        // Try meta tags
        const metaTitle = document.querySelector('meta[property="og:title"]');
        if (metaTitle) {
          return cleanText(metaTitle.getAttribute('content'));
        }

        // Fallback to page title
        const pageTitle = document.title;
        if (pageTitle) {
          // Attempt to clean page title (often includes site name)
          const cleanedTitle = pageTitle.split('|')[0].split('-')[0].trim();
          return cleanText(cleanedTitle);
        }

        return '';
      };

      // Try to find product brand
      const findProductBrand = (): string => {
        // Common selectors for brand names
        const brandSelectors = [
          '.brand-name', '.product-brand', '[itemprop="brand"]', 
          '.pdp-title .brand-name', '.product-detail__brand',
          '[data-testid="product-brand"]', '.product-single__vendor'
        ];
        
        for (const selector of brandSelectors) {
          const element = document.querySelector(selector);
          if (element && element.textContent) {
            return cleanText(element.textContent);
          }
        }

        // Try meta tags
        const metaBrand = document.querySelector('meta[property="product:brand"]');
        if (metaBrand) {
          return cleanText(metaBrand.getAttribute('content'));
        }

        // Fallback to extracting from URL or title
        if (retailer && retailer !== 'Unknown') {
          return retailer;
        }

        return '';
      };

      // Try to find product price
      const findProductPrice = (): { price: string, originalPrice: string, discount: string } => {
        // Default result
        const result = { price: '', originalPrice: '', discount: '' };
        
        // Common selectors for product prices
        const priceSelectors = [
          '.pdp-price', '.product-price', '[itemprop="price"]',
          '.price', '.current-price', '[data-testid="product-price"]',
          '.product-single__price', '.product-details__price'
        ];
        
        for (const selector of priceSelectors) {
          const element = document.querySelector(selector);
          if (element && element.textContent) {
            result.price = cleanText(element.textContent)
              .replace(/[^\d.,]/g, '') // Keep only digits, dots and commas
              .trim();
            break;
          }
        }

        // Try meta tags for price
        if (!result.price) {
          const metaPrice = document.querySelector('meta[property="product:price:amount"]');
          if (metaPrice) {
            result.price = cleanText(metaPrice.getAttribute('content')) || '';
          }
        }

        // Try to find original price
        const originalPriceSelectors = [
          '.pdp-mrp', '.original-price', '.was-price', '.regular-price',
          '.list-price', '.compare-price', '[data-testid="product-original-price"]'
        ];
        
        for (const selector of originalPriceSelectors) {
          const element = document.querySelector(selector);
          if (element && element.textContent) {
            result.originalPrice = cleanText(element.textContent)
              .replace(/[^\d.,]/g, '')
              .trim();
            break;
          }
        }

        // Calculate discount if we have both prices
        if (result.price && result.originalPrice) {
          try {
            const price = parseFloat(result.price.replace(/,/g, ''));
            const originalPrice = parseFloat(result.originalPrice.replace(/,/g, ''));
            
            if (!isNaN(price) && !isNaN(originalPrice) && originalPrice > price) {
              const discountPercentage = Math.round((1 - price / originalPrice) * 100);
              result.discount = `${discountPercentage}%`;
            }
          } catch (e) {
            // Ignore discount calculation errors
          }
        } else {
          // Try to find discount directly
          const discountSelectors = [
            '.pdp-discount', '.discount', '.sale-tag', '.percent-off'
          ];
          
          for (const selector of discountSelectors) {
            const element = document.querySelector(selector);
            if (element && element.textContent) {
              result.discount = cleanText(element.textContent);
              break;
            }
          }
        }

        return result;
      };

      // Try to find product images
      const findProductImages = (): string[] => {
        const images: string[] = [];
        
        // First try open graph image
        const metaImage = document.querySelector('meta[property="og:image"]');
        if (metaImage) {
          const imageSrc = metaImage.getAttribute('content');
          if (imageSrc) images.push(imageSrc);
        }
        
        // Try product image selectors
        const imageSelectors = [
          // Primary product image
          '.image-grid-imageContainer img', '.pdp-image img', 
          '.product-image img', '.product-featured-img',
          '[data-testid="product-image"]', '.product-single__photo',
          // Image galleries
          '.thumbnail-slider img', '.product-image-thumbnail img',
          '.product-gallery img', '.product-thumbnails img'
        ];
        
        for (const selector of imageSelectors) {
          const elements = document.querySelectorAll(selector);
          elements.forEach(el => {
            // Try different image attribute patterns
            const src = el.getAttribute('src') || 
                      el.getAttribute('data-src') || 
                      el.getAttribute('data-lazy-src') ||
                      el.getAttribute('srcset')?.split(',')[0]?.trim().split(' ')[0];
            
            if (src && !images.includes(src)) {
              // Convert relative URLs to absolute
              if (src.startsWith('/')) {
                const baseUrl = window.location.origin;
                images.push(`${baseUrl}${src}`);
              } else {
                images.push(src);
              }
            }
          });
        }
        
        return images;
      };

      // Try to find product color
      const findProductColor = (): string => {
        // Common selectors for color information
        const colorSelectors = [
          '.color-label', '.selected-color', '[data-testid="product-color"]',
          '.product-single__color', '.color-swatch--selected',
          '.color-name', '.color-option.selected', '.color-selection'
        ];
        
        for (const selector of colorSelectors) {
          const element = document.querySelector(selector);
          if (element && element.textContent) {
            return cleanText(element.textContent);
          }
        }

        // Look for "Color:" labels with adjacent text
        const colorLabels = Array.from(document.querySelectorAll('*'))
          .filter(el => el.textContent?.includes('Color:'));
        
        for (const label of colorLabels) {
          // Try to get the text node immediately after the label
          const text = label.textContent?.split('Color:')[1]?.trim();
          if (text) return text;
        }

        return '';
      };

      // Try to find product size
      const findProductSize = (): string => {
        // Look for selected size
        const selectedSizeSelectors = [
          '.size-buttons-selected-size', '.selected-size',
          '.size-swatch--selected', '.size-option.selected'
        ];
        
        for (const selector of selectedSizeSelectors) {
          const element = document.querySelector(selector);
          if (element && element.textContent) {
            return cleanText(element.textContent);
          }
        }

        // Look for "Size:" labels with adjacent text
        const sizeLabels = Array.from(document.querySelectorAll('*'))
          .filter(el => el.textContent?.includes('Size:'));
        
        for (const label of sizeLabels) {
          // Try to get the text node immediately after the label
          const text = label.textContent?.split('Size:')[1]?.trim();
          if (text) return text;
        }

        return '';
      };

      // Try to find product description
      const findProductDescription = (): string => {
        // Common selectors for product descriptions
        const descriptionSelectors = [
          '.pdp-product-description-content', '.product-description',
          '[itemprop="description"]', '.description', '.product-details__description',
          '[data-testid="product-description"]', '.product-single__description'
        ];
        
        for (const selector of descriptionSelectors) {
          const element = document.querySelector(selector);
          if (element && element.textContent) {
            return cleanText(element.textContent);
          }
        }

        // Try meta description
        const metaDescription = document.querySelector('meta[property="og:description"]');
        if (metaDescription) {
          return cleanText(metaDescription.getAttribute('content'));
        }

        return '';
      };

      // Try to find product category from breadcrumbs
      const findProductCategory = (): string => {
        // Common selectors for breadcrumbs
        const breadcrumbSelectors = [
          '.breadcrumb', '.breadcrumbs', '.product-breadcrumb',
          '[data-testid="breadcrumb"]', '.breadcrumb-trail'
        ];
        
        for (const selector of breadcrumbSelectors) {
          const element = document.querySelector(selector);
          if (element && element.textContent) {
            const items = Array.from(element.querySelectorAll('a, li, span'))
              .map(item => cleanText(item.textContent))
              .filter(text => text.length > 0 && text !== 'Home' && text !== 'Back');
            
            // Return the last 2 items in the breadcrumb if available
            if (items.length >= 2) {
              return `${items[items.length - 2]} > ${items[items.length - 1]}`;
            } else if (items.length === 1) {
              return items[0];
            }
          }
        }

        return '';
      };

      // Extract and return all the product data
      const name = findProductName();
      const brand = findProductBrand();
      const { price, originalPrice, discount } = findProductPrice();
      const images = findProductImages();
      const color = findProductColor();
      const size = findProductSize();
      const description = findProductDescription();
      const category = findProductCategory();
      
      return {
        name,
        brand,
        price,
        originalPrice,
        discount,
        images,
        color,
        size,
        description,
        category,
        image: images.length > 0 ? images[0] : ''
      };
    }, sourceRetailer);

    await browser.close();
    log('Browser closed');

    // Generate a unique ID for the product
    const id = generateProductId();
    
    // Create a standardized product object
    const product: MyntraProduct = {
      id,
      brand: productData.brand || sourceRetailer || 'Unknown Brand',
      name: productData.name || 'Unknown Product',
      price: productData.price || '',
      originalPrice: productData.originalPrice || '',
      discount: productData.discount || '',
      image: productData.image || '',
      images: productData.images || [],
      description: productData.description || '',
      color: productData.color || '',
      size: productData.size || '',
      productLink: url,
      sourceRetailer,
      category: productData.category || '',
      dateAdded: new Date().toISOString()
    };

    // If no category was found, attempt to determine it using categorizeItem
    if (!product.category) {
      product.category = getCategoryForProduct(product);
    }

    log('Successfully extracted product data', { productUrl: url, productName: product.name });
    return product;
  } catch (error) {
    log('Error with puppeteer scraping, trying fallback with cheerio', { error, url });
    
    if (browser) {
      await browser.close();
      log('Browser closed after error');
    }
    
    // Try fallback with cheerio
    try {
      log('Attempting cheerio fallback for', { url });
      
      // Fetch the HTML content
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch page: ${response.status}`);
      }
      
      const html = await response.text();
      const $ = cheerio.load(html);
      
      // Extract basic information using cheerio
      const productName = $('h1').first().text().trim() || 
                       $('meta[property="og:title"]').attr('content') ||
                       $('title').text().split('|')[0].trim();
      
      const productImage = $('meta[property="og:image"]').attr('content') || 
                        $('meta[property="og:image:url"]').attr('content') ||
                        $('img').first().attr('src');
      
      const productDescription = $('meta[property="og:description"]').attr('content') || '';
      
      // Generate a unique ID for the product
      const id = generateProductId();
      
      // Create a standardized product object with the limited information we have
      const product: MyntraProduct = {
        id,
        brand: sourceRetailer || 'Unknown Brand',
        name: productName || 'Unknown Product',
        price: '',
        image: productImage || '',
        description: productDescription,
        productLink: url,
        sourceRetailer,
        dateAdded: new Date().toISOString()
      };
      
      // Determine category
      product.category = getCategoryForProduct(product);
      
      log('Successfully extracted basic product data with cheerio', { productUrl: url, productName: product.name });
      return product;
    } catch (cheerioError) {
      log('Error with cheerio fallback', { error: cheerioError, url });
      
      // Return a minimal product object with the URL
      return {
        id: generateProductId(),
        brand: 'Unknown Brand',
        name: 'Unknown Product',
        price: '',
        productLink: url,
        sourceRetailer,
        dateAdded: new Date().toISOString()
      };
    }
  }
}

/**
 * Generate a unique ID for a product
 */
function generateProductId(): string {
  return `prod_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Extract retailer name from hostname
 */
function getRetailerName(hostname: string): string {
  // Map of known domains to retailer names
  const retailerMap: Record<string, string> = {
    'myntra.com': 'Myntra',
    'hm.com': 'H&M',
    'zara.com': 'Zara',
    'asos.com': 'ASOS',
    'amazon.com': 'Amazon',
    'amazon.in': 'Amazon',
    'flipkart.com': 'Flipkart',
    'ajio.com': 'AJIO',
    'tatacliq.com': 'Tata CLiQ',
    'nordstrom.com': 'Nordstrom',
    'macys.com': 'Macy\'s',
    'uniqlo.com': 'UNIQLO',
    'gap.com': 'GAP',
    'nike.com': 'Nike',
    'adidas.com': 'Adidas',
    'gucci.com': 'Gucci',
    'louisvuitton.com': 'Louis Vuitton',
    'chanel.com': 'Chanel',
    'prada.com': 'Prada',
    'dior.com': 'Dior',
    'burberry.com': 'Burberry',
    'coach.com': 'Coach',
    'michaelkors.com': 'Michael Kors',
    'farfetch.com': 'Farfetch',
    'ssense.com': 'SSENSE',
    'net-a-porter.com': 'Net-A-Porter',
    'mrporter.com': 'Mr Porter',
    'revolve.com': 'REVOLVE',
    'fashionnova.com': 'Fashion Nova',
    'nastygal.com': 'Nasty Gal',
    'boohoo.com': 'Boohoo',
    'shein.com': 'SHEIN'
  };

  // Extract domain without subdomains
  const domain = hostname.split('.').slice(-2).join('.');
  
  // Check if the domain is in our map
  if (domain in retailerMap) {
    return retailerMap[domain];
  }
  
  // For subdomains like country codes (e.g., uk.asos.com)
  for (const [key, value] of Object.entries(retailerMap)) {
    if (hostname.includes(key)) {
      return value;
    }
  }
  
  // Try to extract from the hostname
  const brandPart = hostname.split('.')[0];
  if (brandPart && brandPart !== 'www') {
    // Capitalize first letter of each word
    return brandPart
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  
  return 'Unknown';
} 