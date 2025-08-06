import { JSDOM } from 'jsdom';
import { log } from './logger';
import { EmailMessage } from '@/types/gmail';
import { 
  extractImages, 
  extractProductsFromHtml,
  extractZaraProductsFromHtml
} from './email-content-parser';

/**
 * Interface for extracted wardrobe items from emails
 */
export interface ExtractedWardrobeItem {
  brand?: string;
  name: string;
  price?: string;
  originalPrice?: string;
  discount?: string;
  size?: string;
  color?: string;
  imageUrl?: string;
  productLink?: string;
  retailer: string;
  emailId: string;
  orderId?: string;
  normalizedImageUrl?: string; // Used for deduplication
  reference?: string;
  dominantColor?: string | null;
  colorTag?: string;
}

/**
 * Main function to extract wardrobe items from an email
 */
export async function extractItemsFromEmail(email: EmailMessage, retailer: string): Promise<ExtractedWardrobeItem[]> {
  log('Extracting items from email', { emailId: email.id, retailer });
  
  let items: ExtractedWardrobeItem[] = [];
  
  // Use specialized extractors based on retailer
  switch(retailer.toLowerCase()) {
    case 'myntra':
      items = await extractMyntraItems(email);
      break;
    case 'h&m':
      items = await extractHnMItems(email);
      break;
    case 'zara':
      items = await extractZaraItems(email);
      break;
    default:
      // Use generic extractor for unknown retailers
      items = await extractGenericItems(email, retailer);
  }
  
  // Normalize data and add common fields
  items = items.map(item => ({
    ...item,
    emailId: email.id,
    retailer,
    normalizedImageUrl: item.imageUrl ? normalizeImageUrl(item.imageUrl) : undefined
  }));
  
  log('Extracted items from email', { emailId: email.id, itemCount: items.length });
  return items;
}

/**
 * Normalize image URL for comparison (remove query params, size specs, etc.)
 */
export function normalizeImageUrl(url: string): string {
  try {
    // Remove query parameters
    const baseUrl = url.split('?')[0];
    
    // Remove size specifications like /thumb/, /large/, etc.
    const normalizedUrl = baseUrl.replace(/\/(thumb|small|medium|large|xl|xxl)\//, '/');
    
    // Remove image dimensions like _500x500, _100x100
    return normalizedUrl.replace(/_([\d]+x[\d]+)\./, '.');
  } catch (error) {
    log('Error normalizing image URL', { url, error });
    return url;
  }
}

/**
 * Extract items from Myntra emails using custom parser
 */
export async function extractMyntraItems(email: EmailMessage): Promise<ExtractedWardrobeItem[]> {
  if (!email.body?.html) return [];
  
  log('Extracting Myntra items from email', { emailId: email.id });
  
  const dom = new JSDOM(email.body.html);
  const document = dom.window.document;
  const items: ExtractedWardrobeItem[] = [];
  
  // Extract order ID from the email
  const orderIdElement = document.querySelector('[id="OrderId"]');
  const orderId = orderIdElement?.textContent?.trim();
  
  // Find all product containers
  const productContainers = document.querySelectorAll('.productListContainer, .productListContainerLastBeforeItem');
  
  productContainers.forEach((container, index) => {
    try {
      // Extract product image
      const imageElement = container.querySelector('.productImage') as HTMLImageElement;
      const imageUrl = imageElement?.src;
      
      // Extract brand name
      const brandElement = container.querySelector('[id*="ItemProductBrandName"]');
      const brand = brandElement?.textContent?.trim();
      
      // Extract product name
      const nameElement = container.querySelector('[id*="ItemProductName"]');
      const name = nameElement?.textContent?.trim();
      
      // Extract size
      const sizeElement = container.querySelector('[id*="ItemSize"]');
      const size = sizeElement?.textContent?.trim();
      
      // Extract quantity
      const quantityElement = container.querySelector('[id*="ItemQuantity"]');
      const quantity = quantityElement?.textContent?.trim();
      
      // Extract seller name
      const sellerElement = container.querySelector('[id*="ItemSellerName"]');
      const seller = sellerElement?.textContent?.trim();
      
      // Try to extract price information from the email
      let price: string | undefined;
      let originalPrice: string | undefined;
      let discount: string | undefined;
      
      // Look for price patterns in the email content
      const pricePattern = /₹\s*([\d,]+\.?\d*)/g;
      const prices: string[] = [];
      let priceMatch;
      if (email.body?.html) {
        while ((priceMatch = pricePattern.exec(email.body.html)) !== null) {
          prices.push(priceMatch[1]);
        }
      }
      
      // If we found prices, use them
      if (prices.length >= 2) {
        originalPrice = `₹${prices[0]}`;
        price = `₹${prices[1]}`;
        
        // Calculate discount
        const original = parseFloat(prices[0].replace(/,/g, ''));
        const current = parseFloat(prices[1].replace(/,/g, ''));
        if (original > current) {
          const discountPercent = Math.round(((original - current) / original) * 100);
          discount = `${discountPercent}% OFF`;
        }
      }
      
      // Create product link (Myntra doesn't always include direct product links in emails)
      const productLink = imageUrl ? imageUrl.replace(/assets\.myntassets\.com.*/, 'myntra.com/product') : undefined;
      
      if (name && brand) {
        const item: ExtractedWardrobeItem = {
          brand,
          name,
          price,
          originalPrice,
          discount,
          size,
          color: undefined, // Myntra emails don't always include color info
          imageUrl,
          productLink,
          retailer: 'Myntra',
          emailId: email.id,
          orderId,
          reference: quantity ? `Qty: ${quantity}` : undefined
        };
        
        items.push(item);
        log('Extracted Myntra item', { 
          brand, 
          name, 
          size, 
          quantity,
          price 
        });
      }
    } catch (error) {
      log('Error extracting Myntra item', { error, index });
    }
  });
  
  log('Myntra extraction completed', { emailId: email.id, itemCount: items.length });
  return items;
}

/**
 * Extract items from H&M emails using pattern-based parser
 */
export async function extractHnMItems(email: EmailMessage): Promise<ExtractedWardrobeItem[]> {
  if (!email.body?.html) return [];
  
  log('Extracting H&M items from email', { emailId: email.id });
  
  // Decode quoted-printable content
  const decodedContent = decodeQuotedPrintable(email.body.html);
  log('Decoded H&M email content', { 
    originalLength: email.body.html.length, 
    decodedLength: decodedContent.length 
  });
  
  const items: ExtractedWardrobeItem[] = [];
  
  // Extract order ID from subject or email body
  const orderIdMatch = (email.subject && email.subject.match(/order\s*(?:number|#)?\s*:?\s*([A-Za-z0-9-_]+)/i)) || 
                       decodedContent.match(/order\s*(?:number|#)?\s*:?\s*([A-Za-z0-9-_]+)/i);
  const orderId = orderIdMatch ? orderIdMatch[1] : 'unknown';
  
  log('Extracted order ID', { orderId });
  
  // Pattern to match H&M product listings
  // Format: (https://www2.hm.com/en_in/productpage.XXXXX.html?...) Product Name
  const productPattern = /\(https:\/\/www2\.hm\.com\/en_in\/productpage\.(\d+)\.html[^)]*\)\s*([^\n\r]+?)(?=\s*₹|\s*Art\.|$)/gi;
  
  let match;
  let productCount = 0;
  
  while ((match = productPattern.exec(decodedContent)) !== null) {
    productCount++;
    const productId = match[1];
    const productName = match[2].trim();
    
    log('Found H&M product', { productCount, productId, productName });
    
    // Extract additional details from the text following this product
    const afterMatch = decodedContent.substring(match.index + match[0].length);
    const nextProductMatch = afterMatch.match(/\(https:\/\/www2\.hm\.com\/en_in\/productpage\.\d+\.html/);
    const endIndex = nextProductMatch ? nextProductMatch.index : afterMatch.length;
    const productDetails = afterMatch.substring(0, endIndex);
    
    // Extract price
    const priceMatch = productDetails.match(/₹\s*([\d,]+\.?\d*)/);
    const price = priceMatch ? parseFloat(priceMatch[1].replace(/,/g, '')) : 0;
    
    // Extract original price
    const originalPriceMatch = productDetails.match(/₹\s*[\d,]+\.?\d*\s*₹\s*([\d,]+\.?\d*)/);
    const originalPrice = originalPriceMatch ? parseFloat(originalPriceMatch[1].replace(/,/g, '')) : price;
    
    // Extract Art. No.
    const artNoMatch = productDetails.match(/Art\.\s*No\.(\d+)/);
    const artNo = artNoMatch ? artNoMatch[1] : '';
    
    // Extract color
    const colorMatch = productDetails.match(/Color([^\n\r]+)/);
    const color = colorMatch ? colorMatch[1].trim() : '';
    
    // Extract size
    const sizeMatch = productDetails.match(/Size([^\n\r]+)/);
    const size = sizeMatch ? sizeMatch[1].trim() : '';
    
    // Extract quantity
    const quantityMatch = productDetails.match(/Quantity(\d+)/);
    const quantity = quantityMatch ? parseInt(quantityMatch[1]) : 1;
    
    // Construct product URL
    const productUrl = `https://www2.hm.com/en_in/productpage.${productId}.html`;
    
    // Extract image URL (try to find it in the original HTML)
    const imageUrlMatch = email.body.html.match(new RegExp(`https://[^"'\s]*${productId}[^"'\s]*\.(?:jpg|jpeg|png|webp)`, 'i'));
    const imageUrl = imageUrlMatch ? imageUrlMatch[0] : '';
    
    log('Extracted H&M product details', {
      productCount,
      name: productName,
      price,
      originalPrice,
      color,
      size,
      quantity,
      artNo,
      imageUrl: imageUrl ? 'found' : 'not found'
    });
    
    const item: ExtractedWardrobeItem = {
      name: productName,
      brand: 'H&M',
      price: price.toString(),
      originalPrice: originalPrice.toString(),
      discount: originalPrice > price ? `${Math.round(((originalPrice - price) / originalPrice) * 100)}% OFF` : '',
      imageUrl: imageUrl,
      productLink: productUrl,
      size: size,
      color: color,
      retailer: 'H&M',
      emailId: email.id,
      orderId: orderId
    };
    
    items.push(item);
  }
  
  log('H&M extraction completed', { emailId: email.id, itemCount: items.length });
  return items;
}

/**
 * Decode quoted-printable encoded content
 */
function decodeQuotedPrintable(content: string): string {
  return content
    .replace(/=\r?\n/g, '') // Remove soft line breaks
    .replace(/=([0-9A-F]{2})/gi, (match, hex) => {
      return String.fromCharCode(parseInt(hex, 16));
    });
}

/**
 * Extract items from Zara emails
 */
async function extractZaraItems(email: EmailMessage): Promise<ExtractedWardrobeItem[]> {
  if (!email.body?.html) return [];
  
  // Use the specialized Zara extraction function
  const extractedProducts = extractZaraProductsFromHtml(email.body.html);
  const extractedImages = extractImages(email.body.html);
  
  // Extract order ID from subject or email body
  // Zara order numbers are typically numeric, sometimes prefixed with "#"
  const orderIdMatch = (email.subject && email.subject.match(/Order\s+[#:]?\s*([A-Za-z0-9-_]+)/i)) || 
                       email.body.html.match(/Order\s+[#:]?\s*([A-Za-z0-9-_]+)/i) ||
                       email.body.html.match(/Order\s+(?:number|reference|ID)[#:]?\s*([A-Za-z0-9-_]+)/i);
  const orderId = orderIdMatch ? orderIdMatch[1] : undefined;
  
  return extractedProducts.map(product => {
    // Find the best image for this product
    let imageUrl: string | undefined = undefined;
    
    // First check if the product already has images
    if (product.images && product.images.length > 0) {
      imageUrl = product.images[0];
    } else {
      // Try to match images with product by alt text or context
      const matchingImage = extractedImages.find(img => 
        (img.alt && product.name && img.alt.includes(product.name)) ||
        (img.alt && product.brand && img.alt.includes(product.brand))
      );
      
      if (matchingImage) {
        imageUrl = matchingImage.src;
      }
    }
    
    return {
      brand: product.brand || 'Zara',
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      discount: product.discount,
      imageUrl,
      size: product.size,
      color: product.color,
      productLink: product.productLink,
      retailer: 'Zara',
      emailId: email.id,
      orderId,
      reference: product.reference
    };
  });
}

/**
 * Generic extractor for unknown retailers
 */
async function extractGenericItems(email: EmailMessage, retailer: string): Promise<ExtractedWardrobeItem[]> {
  if (!email.body?.html) return [];
  
  const extractedProducts = extractProductsFromHtml(email.body.html);
  const extractedImages = extractImages(email.body.html);
  
  // Generic order ID extraction pattern
  const orderIdMatch = (email.subject && email.subject.match(/order\s*(?:number|#|ID)?\s*:?\s*([A-Za-z0-9-_]+)/i)) || 
                       email.body.html.match(/order\s*(?:number|#|ID)?\s*:?\s*([A-Za-z0-9-_]+)/i);
  const orderId = orderIdMatch ? orderIdMatch[1] : undefined;
  
  return extractedProducts.map(product => {
    let imageUrl: string | undefined = undefined;
    
    if (product.images && product.images.length > 0) {
      imageUrl = product.images[0];
    } else {
      const matchingImage = extractedImages.find(img => 
        (img.alt && product.name && img.alt.includes(product.name)) ||
        (img.alt && product.brand && img.alt.includes(product.brand))
      );
      
      if (matchingImage) {
        imageUrl = matchingImage.src;
      }
    }
    
    return {
      brand: product.brand || retailer,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      discount: product.discount,
      imageUrl,
      size: product.size,
      color: product.color,
      productLink: product.productLink,
      retailer,
      emailId: email.id,
      orderId
    };
  });
} 