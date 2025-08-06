import { log } from './logger';
import { ExtractedProduct } from './unified-product-extractor';
import { processItemImage } from './image-utils';
import { getColorInfo } from './color-utils';
import { categorizeItem } from './categorize-items';

export interface ProcessedProduct extends ExtractedProduct {
  processedImageUrl?: string;
  dominantColor?: string;
  colorTag?: string;
  category?: string;
  extractedAt: Date;
}

export class ProductProcessor {
  async processExtractedProducts(
    products: ExtractedProduct[],
    emailId: string,
    retailer: string
  ): Promise<ProcessedProduct[]> {
    
    log('Starting product processing', { 
      productCount: products.length, 
      emailId, 
      retailer 
    });

    const processedProducts = await Promise.all(
      products.map(async (product, index) => {
        try {
          log(`Processing product ${index + 1}/${products.length}`, { 
            productName: product.name,
            emailId 
          });

          const processedProduct: ProcessedProduct = {
            ...product,
            extractedAt: new Date()
          };

          // Process image if available
          if (product.imageUrl) {
            try {
              const processedImage = await this.processImage(product.imageUrl, product.name);
              processedProduct.processedImageUrl = processedImage;
            } catch (error) {
              log('Image processing failed', { 
                error: error instanceof Error ? error.message : String(error),
                imageUrl: product.imageUrl,
                productName: product.name
              });
            }
          }

          // Analyze colors if image is available
          if (processedProduct.processedImageUrl) {
            try {
              const colorInfo = await this.analyzeColors(processedProduct.processedImageUrl, product.color);
              processedProduct.dominantColor = colorInfo.dominantColor;
              processedProduct.colorTag = colorInfo.colorTag;
            } catch (error) {
              log('Color analysis failed', { 
                error: error instanceof Error ? error.message : String(error),
                productName: product.name
              });
            }
          }

          // Categorize product
          try {
            const category = await this.categorizeProduct(product.name, product.brand);
            processedProduct.category = category;
          } catch (error) {
            log('Product categorization failed', { 
              error: error instanceof Error ? error.message : String(error),
              productName: product.name
            });
            processedProduct.category = 'Uncategorized';
          }

          return processedProduct;
        } catch (error) {
          log('Product processing failed', { 
            error: error instanceof Error ? error.message : String(error),
            productName: product.name,
            emailId
          });
          
          // Return basic product info even if processing failed
          return {
            ...product,
            extractedAt: new Date(),
            category: 'Uncategorized'
          };
        }
      })
    );

    log('Product processing completed', { 
      processedCount: processedProducts.length,
      emailId,
      retailer
    });

    return processedProducts;
  }

  private async processImage(imageUrl: string, productName: string): Promise<string> {
    try {
      // Fetch image
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status}`);
      }

      const imageBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(imageBuffer);

      // Process image using existing utility
      const processedBuffer = await processItemImage(buffer, productName);
      
      // Convert to data URL
      return `data:image/jpeg;base64,${processedBuffer.toString('base64')}`;
    } catch (error) {
      log('Image processing error', { 
        error: error instanceof Error ? error.message : String(error),
        imageUrl,
        productName
      });
      throw error;
    }
  }

  private async analyzeColors(imageUrl: string, existingColor?: string): Promise<{
    dominantColor: string;
    colorTag: string;
  }> {
    try {
      // Fetch image buffer for color analysis
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch image for color analysis: ${response.status}`);
      }

      const imageBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(imageBuffer);

      // Use existing color analysis utility
      const colorInfo = await getColorInfo({
        rawColor: existingColor,
        imageBuffer: buffer
      });

      return {
        dominantColor: colorInfo.dominantColor || '',
        colorTag: colorInfo.colorTag || 'unknown'
      };
    } catch (error) {
      log('Color analysis error', { 
        error: error instanceof Error ? error.message : String(error),
        imageUrl
      });
      
      // Return fallback values
      return {
        dominantColor: existingColor || '',
        colorTag: existingColor ? existingColor.toLowerCase() : 'unknown'
      };
    }
  }

  private async categorizeProduct(name: string, brand?: string): Promise<string> {
    try {
      // Use existing categorization utility
      const category = categorizeItem({ name, brand });
      return category || 'Uncategorized';
    } catch (error) {
      log('Product categorization error', { 
        error: error instanceof Error ? error.message : String(error),
        name,
        brand
      });
      return 'Uncategorized';
    }
  }
} 