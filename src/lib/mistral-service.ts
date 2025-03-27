import { Mistral } from '@mistralai/mistralai';
// Load environment variables from .env file
import * as dotenv from 'dotenv';
// Note: We'll initialize PDF.js differently to avoid top-level await issues
import * as pdfjsLib from 'pdfjs-dist';
import { log } from './logger';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

// Load environment variables
dotenv.config();

// Configure PDF.js worker
// Instead of using top-level await, we'll initialize in a function
const configurePdfjs = () => {
  try {
    if (typeof window === 'undefined') {
      // Node.js environment
      const pdfjsWorker = require('pdfjs-dist/build/pdf.worker.js');
      pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
    } else {
      // Browser environment (not applicable for our Node.js usage)
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.js`;
    }
    
    return true;
  } catch (error) {
    log('Error configuring PDF.js', { error });
    return false;
  }
};

// Initialize Mistral client
let mistralClient: Mistral | null = null;

/**
 * Get the Mistral client singleton instance
 */
export function getMistralClient(): Mistral {
  if (!mistralClient) {
    const apiKey = process.env.MISTRAL_API_KEY;
    
    if (!apiKey) {
      throw new Error('MISTRAL_API_KEY environment variable is not set');
    }
    
    mistralClient = new Mistral({ apiKey });
    log('Mistral client initialized', { endpoint: 'api.mistral.ai' });
  }
  
  return mistralClient;
}

/**
 * Product information extracted from PDFs
 */
export interface ExtractedProductInfo {
  productName: string;
  brand?: string;
  price?: number;
  currency?: string;
  category?: string;
  description?: string;
  size?: string;
  color?: string;
  sku?: string;
  quantity?: number;
  imageUrl?: string;
  retailer?: string;
  dateOfPurchase?: Date;
  orderNumber?: string;
}

/**
 * Extract text from a PDF buffer
 */
export async function extractTextFromPdf(pdfBuffer: Buffer): Promise<string> {
  try {
    // Configure PDF.js before using it
    const configured = configurePdfjs();
    if (!configured) {
      log('Failed to configure PDF.js, returning empty text');
      return '';
    }
    
    // Load the PDF data
    const data = new Uint8Array(pdfBuffer);
    const loadingTask = pdfjsLib.getDocument({ data });
    const pdf = await loadingTask.promise;
    
    // Get the total number of pages
    const numPages = pdf.numPages;
    log('PDF loaded', { pages: numPages });
    
    // Extract text from each page
    let extractedText = '';
    
    for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const strings = content.items.map((item: any) => item.str);
      extractedText += strings.join(' ') + '\n';
    }
    
    return extractedText;
  } catch (error) {
    log('Error extracting text from PDF', { error });
    throw new Error(`Failed to extract text from PDF: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Save a PDF buffer to a temporary file
 */
export async function savePdfToTempFile(pdfBuffer: Buffer): Promise<string> {
  const tempDir = os.tmpdir();
  const tempFilePath = path.join(tempDir, `pdf-${Date.now()}.pdf`);
  
  return new Promise((resolve, reject) => {
    fs.writeFile(tempFilePath, pdfBuffer, (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(tempFilePath);
    });
  });
}

/**
 * Clean up temporary files
 */
export function cleanupTempFile(filePath: string): void {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    log('Error cleaning up temp file', { error, filePath });
  }
}

/**
 * Extract structured product information from PDF text using Mistral AI
 */
export async function extractProductInfoFromText(text: string, model = 'mistral-large-latest'): Promise<ExtractedProductInfo[]> {
  try {
    if (!text || text.trim().length === 0) {
      throw new Error('Empty text provided for product extraction');
    }
    
    const client = getMistralClient();
    
    const maxContentLength = 32000; // Limit text to avoid token limits
    const truncatedText = text.length > maxContentLength 
      ? text.substring(0, maxContentLength) + '...(truncated)' 
      : text;
    
    // Prompt engineering for product extraction
    const systemPrompt = `
You are a specialized assistant designed to extract structured product information from purchase receipts, order confirmations, and invoices.
Your task is to analyze the document text and extract the following information for each distinct product found:
- productName: The full name of the product
- brand: The brand or manufacturer
- price: The price as a number (without currency symbol)
- currency: The currency code (e.g., INR, USD)
- category: Product category
- description: Brief description if available
- size: Size information if available
- color: Color information if available  
- sku: SKU or product code if available
- quantity: Quantity as a number
- retailer: The store or website where the purchase was made
- dateOfPurchase: The purchase date in YYYY-MM-DD format
- orderNumber: Order or invoice number

If multiple products are found, include all of them in the response.
If any field cannot be determined, exclude it from the response.
Format your response as valid JSON with an array of product objects.
`;

    const userPrompt = `Extract product information from the following document text:\n\n${truncatedText}`;
    
    // Call Mistral API
    const response = await client.chat.complete({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.1, // Low temperature for more deterministic results
      maxTokens: 4000,  // Adjust based on your needs
      responseFormat: { type: 'json_object' }
    });
    
    // Parse and validate the response
    const responseContent = response.choices?.[0]?.message?.content || '';
    
    // Extract the JSON part if the response isn't already valid JSON
    let jsonStr = responseContent;
    if (typeof responseContent === 'string') {
      const jsonMatch = responseContent.match(/```json([\s\S]*?)```/);
      if (jsonMatch) {
        jsonStr = jsonMatch[1].trim();
      }
    }
    
    try {
      const parsed = JSON.parse(typeof jsonStr === 'string' ? jsonStr : '{}');
      const products = parsed.products || [];
      
      // Post-process and validate data
      return products.map((product: any) => {
        // Convert price to number if it's a string
        if (typeof product.price === 'string') {
          const priceNum = parseFloat(product.price.replace(/,/g, ''));
          if (!isNaN(priceNum)) {
            product.price = priceNum;
          }
        }
        
        // Convert quantity to number if it's a string
        if (typeof product.quantity === 'string') {
          const quantityNum = parseInt(product.quantity, 10);
          if (!isNaN(quantityNum)) {
            product.quantity = quantityNum;
          }
        }
        
        // Convert purchase date to Date object if it's a string
        if (product.dateOfPurchase && typeof product.dateOfPurchase === 'string') {
          try {
            const date = new Date(product.dateOfPurchase);
            if (!isNaN(date.getTime())) {
              product.dateOfPurchase = date;
            }
          } catch (e) {
            // Keep as string if parsing fails
          }
        }
        
        return product as ExtractedProductInfo;
      });
    } catch (parseError) {
      log('Error parsing Mistral API response', { 
        error: parseError, 
        responseContent: typeof responseContent === 'string' 
          ? responseContent.substring(0, 200) + '...' 
          : 'Non-string response'
      });
      
      throw new Error('Failed to parse product information from Mistral response');
    }
  } catch (error) {
    log('Error extracting product info using Mistral AI', { error });
    
    // Handle API-specific errors
    if (error instanceof Error) {
      if (error.message.includes('401')) {
        throw new Error('Authentication failed with Mistral API. Check your API key.');
      } else if (error.message.includes('429')) {
        throw new Error('Rate limit exceeded for Mistral API.');
      } else if (error.message.includes('5')) {
        throw new Error('Mistral API service error. Please try again later.');
      }
    }
    
    throw new Error(`Failed to extract product information: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Main function to extract product information from a PDF buffer
 */
export async function extractProductInfoFromPdf(pdfBuffer: Buffer): Promise<ExtractedProductInfo[]> {
  try {
    // Extract text from PDF
    let extractedText;
    try {
      extractedText = await extractTextFromPdf(pdfBuffer);
    } catch (pdfError) {
      log('Error extracting text from PDF, falling back to empty text', { error: pdfError });
      extractedText = '';
    }
    
    if (!extractedText || extractedText.trim().length === 0) {
      log('Empty text extracted from PDF');
      return [];
    }
    
    // Extract product information from text
    return await extractProductInfoFromText(extractedText);
  } catch (error) {
    log('Error in PDF product extraction pipeline', { error });
    throw error;
  }
}

/**
 * Analyze a receipt or invoice PDF to extract order information
 */
export async function analyzeReceiptPdf(pdfBuffer: Buffer): Promise<{
  retailer: string;
  orderNumber: string;
  orderDate: Date | null;
  totalAmount: number | null;
  currency: string | null;
  products: ExtractedProductInfo[];
}> {
  try {
    // Extract text from PDF
    let extractedText;
    try {
      extractedText = await extractTextFromPdf(pdfBuffer);
    } catch (pdfError) {
      log('Error extracting text from PDF, falling back to empty text', { error: pdfError });
      extractedText = '';
    }
    
    if (!extractedText || extractedText.trim().length === 0) {
      throw new Error('No text could be extracted from the PDF');
    }
    
    const client = getMistralClient();
    
    // Structured extraction prompt
    const systemPrompt = `
You are a specialized assistant for analyzing receipts and invoices. 
Extract the following information structured as JSON:
1. retailer: The name of the store/company
2. orderNumber: Order/Invoice/Receipt number
3. orderDate: Date of purchase (YYYY-MM-DD format)
4. totalAmount: The total amount as a number
5. currency: The currency code (e.g., INR, USD)
6. products: Array of product items, each containing:
   - productName
   - quantity (as a number)
   - price (as a number)
   - other available details (brand, size, etc.)

Format your response as a JSON object with these fields.
`;

    const response = await client.chat.complete({
      model: 'mistral-large-latest',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: extractedText }
      ],
      temperature: 0.1,
      maxTokens: 4000,
      responseFormat: { type: 'json_object' }
    });
    
    const responseContent = response.choices?.[0]?.message?.content || '';
    
    // Extract JSON content
    let jsonStr = responseContent;
    if (typeof responseContent === 'string') {
      const jsonMatch = responseContent.match(/```json([\s\S]*?)```/);
      if (jsonMatch) {
        jsonStr = jsonMatch[1].trim();
      }
    }
    
    const parsedData = JSON.parse(typeof jsonStr === 'string' ? jsonStr : '{}');
    
    // Convert string to date
    let orderDate = null;
    if (parsedData.orderDate && typeof parsedData.orderDate === 'string') {
      try {
        orderDate = new Date(parsedData.orderDate);
      } catch (e) {
        log('Error parsing date', { date: parsedData.orderDate, error: e });
      }
    }
    
    // Ensure products is an array
    const products = Array.isArray(parsedData.products) ? parsedData.products : [];
    
    // Validate and format products
    const formattedProducts = products.map((product: any) => {
      // Convert price and quantity to numbers
      if (typeof product.price === 'string') {
        product.price = parseFloat(product.price.replace(/,/g, ''));
      }
      if (typeof product.quantity === 'string') {
        product.quantity = parseInt(product.quantity, 10);
      }
      
      return product as ExtractedProductInfo;
    });
    
    return {
      retailer: parsedData.retailer || 'Unknown',
      orderNumber: parsedData.orderNumber || 'Unknown',
      orderDate,
      totalAmount: typeof parsedData.totalAmount === 'string' 
        ? parseFloat(parsedData.totalAmount.replace(/,/g, ''))
        : parsedData.totalAmount,
      currency: parsedData.currency || null,
      products: formattedProducts
    };
  } catch (error) {
    log('Error analyzing receipt PDF', { error });
    throw new Error(`Failed to analyze receipt: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Test the Mistral API connection
 */
export async function testMistralApiConnection(): Promise<{ success: boolean; message: string }> {
  try {
    const client = getMistralClient();
    
    // Simple test call to check API connectivity
    const response = await client.chat.complete({
      model: 'mistral-tiny',
      messages: [
        { role: 'user', content: 'Hello' }
      ],
      maxTokens: 10
    });
    
    if (response && response.choices && response.choices.length > 0) {
      return {
        success: true,
        message: 'Successfully connected to Mistral AI API'
      };
    } else {
      return {
        success: false,
        message: 'Received unexpected response format from Mistral AI API'
      };
    }
  } catch (error) {
    let errorMessage = 'Failed to connect to Mistral AI API';
    
    if (error instanceof Error) {
      // Check for specific API error conditions
      if (error.message.includes('401')) {
        errorMessage = 'Authentication failed. Please check your Mistral API key.';
      } else if (error.message.includes('429')) {
        errorMessage = 'Rate limit exceeded for Mistral API.';
      } else if (error.message.includes('5')) {
        errorMessage = 'Mistral API service error. Please try again later.';
      } else {
        errorMessage = `Error connecting to Mistral API: ${error.message}`;
      }
    }
    
    log('Mistral API connection test failed', { error });
    
    return {
      success: false,
      message: errorMessage
    };
  }
}

// Export the type for use in other modules
export { Mistral }; 