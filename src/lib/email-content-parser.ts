/**
 * Email Content Parser
 * 
 * Utilities to parse HTML content from emails and extract structured product information.
 * This is useful for extracting product details from order confirmation emails, shipping
 * notifications, and other transactional emails.
 */

import { JSDOM } from 'jsdom';
import { EmailMessage } from './gmail-service';
import { MyntraOrderItem } from './email-processor';
import { log } from './logger';

/**
 * Interface for information extracted from tables
 */
export interface TableData {
  headers: string[];
  rows: string[][];
  tableContext?: string; // Heading/context before the table
}

/**
 * Interface for extracted images
 */
export interface ExtractedImage {
  src: string;
  alt?: string;
  width?: string;
  height?: string;
  parentElement?: string; // Tag name of parent element for context
}

/**
 * Interface for extracted links
 */
export interface ExtractedLink {
  href: string;
  text: string;
  title?: string;
  context?: string; // Surrounding text/context
}

/**
 * Generic product data extracted from emails
 */
export interface ExtractedProduct {
  name: string;
  brand?: string;
  price?: string;
  originalPrice?: string;
  discount?: string;
  quantity?: number;
  size?: string;
  color?: string;
  sku?: string;
  category?: string;
  images?: string[];
  productLink?: string;
  description?: string;
}

/**
 * Parse HTML content into a DOM for further processing
 */
export function parseHtml(html: string): Document | null {
  try {
    const dom = new JSDOM(html);
    return dom.window.document;
  } catch (error) {
    log('Error parsing HTML', { error });
    return null;
  }
}

/**
 * Clean text by removing excess whitespace, newlines, etc.
 */
export function cleanText(text: string): string {
  return text
    .replace(/\s+/g, ' ')
    .replace(/\n+/g, ' ')
    .trim();
}

/**
 * Extract all tables from HTML
 */
export function extractTables(html: string): TableData[] {
  const doc = parseHtml(html);
  if (!doc) return [];

  const tables: TableData[] = [];
  const tableElements = doc.querySelectorAll('table');

  tableElements.forEach((table) => {
    // Get table context by looking at previous heading
    let tableContext = '';
    let prevElement = table.previousElementSibling;
    while (prevElement && !tableContext) {
      if (/^h[1-6]$/i.test(prevElement.tagName)) {
        tableContext = cleanText(prevElement.textContent || '');
        break;
      }
      prevElement = prevElement.previousElementSibling;
    }

    // Extract headers
    const headerRow = table.querySelector('tr:first-child');
    const headers: string[] = [];
    if (headerRow) {
      const headerCells = headerRow.querySelectorAll('th, td');
      headerCells.forEach((cell) => {
        headers.push(cleanText(cell.textContent || ''));
      });
    }

    // Extract rows
    const rows: string[][] = [];
    const dataRows = Array.from(table.querySelectorAll('tr')).slice(headers.length ? 1 : 0);
    dataRows.forEach((row) => {
      const cells = row.querySelectorAll('td');
      const rowData: string[] = [];
      cells.forEach((cell) => {
        rowData.push(cleanText(cell.textContent || ''));
      });
      if (rowData.length > 0) {
        rows.push(rowData);
      }
    });

    if (rows.length > 0) {
      tables.push({ headers, rows, tableContext });
    }
  });

  return tables;
}

/**
 * Extract all images from HTML
 */
export function extractImages(html: string): ExtractedImage[] {
  const doc = parseHtml(html);
  if (!doc) return [];

  const images: ExtractedImage[] = [];
  const imgElements = doc.querySelectorAll('img');

  imgElements.forEach((img) => {
    const src = img.getAttribute('src') || '';
    if (!src || src.includes('spacer.gif') || src.includes('pixel.gif') || src.includes('logo')) {
      return; // Skip spacer images, tracking pixels, or logos
    }

    images.push({
      src,
      alt: img.getAttribute('alt') || undefined,
      width: img.getAttribute('width') || undefined,
      height: img.getAttribute('height') || undefined,
      parentElement: img.parentElement?.tagName || undefined
    });
  });

  return images;
}

/**
 * Extract all links from HTML
 */
export function extractLinks(html: string): ExtractedLink[] {
  const doc = parseHtml(html);
  if (!doc) return [];

  const links: ExtractedLink[] = [];
  const linkElements = doc.querySelectorAll('a');

  linkElements.forEach((link) => {
    const href = link.getAttribute('href') || '';
    if (!href || href === '#' || href.toLowerCase().startsWith('mailto:') || href.toLowerCase().includes('unsubscribe')) {
      return; // Skip empty, anchor, mailto, or unsubscribe links
    }

    // Get surrounding context (parent paragraph text, for example)
    let context = '';
    if (link.parentElement) {
      context = cleanText(link.parentElement.textContent || '').replace(cleanText(link.textContent || ''), '').trim();
    }

    links.push({
      href,
      text: cleanText(link.textContent || ''),
      title: link.getAttribute('title') || undefined,
      context: context || undefined
    });
  });

  return links;
}

/**
 * Extract product information from HTML tables
 */
export function extractProductsFromTables(html: string): ExtractedProduct[] {
  const tables = extractTables(html);
  const products: ExtractedProduct[] = [];

  // Find product tables based on their context/headers
  tables.forEach((table) => {
    const { headers, rows, tableContext } = table;
    
    // Skip tables that don't seem to be product tables
    const tableStr = JSON.stringify(table).toLowerCase();
    const isProductTable = 
      tableContext?.toLowerCase().includes('product') || 
      tableContext?.toLowerCase().includes('item') ||
      tableStr.includes('product') || 
      tableStr.includes('item') || 
      tableStr.includes('quantity') || 
      tableStr.includes('price');

    if (!isProductTable) return;
    
    // Map headers to their indices
    const headerMap: Record<string, number> = {};
    headers.forEach((header, index) => {
      const headerLower = header.toLowerCase();
      if (headerLower.includes('product') || headerLower.includes('item') || headerLower.includes('description')) {
        headerMap.name = index;
      } else if (headerLower.includes('price')) {
        headerMap.price = index;
      } else if (headerLower.includes('qty') || headerLower.includes('quantity')) {
        headerMap.quantity = index;
      } else if (headerLower.includes('amount') || headerLower.includes('total')) {
        headerMap.total = index;
      }
    });

    // Process each row to extract product info
    rows.forEach((row) => {
      if (row.every(cell => !cell.trim())) return; // Skip empty rows
      
      // Extract product info from cells
      let product: ExtractedProduct = { name: '' };
      
      if (headerMap.name !== undefined && row[headerMap.name]) {
        product.name = row[headerMap.name];
        
        // Try to extract size and color from name or description
        const sizeMatch = product.name.match(/Size:?\s*([A-Za-z0-9]+)/i);
        if (sizeMatch) product.size = sizeMatch[1];
        
        const colorMatch = product.name.match(/Color:?\s*([A-Za-z]+)/i);
        if (colorMatch) product.color = colorMatch[1];
        
        // Try to extract brand
        const brandMatch = product.name.match(/^([A-Za-z]+(?:'s)?)\s/i);
        if (brandMatch) product.brand = brandMatch[1];
      }
      
      if (headerMap.price !== undefined && row[headerMap.price]) {
        product.price = row[headerMap.price];
      }
      
      if (headerMap.quantity !== undefined && row[headerMap.quantity]) {
        const qty = parseInt(row[headerMap.quantity].replace(/[^0-9]/g, ''));
        if (!isNaN(qty)) product.quantity = qty;
      }
      
      // Only add product if it has a name
      if (product.name.trim()) {
        products.push(product);
      }
    });
  });

  return products;
}

/**
 * Extract product information from unstructured HTML
 */
export function extractProductsFromHtml(html: string): ExtractedProduct[] {
  const doc = parseHtml(html);
  if (!doc) return [];

  const products: ExtractedProduct[] = [];
  
  // Try to find product divs or sections
  const productElements = doc.querySelectorAll('.product, .item, .order-item, [class*="product"], [class*="item"]');
  
  if (productElements.length > 0) {
    // Process structured product elements
    productElements.forEach((element) => {
      const product: ExtractedProduct = { name: '' };
      
      // Extract product name
      const nameElement = element.querySelector('.product-name, .item-name, .title, h3, h4, strong');
      if (nameElement) {
        product.name = cleanText(nameElement.textContent || '');
      }
      
      // Extract price
      const priceElement = element.querySelector('.price, .current-price, [class*="price"]');
      if (priceElement) {
        product.price = cleanText(priceElement.textContent || '');
      }
      
      // Extract original price
      const originalPriceElement = element.querySelector('.original-price, .old-price, .list-price, [class*="original"], [class*="old-price"]');
      if (originalPriceElement) {
        product.originalPrice = cleanText(originalPriceElement.textContent || '');
      }
      
      // Extract quantity
      const quantityElement = element.querySelector('.quantity, .qty, [class*="quantity"], [class*="qty"]');
      if (quantityElement) {
        const qtyText = cleanText(quantityElement.textContent || '');
        const qtyMatch = qtyText.match(/(\d+)/);
        if (qtyMatch) {
          product.quantity = parseInt(qtyMatch[1]);
        }
      }
      
      // Extract image
      const imgElement = element.querySelector('img');
      if (imgElement && imgElement.getAttribute('src')) {
        product.images = [imgElement.getAttribute('src') || ''];
      }
      
      // Extract link
      const linkElement = element.querySelector('a');
      if (linkElement && linkElement.getAttribute('href')) {
        product.productLink = linkElement.getAttribute('href') || '';
      }
      
      // Only add product if it has a name
      if (product.name.trim()) {
        products.push(product);
      }
    });
  } else {
    // Try to extract products from tables
    const tableProducts = extractProductsFromTables(html);
    products.push(...tableProducts);
  }

  return products;
}

/**
 * Extract order information from HTML structure
 */
export function extractOrderInfoFromHtml(html: string): Record<string, string> {
  const doc = parseHtml(html);
  if (!doc) return {};

  const orderInfo: Record<string, string> = {};
  
  // Find elements that typically contain order information
  const orderIdElements = doc.querySelectorAll('[class*="order-id"], [class*="order-number"], [id*="order-id"]');
  
  // Look for patterns in element text content
  if (orderIdElements.length === 0) {
    // Try regex extraction from full HTML - specifically look for Myntra order IDs (MON followed by digits)
    const myntraOrderIdMatch = html.match(/(MON\d+)/i);
    if (myntraOrderIdMatch) {
      orderInfo.orderId = myntraOrderIdMatch[1];
    } else {
      // Try general order ID patterns
      const orderIdMatch = html.match(/order(?:\s+id|\s+number|\s+#)?\s*:?\s*([a-z0-9\-]+)/i);
      if (orderIdMatch) {
        orderInfo.orderId = orderIdMatch[1];
      }
    }
  } else {
    // Extract from matching elements
    orderIdElements.forEach((element) => {
      const text = cleanText(element.textContent || '');
      // Try Myntra specific pattern first
      const myntraMatch = text.match(/(MON\d+)/i);
      if (myntraMatch) {
        orderInfo.orderId = myntraMatch[1];
      } else {
        // Fall back to general pattern
        const match = text.match(/(?:order|confirmation|number)(?:\s+id|\s+number|\s+#)?\s*:?\s*([a-z0-9\-]+)/i);
        if (match) {
          orderInfo.orderId = match[1];
        }
      }
    });
  }
  
  // Extract order date
  const dateMatch = html.match(/order\s+date\s*:?\s*([a-z0-9\-\/\,\s]+)/i);
  if (dateMatch) {
    orderInfo.orderDate = dateMatch[1].trim();
  }
  
  // Extract total amount
  const totalMatch = html.match(/(?:total|amount)\s*:?\s*([\$\£\€\₹]?\s*[0-9\,\.]+)/i);
  if (totalMatch) {
    orderInfo.totalAmount = totalMatch[1].trim();
  }
  
  // Look for table-based order information if not found by regex
  if (!orderInfo.orderId || !orderInfo.orderDate || !orderInfo.totalAmount) {
    const tables = extractTables(html);
    for (const table of tables) {
      for (const row of table.rows) {
        if (row.length >= 2) {
          const label = row[0].toLowerCase();
          const value = row[1];
          
          if (!orderInfo.orderId && (label.includes('order') && (label.includes('id') || label.includes('#') || label.includes('number')))) {
            // Extract Myntra order ID (MON followed by digits)
            const myntraMatch = value.match(/(MON\d+)/i);
            orderInfo.orderId = myntraMatch ? myntraMatch[1] : value;
          }
          
          if (!orderInfo.orderDate && (label.includes('date') || label.includes('placed'))) {
            orderInfo.orderDate = value;
          }
          
          if (!orderInfo.totalAmount && (label.includes('total') || label.includes('amount'))) {
            orderInfo.totalAmount = value;
          }
        }
      }
    }
  }
  
  return orderInfo;
}

/**
 * Process a Myntra email to extract product items using HTML parsing
 * This is a more robust alternative to regex-based extraction
 */
export function extractMyntraProductsFromHtml(email: EmailMessage): MyntraOrderItem[] {
  const emailHtml = email.body?.html || '';
  if (!emailHtml) return [];
  
  const extractedProducts = extractProductsFromHtml(emailHtml);
  
  // Convert to MyntraOrderItem format
  const myntraItems: MyntraOrderItem[] = extractedProducts.map(product => {
    const item: MyntraOrderItem = {
      productName: product.name
    };
    
    // Add additional properties if available
    if (product.brand) item.brand = product.brand;
    if (product.size) item.size = product.size;
    if (product.color) item.color = product.color;
    if (product.category) item.category = product.category;
    if (product.quantity) item.quantity = product.quantity;
    
    // Extract price value
    if (product.price) {
      const priceMatch = product.price.match(/([0-9,]+\.?\d*)/);
      if (priceMatch) {
        item.price = parseFloat(priceMatch[1].replace(/,/g, ''));
      }
    }
    
    // Extract image URL
    if (product.images && product.images.length > 0) {
      item.imageUrl = product.images[0];
    }
    
    return item;
  });
  
  return myntraItems;
}

/**
 * Parse Myntra email with structured approach and fallback to regex
 */
export function parseMyntraEmail(email: EmailMessage) {
  const emailHtml = email.body?.html || '';
  if (!emailHtml) return null;
  
  // Extract order information
  const orderInfo = extractOrderInfoFromHtml(emailHtml);
  
  // Extract product items
  const products = extractMyntraProductsFromHtml(email);
  
  // Extract links for tracking
  const links = extractLinks(emailHtml);
  let trackingUrl = null;
  
  // Find tracking link
  for (const link of links) {
    if (
      link.text.toLowerCase().includes('track') ||
      link.href.toLowerCase().includes('track') ||
      (link.context && link.context.toLowerCase().includes('track'))
    ) {
      trackingUrl = link.href;
      break;
    }
  }
  
  return {
    orderId: orderInfo.orderId,
    orderDate: orderInfo.orderDate ? new Date(orderInfo.orderDate) : undefined,
    totalAmount: orderInfo.totalAmount,
    products,
    trackingUrl
  };
}

/**
 * Main function to extract structured information from any retailer email HTML
 */
export function extractInfoFromEmailHtml(email: EmailMessage): {
  retailer?: string;
  orderInfo: Record<string, string>;
  products: ExtractedProduct[];
  links: ExtractedLink[];
  images: ExtractedImage[];
  tables: TableData[];
} {
  const emailHtml = email.body?.html || '';
  if (!emailHtml) {
    return { orderInfo: {}, products: [], links: [], images: [], tables: [] };
  }
  
  // Determine retailer based on email content
  let retailer = 'unknown';
  const html = emailHtml.toLowerCase();
  const subject = (email.subject || '').toLowerCase();
  
  if (html.includes('myntra') || subject.includes('myntra')) {
    retailer = 'myntra';
  } else if (html.includes('amazon') || subject.includes('amazon')) {
    retailer = 'amazon';
  } else if (html.includes('flipkart') || subject.includes('flipkart')) {
    retailer = 'flipkart';
  } else if (html.includes('ajio') || subject.includes('ajio')) {
    retailer = 'ajio';
  } else if (html.includes('zara') || subject.includes('zara') || 
             html.includes('inditex') || html.includes('zara.com')) {
    retailer = 'zara';
  }
  
  // Extract structured information
  const orderInfo = extractOrderInfoFromHtml(emailHtml);
  const products = extractProductsFromHtml(emailHtml);
  const links = extractLinks(emailHtml);
  const images = extractImages(emailHtml);
  const tables = extractTables(emailHtml);
  
  return {
    retailer,
    orderInfo,
    products,
    links,
    images,
    tables
  };
} 