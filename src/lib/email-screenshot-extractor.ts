import { Mistral } from '@mistralai/mistralai';
import { log } from './logger';

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
}

// For storing debug information
export const debugOcrTexts = new Map<string, string>();

/**
 * Extract items from text content using AI
 */
export async function extractItemsWithAI(
  text: string, 
  retailer: string
): Promise<ExtractedItem[]> {
  const isHM = retailer.toLowerCase().includes('h&m');
  
  // Create retailer-specific prompt
  const prompt = isHM 
    ? createHMPrompt()
    : createMyntraPrompt();
  
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
        sourceRetailer: retailer
      };

      return mappedItem;
    });
  } catch (error) {
    log('Error in AI extraction', { error });
    throw error;
  }
}

/**
 * Create a prompt for Myntra order emails
 */
function createMyntraPrompt(): string {
  return `You are an AI specialized in extracting product information from Myntra order confirmation emails.

TASK:
Analyze the given Myntra order confirmation email and extract details for each ordered product.

INSTRUCTIONS:
1. Focus ONLY on products that were purchased (ignore recommendations, related items, etc.)
2. For each product, extract:
   - name: Full product name
   - brand: Brand name
   - price: Current price (numeric with currency symbol)
   - originalPrice: Original price if discounted (numeric with currency symbol)
   - discount: Discount percentage if available
   - size: Size of the item
   - color: Color of the item
   - productLink: URL to the product if present
   - imageUrl: URL of the product image if present

3. Pay special attention to finding the correct product details and image URLs.
   Image URLs often appear in the email content as <img> tags or referenced in the text.

4. Return the data as a valid JSON array of objects, with each object representing one product.

Example output format:
[
  {
    "name": "Men's Regular Fit T-shirt",
    "brand": "Roadster",
    "price": "₹599",
    "originalPrice": "₹999",
    "discount": "40% OFF",
    "size": "M",
    "color": "Navy Blue",
    "productLink": "https://www.myntra.com/tshirts/roadster/...",
    "imageUrl": "https://assets.myntassets.com/assets/images/..."
  }
]

IMPORTANT: Review the entire email to find ALL product items. Return EMPTY ARRAY if no product information is found.`;
}

/**
 * Create a prompt for H&M order emails
 */
function createHMPrompt(): string {
  return `You are an AI specialized in extracting product information from H&M order confirmation emails.

TASK:
Analyze the given H&M order confirmation email and extract details for each ordered product.

INSTRUCTIONS:
1. Focus ONLY on products that were purchased (ignore recommendations, related items, etc.)
2. For each product, extract:
   - name: Full product name
   - price: Current price (numeric with currency symbol)
   - originalPrice: Original price if discounted (numeric with currency symbol)
   - discount: Discount percentage if available
   - size: Size of the item
   - color: Color of the item
   - productLink: URL to the product if present
   - imageUrl: URL of the product image if present

3. Pay special attention to finding the correct product details and image URLs.
   Image URLs often appear in the email content as <img> tags or referenced in the text.

4. H&M emails often have a "Your order" or "Items" section that lists all purchased products.
   Focus on this section for extraction.

5. Return the data as a valid JSON array of objects, with each object representing one product.

Example output format:
[
  {
    "name": "Regular Fit T-shirt",
    "price": "€14.99",
    "originalPrice": "€19.99",
    "discount": "25% OFF",
    "size": "M",
    "color": "Dark blue",
    "productLink": "https://www2.hm.com/...",
    "imageUrl": "https://lp2.hm.com/hmgoepprod?set=source[/...]"
  }
]

IMPORTANT: Review the entire email to find ALL product items. Return EMPTY ARRAY if no product information is found.`;
} 