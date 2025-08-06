import { Mistral } from '@mistralai/mistralai';
import { GmailServiceTypes } from '@/types/gmail';
import { log } from './logger';
import { ExtractedProduct } from './unified-product-extractor';

export class AIService {
  private client: Mistral;

  constructor() {
    const apiKey = process.env.MISTRAL_API_KEY;
    if (!apiKey) {
      throw new Error('MISTRAL_API_KEY environment variable is required');
    }
    this.client = new Mistral({ apiKey });
  }

  async extractProducts(email: GmailServiceTypes.EmailMessage, retailer: string): Promise<ExtractedProduct[]> {
    try {
      log('Starting AI-powered product extraction', { 
        emailId: email.id, 
        retailer,
        hasHtml: !!email.body?.html,
        htmlLength: email.body?.html?.length || 0
      });

      const prompt = this.buildExtractionPrompt(retailer);
      const content = this.prepareEmailContent(email);
      
      const response = await this.client.chat.complete({
        model: 'mistral-large-latest',
        messages: [
          { role: 'system', content: prompt },
          { role: 'user', content: content }
        ],
        temperature: 0.1,
        maxTokens: 4000,
        responseFormat: { type: 'json_object' }
      });
      
      const responseContent = response.choices?.[0]?.message?.content;
      if (!responseContent || typeof responseContent !== 'string') {
        throw new Error('Invalid response from AI service');
      }
      
      const result = JSON.parse(responseContent);
      const products = result.products || [];
      
      log('AI extraction completed', { 
        emailId: email.id, 
        retailer, 
        productCount: products.length 
      });
      
      return products;
    } catch (error) {
      log('AI extraction failed', { 
        error: error instanceof Error ? error.message : String(error),
        emailId: email.id, 
        retailer 
      });
      throw error;
    }
  }

  private buildExtractionPrompt(retailer: string): string {
    return `
You are an expert at extracting clothing product information from order confirmation emails.

Your task is to analyze the email content and extract all clothing products with their details.

For each product found, extract the following information:
- name: The complete product name/description
- brand: The brand name (if not specified, use "${retailer}")
- price: The current price with currency symbol
- originalPrice: The original price before discount (if available)
- discount: The discount amount or percentage (if available)
- size: The product size (if available)
- color: The product color (if available)
- imageUrl: The product image URL (if available)
- productLink: The product page URL (if available)
- quantity: The quantity ordered (default to 1 if not specified)

Important rules:
1. Only extract actual clothing products (shirts, pants, dresses, etc.)
2. Skip accessories, shipping info, or non-product items
3. If a field is not available, omit it or use empty string
4. Preserve exact text formatting for names and prices
5. Extract all products found in the email
6. If no products are found, return an empty array

Return your response as a JSON object with this exact structure:
{
  "products": [
    {
      "name": "Product name",
      "brand": "Brand name",
      "price": "₹1,999",
      "originalPrice": "₹2,999",
      "discount": "₹1,000 OFF",
      "size": "M",
      "color": "Blue",
      "imageUrl": "https://example.com/image.jpg",
      "productLink": "https://example.com/product",
      "quantity": 1
    }
  ]
}

Only include valid JSON in your response. Do not include any explanatory text.
`;
  }

  private prepareEmailContent(email: GmailServiceTypes.EmailMessage): string {
    const html = email.body?.html || '';
    const subject = email.subject || '';
    
    // Extract text content from HTML
    const textContent = this.extractTextFromHtml(html);
    
    // Combine subject and content
    const fullContent = `
Subject: ${subject}

Email Content:
${textContent}
`;
    
    // Limit content length to avoid token limits
    const maxLength = 8000;
    return fullContent.length > maxLength 
      ? fullContent.substring(0, maxLength) + '...(truncated)'
      : fullContent;
  }

  private extractTextFromHtml(html: string): string {
    try {
      // Simple HTML to text conversion
      return html
        .replace(/<script[^>]*>.*?<\/script>/gi, '') // Remove scripts
        .replace(/<style[^>]*>.*?<\/style>/gi, '') // Remove styles
        .replace(/<[^>]+>/g, ' ') // Remove HTML tags
        .replace(/\s+/g, ' ') // Normalize whitespace
        .trim();
    } catch (error) {
      log('Error extracting text from HTML', { error });
      return html;
    }
  }
} 