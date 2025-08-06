import { GmailServiceTypes } from '@/types/gmail';
import { log } from './logger';
import { CustomParsers } from './custom-parsers';
import { AIService } from './ai-service';
import { FallbackParser } from './fallback-parser';

export type ExtractionStrategy = 'custom' | 'ai' | 'generic' | 'auto';

export interface ExtractedProduct {
  name: string;
  brand?: string;
  price?: string;
  originalPrice?: string;
  discount?: string;
  size?: string;
  color?: string;
  imageUrl?: string;
  productLink?: string;
  quantity?: number;
  category?: string;
  retailer: string;
  emailId: string;
  orderId?: string;
  reference?: string;
}

export class UnifiedProductExtractor {
  constructor(
    private aiService: AIService,
    private customParsers: CustomParsers,
    private fallbackParser: FallbackParser
  ) {}

  async extractProductsFromEmail(
    email: GmailServiceTypes.EmailMessage,
    retailer: string,
    strategy: ExtractionStrategy = 'auto'
  ): Promise<ExtractedProduct[]> {
    
    log('Starting product extraction', { 
      emailId: email.id, 
      retailer, 
      strategy,
      hasHtml: !!email.body?.html,
      htmlLength: email.body?.html?.length || 0
    });

    // Strategy 1: Custom Retailer-Specific Parsers (Fastest, Most Accurate)
    if (strategy === 'custom' || strategy === 'auto') {
      try {
        const customResults = await this.customParsers.parse(email, retailer);
        if (customResults.length > 0) {
          log(`Custom parser found ${customResults.length} products for ${retailer}`, {
            emailId: email.id,
            retailer
          });
          return this.normalizeProducts(customResults, email.id, retailer);
        }
      } catch (error) {
        log(`Custom parser failed for ${retailer}`, { 
          error: error instanceof Error ? error.message : String(error),
          emailId: email.id,
          retailer
        });
      }
    }

    // Strategy 2: AI-Powered Extraction (Most Flexible)
    if (strategy === 'ai' || (strategy === 'auto' && this.shouldUseAI(email))) {
      try {
        const aiResults = await this.aiService.extractProducts(email, retailer);
        if (aiResults.length > 0) {
          log(`AI parser found ${aiResults.length} products for ${retailer}`, {
            emailId: email.id,
            retailer
          });
          return this.normalizeProducts(aiResults, email.id, retailer);
        }
      } catch (error) {
        log(`AI parser failed for ${retailer}`, { 
          error: error instanceof Error ? error.message : String(error),
          emailId: email.id,
          retailer
        });
      }
    }

    // Strategy 3: Generic HTML Parser (Fallback)
    if (strategy === 'generic' || strategy === 'auto') {
      try {
        const genericResults = await this.fallbackParser.parse(email);
        log(`Generic parser found ${genericResults.length} products for ${retailer}`, {
          emailId: email.id,
          retailer
        });
        return this.normalizeProducts(genericResults, email.id, retailer);
      } catch (error) {
        log(`Generic parser failed for ${retailer}`, { 
          error: error instanceof Error ? error.message : String(error),
          emailId: email.id,
          retailer
        });
      }
    }

    log('No products found with any extraction strategy', {
      emailId: email.id,
      retailer,
      strategy
    });

    return [];
  }

  private shouldUseAI(email: GmailServiceTypes.EmailMessage): boolean {
    // Use AI for complex emails or when custom parsers fail
    const htmlLength = email.body?.html?.length || 0;
    const isComplexEmail = htmlLength > 5000;
    const hasComplexStructure = email.body?.html?.includes('<table') || 
                               email.body?.html?.includes('nested');
    
    return isComplexEmail || hasComplexStructure || 
           !this.customParsers.supportsRetailer(email);
  }

  private normalizeProducts(
    products: any[], 
    emailId: string, 
    retailer: string
  ): ExtractedProduct[] {
    return products.map(product => ({
      name: product.name || product.productName || '',
      brand: product.brand || '',
      price: product.price || '',
      originalPrice: product.originalPrice || '',
      discount: product.discount || '',
      size: product.size || '',
      color: product.color || '',
      imageUrl: product.imageUrl || product.image || '',
      productLink: product.productLink || product.link || '',
      quantity: product.quantity || 1,
      category: product.category || '',
      retailer,
      emailId,
      orderId: product.orderId || '',
      reference: product.reference || ''
    })).filter(product => product.name.trim() !== '');
  }
} 