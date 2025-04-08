import { JSDOM } from 'jsdom';
import { log } from './logger';
import { EmailMessage } from '@/types/gmail';
import { 
  extractImages, 
  extractProductsFromHtml,
  extractZaraProductsFromHtml
} from './email-content-parser';
import { normalizeImageUrl } from './image-utils';

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
 * Extract items from Myntra emails
 */
async function extractMyntraItems(email: EmailMessage): Promise<ExtractedWardrobeItem[]> {
  if (!email.body?.html) return [];
  
  const dom = new JSDOM(email.body.html);
  const document = dom.window.document;
  
  const extractedProducts = extractProductsFromHtml(email.body.html);
  const extractedImages = extractImages(email.body.html);
  
  // Extract order ID from subject or email body
  const orderIdMatch = (email.subject && email.subject.match(/Order #([A-Za-z0-9-_]+)/i)) || 
                       email.body.html.match(/Order #([A-Za-z0-9-_]+)/i) ||
                       email.body.html.match(/Order ID:?\s*([A-Za-z0-9-_]+)/i);
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
      brand: product.brand || 'Myntra',
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      discount: product.discount,
      imageUrl,
      size: product.size,
      color: product.color,
      productLink: product.productLink,
      retailer: 'Myntra',
      emailId: email.id,
      orderId
    };
  });
}

/**
 * Extract items from H&M emails
 */
async function extractHnMItems(email: EmailMessage): Promise<ExtractedWardrobeItem[]> {
  if (!email.body?.html) return [];
  
  const dom = new JSDOM(email.body.html);
  const document = dom.window.document;
  
  const extractedProducts = extractProductsFromHtml(email.body.html);
  const extractedImages = extractImages(email.body.html);
  
  // Extract order ID from subject or email body
  const orderIdMatch = (email.subject && email.subject.match(/order\s*(?:number|#)?\s*:?\s*([A-Za-z0-9-_]+)/i)) || 
                       email.body.html.match(/order\s*(?:number|#)?\s*:?\s*([A-Za-z0-9-_]+)/i);
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
      brand: product.brand || 'H&M',
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      discount: product.discount,
      imageUrl,
      size: product.size,
      color: product.color,
      productLink: product.productLink,
      retailer: 'H&M',
      emailId: email.id,
      orderId
    };
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