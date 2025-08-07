import { Mistral } from '@mistralai/mistralai';
import { log } from './logger';
import { createHMPrompt, createMyntraPrompt, createZaraPrompt } from './email-extraction-prompts';
import { ExtractedProduct } from './unified-product-extractor';

// Exported interface for extracted items
export interface ExtractedItem {
  brand: string;
  name: string;
  price?: string;
  originalPrice?: string;
  discount?: string;
  size?: string;
  color?: string;
  productLink?: string;
  myntraLink?: string;  
  image?: string;
  sourceRetailer: string;
  dominantColor?: string | null;
  colorTag?: string;
}

// For storing debug information
export const debugOcrTexts = new Map<string, string>();
export const debugScreenshots = new Map<string, Buffer>();

/**
 * Extract items from text content using AI
 */
export async function extractItemsWithAI(
  text: string, 
  retailer: string
): Promise<ExtractedItem[]> {
  const isHM = retailer.toLowerCase().includes('h&m');
  const isZara = retailer.toLowerCase() === 'zara';
  
  // Create retailer-specific prompt
  let prompt;
  if (isZara) {
    prompt = createZaraPrompt();
  } else if (isHM) {
    prompt = createHMPrompt();
  } else {
    prompt = createMyntraPrompt();
  }
  
  try {
    log('Sending text to Mistral AI for extraction', { textLength: text.length });
    
    // Initialize Mistral client
    const apiKey = process.env.MISTRAL_API_KEY;
    if (!apiKey) {
      throw new Error('Mistral API key not found');
    }
    
    const client = new Mistral({ apiKey });
    
    const response = await client.chat.complete({
      model: "mistral-small-latest",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt
            },
            {
              type: "text",
              text: text
            }
          ]
        }
      ],
      temperature: 0.1,
      maxTokens: 2000
    });

    if (!response.choices?.[0]?.message?.content) {
      throw new Error('No content received from AI');
    }

    const content = response.choices[0].message.content;
    if (typeof content !== 'string') {
      throw new Error('Unexpected content format received from AI');
    }

    // Clean up the response to ensure valid JSON
    let jsonStr = content;
    
    // Remove any markdown code block markers
    jsonStr = jsonStr.replace(/```json\n?|\n?```/g, '').trim();
    
    // Log the raw AI response for debugging
    log('Raw AI response', { responsePreview: jsonStr.substring(0, 500) + '...' });
    
    // Attempt to find a valid JSON array in the response
    const matches = jsonStr.match(/\[[\s\S]*\]/);
    if (!matches) {
      log('Failed to find JSON array in response', { response: jsonStr });
      throw new Error('No valid JSON array found in response');
    }
    
    let extractedItems;
    try {
      extractedItems = JSON.parse(matches[0]);
    } catch (parseError) {
      log('JSON Parse Error', { parseError, jsonStr });
      throw new Error('Failed to parse JSON response from AI');
    }

    if (!Array.isArray(extractedItems)) {
      throw new Error('Parsed result is not an array');
    }

    // Map the extracted items
    return extractedItems.map((item: any) => {
      const mappedItem: ExtractedItem = {
        brand: isHM ? "H&M" : (item.brand || 'Unknown Brand'),
        name: item.name || 'Unknown Product',
        price: item.price || '',
        originalPrice: item.originalPrice || '',
        discount: item.discount || '',
        size: item.size || '',
        color: item.color || '',
        image: item.imageUrl || '', // Use imageUrl from AI response
        productLink: item.productLink || '',
        myntraLink: item.productLink && item.productLink.includes('myntra.com') ? item.productLink : '',
        sourceRetailer: retailer,
        dominantColor: item.dominantColor || null,
        colorTag: item.colorTag || ''
      };

      return mappedItem;
    });
  } catch (error) {
    log('Error in AI extraction', { error });
    throw error;
  }
} 