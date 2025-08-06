import { JSDOM } from 'jsdom';
import { GmailServiceTypes } from '@/types/gmail';
import { log } from './logger';
import { ExtractedProduct } from './unified-product-extractor';

export class FallbackParser {
  async parse(email: GmailServiceTypes.EmailMessage): Promise<ExtractedProduct[]> {
    if (!email.body?.html) {
      log('No HTML content available for fallback parsing', { emailId: email.id });
      return [];
    }

    try {
      log('Starting fallback HTML parsing', { emailId: email.id });
      
      const dom = new JSDOM(email.body.html);
      const document = dom.window.document;
      const products: ExtractedProduct[] = [];
      
      // Generic product detection patterns
      const productSelectors = [
        '.product', '.item', '.order-item',
        '[class*="product"]', '[class*="item"]',
        'table tr', '.product-list li',
        '.product-container', '.item-container'
      ];
      
      for (const selector of productSelectors) {
        const elements = document.querySelectorAll(selector);
        
        if (elements.length > 0) {
          log(`Found ${elements.length} elements with selector: ${selector}`, { emailId: email.id });
          
          elements.forEach((element, index) => {
            try {
              const product = this.extractProductFromElement(element, email.id);
              if (product.name) {
                products.push(product);
              }
            } catch (error) {
              log('Error extracting product from element', { 
                error: error instanceof Error ? error.message : String(error),
                emailId: email.id,
                selector,
                index
              });
            }
          });
          
          if (products.length > 0) {
            log(`Fallback parser found ${products.length} products using selector: ${selector}`, {
              emailId: email.id
            });
            break; // Found products, stop searching
          }
        }
      }
      
      // If no products found with selectors, try table-based extraction
      if (products.length === 0) {
        const tableProducts = this.extractFromTables(document, email.id);
        products.push(...tableProducts);
      }
      
      log('Fallback parser completed', { 
        emailId: email.id, 
        productCount: products.length 
      });
      
      return products;
    } catch (error) {
      log('Fallback parser failed', { 
        error: error instanceof Error ? error.message : String(error),
        emailId: email.id 
      });
      return [];
    }
  }

  private extractProductFromElement(element: Element, emailId: string): ExtractedProduct {
    const product: ExtractedProduct = {
      name: this.extractText(element, '.name, .title, h3, h4, strong, .product-name, .item-name'),
      brand: this.extractText(element, '.brand, .manufacturer, [class*="brand"]'),
      price: this.extractText(element, '.price, .current-price, [class*="price"]'),
      originalPrice: this.extractText(element, '.original-price, .old-price, .list-price, [class*="original"]'),
      discount: this.extractText(element, '.discount, .savings, [class*="discount"]'),
      size: this.extractText(element, '.size, [class*="size"]'),
      color: this.extractText(element, '.color, [class*="color"]'),
      imageUrl: this.extractImageUrl(element),
      productLink: this.extractLink(element),
      retailer: 'Unknown',
      emailId,
      quantity: this.extractQuantity(element)
    };
    
    return product;
  }

  private extractFromTables(document: Document, emailId: string): ExtractedProduct[] {
    const products: ExtractedProduct[] = [];
    const tables = document.querySelectorAll('table');
    
    tables.forEach((table, tableIndex) => {
      try {
        const rows = table.querySelectorAll('tr');
        
        // Skip header row and process data rows
        for (let i = 1; i < rows.length; i++) {
          const row = rows[i];
          const cells = row.querySelectorAll('td, th');
          
          if (cells.length >= 2) {
            const product: ExtractedProduct = {
              name: this.cleanText(cells[0]?.textContent || ''),
              price: this.cleanText(cells[1]?.textContent || ''),
              retailer: 'Unknown',
              emailId,
              quantity: 1
            };
            
            // Try to extract additional info from other cells
            if (cells.length > 2) {
              product.size = this.cleanText(cells[2]?.textContent || '');
            }
            if (cells.length > 3) {
              product.color = this.cleanText(cells[3]?.textContent || '');
            }
            
            // Extract image from the row
            const img = row.querySelector('img');
            if (img) {
              product.imageUrl = img.getAttribute('src') || '';
            }
            
            // Extract link from the row
            const link = row.querySelector('a');
            if (link) {
              product.productLink = link.getAttribute('href') || '';
            }
            
            if (product.name) {
              products.push(product);
            }
          }
        }
      } catch (error) {
        log('Error extracting from table', { 
          error: error instanceof Error ? error.message : String(error),
          emailId,
          tableIndex
        });
      }
    });
    
    return products;
  }

  private extractText(element: Element, selectors: string): string {
    for (const selector of selectors.split(',')) {
      const found = element.querySelector(selector.trim());
      if (found) {
        return this.cleanText(found.textContent || '');
      }
    }
    
    return this.cleanText(element.textContent || '');
  }

  private extractImageUrl(element: Element): string {
    const img = element.querySelector('img');
    return img?.getAttribute('src') || '';
  }

  private extractLink(element: Element): string {
    const link = element.querySelector('a');
    return link?.getAttribute('href') || '';
  }

  private extractQuantity(element: Element): number {
    const quantityText = this.extractText(element, '.quantity, .qty, [class*="quantity"]');
    if (quantityText) {
      const match = quantityText.match(/(\d+)/);
      if (match) {
        return parseInt(match[1]);
      }
    }
    return 1;
  }

  private cleanText(text: string): string {
    return text.replace(/\s+/g, ' ').trim();
  }
} 