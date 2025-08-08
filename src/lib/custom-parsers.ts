import { JSDOM } from 'jsdom';
import { GmailServiceTypes } from '@/types/gmail';
import { log } from './logger';
import { ExtractedProduct } from './unified-product-extractor';

export class CustomParsers {
  private parsers: Record<string, BaseParser> = {
    'myntra': new MyntraParser(),
    'h&m': new HMParser(),
    'hm': new HMParser(),
    'zara': new ZaraParser()
  };

  async parse(email: GmailServiceTypes.EmailMessage, retailer: string): Promise<ExtractedProduct[]> {
    const parser = this.parsers[retailer.toLowerCase()];
    if (!parser) {
      throw new Error(`No custom parser available for ${retailer}`);
    }
    
    return await parser.parse(email);
  }

  supportsRetailer(email: GmailServiceTypes.EmailMessage): boolean {
    const retailer = this.detectRetailer(email);
    return !!this.parsers[retailer];
  }

  private detectRetailer(email: GmailServiceTypes.EmailMessage): string {
    const content = (email.body?.html || '').toLowerCase();
    const subject = (email.subject || '').toLowerCase();
    
    if (content.includes('myntra') || subject.includes('myntra')) return 'myntra';
    if (content.includes('hm.com') || subject.includes('h&m') || subject.includes('hm')) return 'h&m';
    if (content.includes('zara.com') || subject.includes('zara')) return 'zara';
    
    return 'unknown';
  }
}

abstract class BaseParser {
  protected extractText(element: Element | null, selectors: string): string {
    if (!element) return '';
    
    for (const selector of selectors.split(',')) {
      const found = element.querySelector(selector.trim());
      if (found) {
        return this.cleanText(found.textContent || '');
      }
    }
    
    return this.cleanText(element.textContent || '');
  }

  protected cleanText(text: string): string {
    return text.replace(/\s+/g, ' ').trim();
  }

  protected extractImageUrl(element: Element): string {
    const img = element.querySelector('img');
    return img?.getAttribute('src') || '';
  }

  protected extractLink(element: Element): string {
    const link = element.querySelector('a');
    return link?.getAttribute('href') || '';
  }

  abstract parse(email: GmailServiceTypes.EmailMessage): Promise<ExtractedProduct[]>;
}

class MyntraParser extends BaseParser {
  async parse(email: GmailServiceTypes.EmailMessage): Promise<ExtractedProduct[]> {
    if (!email.body?.html) return [];
    
    log('Parsing Myntra email with custom parser', { emailId: email.id });
    
    const dom = new JSDOM(email.body.html);
    const document = dom.window.document;
    const products: ExtractedProduct[] = [];
    
    // Extract order ID
    const orderIdElement = document.querySelector('[id="OrderId"]');
    const orderId = orderIdElement?.textContent?.trim() || '';
    
    // Find all product containers
    const productContainers = document.querySelectorAll('.productListContainer, .productListContainerLastBeforeItem');
    
    productContainers.forEach((container, index) => {
      try {
        const product: ExtractedProduct = {
          name: this.extractText(container, '[id*="ItemProductName"]'),
          brand: this.extractText(container, '[id*="ItemProductBrandName"]'),
          size: this.extractText(container, '[id*="ItemSize"]'),
          imageUrl: this.extractImageUrl(container),
          productLink: this.extractLink(container),
          retailer: 'Myntra',
          emailId: email.id,
          orderId
        };
        
        // Extract quantity
        const quantityText = this.extractText(container, '[id*="ItemQuantity"]');
        if (quantityText) {
          const qtyMatch = quantityText.match(/(\d+)/);
          if (qtyMatch) {
            product.quantity = parseInt(qtyMatch[1]);
          }
        }
        
        // Extract seller
        const seller = this.extractText(container, '[id*="ItemSellerName"]');
        if (seller) {
          product.brand = seller; // Use seller as brand if no brand found
        }
        
        if (product.name) {
          products.push(product);
        }
      } catch (error) {
        log('Error parsing Myntra product container', { error, index });
      }
    });
    
    log('Myntra parser results', { emailId: email.id, productCount: products.length });
    return products;
  }
}

class HMParser extends BaseParser {
  async parse(email: GmailServiceTypes.EmailMessage): Promise<ExtractedProduct[]> {
    if (!email.body?.html) return [];
    
    log('Parsing H&M email with custom parser', { emailId: email.id });
    
    const dom = new JSDOM(email.body.html);
    const document = dom.window.document;
    const products: ExtractedProduct[] = [];
    
    // Extract order ID from subject or content
    const orderIdMatch = (email.subject && email.subject.match(/order\s*(?:number|#)?\s*:?\s*([A-Za-z0-9-_]+)/i)) || 
                         email.body.html.match(/order\s*(?:number|#)?\s*:?\s*([A-Za-z0-9-_]+)/i);
    const orderId = orderIdMatch ? orderIdMatch[1] : '';
    
    // Primary: legacy structure
    let productRows = document.querySelectorAll('tr.pl-articles-table-row');
    
    productRows.forEach((row, index) => {
      try {
        // Extract product name - look for font elements with product name styling
        const nameElement = row.querySelector('font[style*="color:#222222"][style*="text-decoration:none"]');
        const productName = nameElement?.textContent?.trim() || '';
        
        if (!productName) return; // Skip if no product name found
        
        // Extract current price (red text)
        const priceElement = row.querySelector('font[style*="color: #CE2129"]');
        const price = priceElement?.textContent?.replace(/[^\d,]/g, '').trim() || '';
        
        // Extract original price (strikethrough text)
        const originalPriceElement = row.querySelector('s font[style*="font-weight: 600"]');
        const originalPrice = originalPriceElement?.textContent?.replace(/[^\d,]/g, '').trim() || '';
        
        // Extract image URL
        const imgElement = row.querySelector('img[src*="assets.hm.com/articles/"]');
        const imageUrl = imgElement?.getAttribute('src') || '';
        
        // Extract product link
        const linkElement = row.querySelector('a[href*="www2.hm.com/en_in/productpage."]');
        const productLink = linkElement?.getAttribute('href') || '';
        
        // Extract product details from the table
        const detailsTable = row.querySelector('table');
        let artNo = '', color = '', size = '', quantity = '1';
        
        if (detailsTable) {
          const rows = detailsTable.querySelectorAll('tr');
          rows.forEach(detailRow => {
            const cells = detailRow.querySelectorAll('td');
            if (cells.length >= 2) {
              const label = cells[0]?.textContent?.trim().toLowerCase();
              const value = cells[1]?.textContent?.trim();
              
              if (label?.includes('art. no.') && value) {
                artNo = value;
              } else if (label?.includes('color') && value) {
                color = value;
              } else if (label?.includes('size') && value) {
                size = value;
              } else if (label?.includes('quantity') && value) {
                quantity = value;
              }
            }
          });
        }
        
        // Calculate discount if both prices are available
        let discount = '';
        if (price && originalPrice) {
          const priceNum = parseFloat(price.replace(/,/g, ''));
          const originalPriceNum = parseFloat(originalPrice.replace(/,/g, ''));
          if (originalPriceNum > priceNum) {
            const discountAmount = originalPriceNum - priceNum;
            discount = `₹${discountAmount.toFixed(2)}`;
          }
        }
        
        const product: ExtractedProduct = {
          name: productName,
          brand: 'H&M',
          price: price ? `₹${price}` : '',
          originalPrice: originalPrice ? `₹${originalPrice}` : '',
          discount,
          size,
          color,
          imageUrl,
          productLink,
          quantity: parseInt(quantity) || 1,
          retailer: 'H&M',
          emailId: email.id,
          orderId,
          reference: artNo
        };
        
        products.push(product);
        
      } catch (error) {
        log('Error parsing H&M product row', { error, index });
      }
    });

    // Fallback: forwarded email structure (anchors with product links wrapped by parcel-api forwards)
    if (products.length === 0) {
      const seenKeys = new Set<string>();
      const anchors = Array.from(document.querySelectorAll('a[href*="parcel-api.delivery.hm.com/click"]')) as HTMLAnchorElement[];

      const extractProductUrl = (href: string): string => {
        try {
          const decodedHref = decodeURIComponent(href);
          // Try to extract the "to=" param which itself is URL-encoded/base64-ish content containing the real URL
          const toParamMatch = decodedHref.match(/[?&]to=([^&]+)/i);
          if (toParamMatch) {
            const toParam = decodeURIComponent(toParamMatch[1]);
            const urlMatch = toParam.match(/https?:\/\/[^\s"']*productpage\.[^\s"']+/i);
            if (urlMatch) return urlMatch[0];
          }
          // Fallback: scan whole decoded href
          const directMatch = decodedHref.match(/https?:\/\/[^\s"']*productpage\.[^\s"']+/i);
          return directMatch ? directMatch[0] : href;
        } catch {
          return href;
        }
      };

      anchors.forEach((a, index) => {
        try {
          // Candidate must contain a details table with Art. No., Color, Size, Quantity
          const detailsTable = a.querySelector('table');
          const detailsText = (detailsTable?.textContent || '').toLowerCase();
          const looksLikeProduct = detailsTable && detailsText.includes('art. no') && detailsText.includes('color') && detailsText.includes('size');
          if (!looksLikeProduct) return;

          // Name: first dark font inside anchor
          const nameEl = a.querySelector('font[style*="color:#222222"][style*="text-decoration:none"], font[style*="color:#222222"]');
          const productName = this.cleanText(nameEl?.textContent || '');
          if (!productName) return;

          // Product link (decode parcel forward)
          const productLink = extractProductUrl(a.getAttribute('href') || '');

          // Container row and product image
          const containerTr = a.closest('tr');
          const img = containerTr?.querySelector('img[src*="assets.hm.com/articles/"]') as HTMLImageElement | null;
          const imageUrl = img?.getAttribute('src') || '';

          // Price from any nearby font containing a rupee amount
          let price = '';
          const priceFont = Array.from(a.querySelectorAll('font')).find(f => /₹|Rs\.?|INR/i.test(f.textContent || ''));
          if (priceFont) {
            const m = (priceFont.textContent || '').match(/([₹RsINR\.]\s*)?([\d,]+(?:\.\d+)?)/i);
            if (m) price = m[2];
          }

          // Detail rows
          let artNo = '', color = '', size = '', quantity = '1';
          if (detailsTable) {
            const rows = Array.from(detailsTable.querySelectorAll('tr'));
            rows.forEach(r => {
              const cells = r.querySelectorAll('td');
              if (cells.length >= 2) {
                const label = (cells[0].textContent || '').trim().toLowerCase();
                const value = (cells[1].textContent || '').trim();
                if (label.includes('art. no')) artNo = value;
                else if (label.includes('color')) color = value;
                else if (label.includes('size')) size = value;
                else if (label.includes('quantity')) quantity = value;
              }
            });
          }

          const key = artNo || productLink || productName;
          if (seenKeys.has(key)) return;
          seenKeys.add(key);

          const product: ExtractedProduct = {
            name: productName,
            brand: 'H&M',
            price: price ? `₹${price}` : '',
            originalPrice: '',
            discount: '',
            size,
            color,
            imageUrl,
            productLink,
            quantity: parseInt(quantity) || 1,
            retailer: 'H&M',
            emailId: email.id,
            orderId,
            reference: artNo
          };

          products.push(product);
        } catch (error) {
          log('Error parsing H&M forwarded product block', { error, index });
        }
      });
    }
    
    log('H&M parser results', { emailId: email.id, productCount: products.length });
    return products;
  }
}

class ZaraParser extends BaseParser {
  async parse(email: GmailServiceTypes.EmailMessage): Promise<ExtractedProduct[]> {
    if (!email.body?.html) return [];
    
    log('Parsing Zara email with custom parser', { emailId: email.id });
    
    const dom = new JSDOM(email.body.html);
    const document = dom.window.document;
    const products: ExtractedProduct[] = [];
    
    // Extract order ID from the email content
    const orderIdElement = document.querySelector('.rd-section-title div');
    let orderId = '';
    if (orderIdElement) {
      const orderIdMatch = orderIdElement.textContent?.match(/Order No\.\s*(\d+)/i);
      orderId = orderIdMatch ? orderIdMatch[1] : '';
    }
    
    // Find all product rows
    const productRows = document.querySelectorAll('tr.rd-product-row');
    
    productRows.forEach((row, index) => {
      try {
        // Find all product columns in this row
        const productCols = row.querySelectorAll('td.rd-product-col');
        
        productCols.forEach((col) => {
          try {
            // Extract product details from each column
            const productContainer = col.querySelector('table.rd-product');
            if (!productContainer) return;
            
            // Extract product name (first div with uppercase styling)
            const nameElement = productContainer.querySelector('div[style*="text-transform: uppercase"][style*="font-size: 13px"]');
            const productName = nameElement?.textContent?.trim() || '';
            
            // Extract color (div with color #666666)
            const colorElement = productContainer.querySelector('div[style*="color: #666666"]');
            let color = colorElement?.textContent?.trim() || '';
            // Clean color - remove product code
            if (color) {
              color = color.replace(/\s+\d+\/\d+\/\d+\/\d+\/\d+$/, '').trim();
            }
            
            // Extract price and quantity from the price line
            const priceElement = productContainer.querySelector('div[style*="padding-top: 16px"]');
            let price = '';
            let quantity = 1;
            if (priceElement) {
              const priceText = priceElement.textContent?.trim() || '';
              // Extract quantity and price from format like "1 unit / ₹ 3,330.00"
              const priceMatch = priceText.match(/(\d+)\s+unit\s*\/\s*₹\s*([\d,]+\.?\d*)/);
              if (priceMatch) {
                quantity = parseInt(priceMatch[1]) || 1;
                price = priceMatch[2].replace(/,/g, '');
              }
            }
            
            // Extract size (last div with uppercase styling)
            const sizeElement = productContainer.querySelectorAll('div[style*="text-transform: uppercase"][style*="font-size: 13px"]');
            let size = '';
            if (sizeElement.length > 1) {
              size = sizeElement[sizeElement.length - 1]?.textContent?.trim() || '';
            }
            
            // Extract image URL
            const imgElement = productContainer.querySelector('img.rd-product-img');
            const imageUrl = imgElement?.getAttribute('src') || '';
            
            // Extract product link (if available)
            const linkElement = productContainer.querySelector('a');
            const productLink = linkElement?.getAttribute('href') || '';
            
            // Only add product if we have a meaningful name
            if (productName && productName.length > 3) {
              const product: ExtractedProduct = {
                name: productName,
                brand: 'Zara',
                price: price ? `₹${price}` : '',
                size,
                color,
                imageUrl,
                productLink,
                quantity,
                retailer: 'Zara',
                emailId: email.id,
                orderId
              };
              
              products.push(product);
            }
          } catch (error) {
            log('Error parsing Zara product column', { error, index });
          }
        });
        
      } catch (error) {
        log('Error parsing Zara product row', { error, index });
      }
    });
    
    // If no products found with selectors, try text-based extraction
    if (products.length === 0) {
      const textContent = document.body.textContent || '';
      const productMatches = this.extractProductsFromText(textContent, email.id, orderId);
      products.push(...productMatches);
    }
    
    log('Zara parser results', { emailId: email.id, productCount: products.length });
    return products;
  }

  private extractProductsFromText(text: string, emailId: string, orderId: string): ExtractedProduct[] {
    const products: ExtractedProduct[] = [];
    
    // Split by common product separators
    const productSections = text.split(/(?=STRAIGHT|CURVED|FLARED|SKINNY|WIDE|NARROW|CROPPED|LONG|SHORT)/i);
    
    productSections.forEach(section => {
      if (section.trim().length < 10) return;
      
      // Extract product name (first part before price)
      const nameMatch = section.match(/^([A-Z\s\-]+)/);
      if (!nameMatch) return;
      
      const name = nameMatch[1].trim();
      
      // Extract price
      const priceMatch = section.match(/₹\s*([\d,]+)/);
      const price = priceMatch ? `₹${priceMatch[1]}` : '';
      
      // Extract size
      const sizeMatch = section.match(/([A-Z]\d+|[A-Z]+)/);
      const size = sizeMatch ? sizeMatch[1] : '';
      
      // Extract color
      const colorMatch = section.match(/(Black|White|Blue|Red|Green|Yellow|Pink|Purple|Brown|Grey|Gray|Beige|Navy|Olive|Orange|Coral|Teal|Maroon|Burgundy|Cream|Ivory|Tan|Khaki|Charcoal|Silver|Gold|Bronze)/i);
      const color = colorMatch ? colorMatch[1] : '';
      
      if (name && name.length > 3) {
        products.push({
          name,
          brand: 'Zara',
          price,
          size,
          color,
          retailer: 'Zara',
          emailId,
          orderId
        });
      }
    });
    
    return products;
  }
} 