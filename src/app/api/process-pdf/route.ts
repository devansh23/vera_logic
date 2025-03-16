import { NextResponse } from 'next/server';
import { Mistral } from '@mistralai/mistralai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Configure for Edge runtime
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface ExtractedItem {
  brand?: string;
  name?: string;
  price?: string;
  originalPrice?: string;
  discount?: string;
  image?: string;
  orderDate?: string;
  productLink?: string;
  size?: string;
  color?: string;
}

async function extractItemsWithAI(text: string, images: any[], client: Mistral): Promise<ExtractedItem[]> {
  // Determine if this is an H&M order by looking for H&M specific patterns
  const isHMOrder = text.includes('H&M') || text.includes('hm.com');

  const myntraPrompt = `You are an AI assistant analyzing a Myntra order email. The email contains product information with images marked as ![img-X.jpeg].

For each product in the email, extract these details in order of appearance:
1. The image reference that appears BEFORE the product details (e.g. ![img-0.jpeg])
2. The brand name (usually in all caps)
3. The complete product name/description
4. Price details if available (final price, original price, discount)
5. The product link (usually starts with "myntra.com" or contains "/product/")

Important rules:
- Each product section typically starts with an image reference
- Process items in the order they appear in the email
- Include the image reference that comes BEFORE each product's details
- Extract the complete product URL if available
- Pay special attention to size and color variations
- Look for any order-specific details like order number and date
- For prices, note if they are in a specific currency format

You must respond with ONLY a valid JSON array of products. Do not include any other text or formatting.
Each product in the array must follow this exact format:
{
  "imageRef": "img-X.jpeg",
  "brand": "BRAND NAME",
  "name": "Complete product name",
  "price": "price with currency",
  "originalPrice": "original price if available",
  "discount": "discount if available",
  "size": "size if available",
  "color": "color if available",
  "productLink": "full product URL if available"
}`;

  const hmPrompt = `You are an AI assistant analyzing an H&M order email/PDF. The document contains product information with images marked as ![img-X.jpeg].

For each product in the document, extract these details in order of appearance:
1. The image reference that appears with the product details (e.g. ![img-0.jpeg])
2. The product name/description (look for the text under "Unknown Brand" which is actually an H&M product)
3. The size and color information if available
4. Price details:
   - Current price (usually starts with ₹)
   - Original price (usually crossed out, starts with ₹)
   - Discount amount (usually in green, starts with ₹)
5. The product link - look for hyperlinks containing "H&M" text

Important rules:
- Always set the brand as "H&M" for all products
- Each product typically has its own section with image, details, and link
- Process items in the order they appear in the document
- Include the image reference associated with each product
- Look for hyperlinks near the "H&M" text to get the product URL
- Pay special attention to size and color variations
- Look for any order-specific details like order number and date
- For prices, preserve the ₹ symbol and exact formatting

You must respond with ONLY a valid JSON array of products. Do not include any other text or formatting.
Each product in the array must follow this exact format:
{
  "imageRef": "img-X.jpeg",
  "brand": "H&M",
  "name": "Complete product name",
  "price": "₹X.XX",
  "originalPrice": "₹X.XX if available",
  "discount": "₹X.XX if available",
  "size": "size if available",
  "color": "color if available",
  "productLink": "URL from H&M hyperlink"
}`;

  try {
    const response = await client.chat.complete({
      model: "mistral-small-latest",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: isHMOrder ? hmPrompt : myntraPrompt
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
    
    // Attempt to find a valid JSON array in the response
    const matches = jsonStr.match(/\[[\s\S]*\]/);
    if (!matches) {
      throw new Error('No valid JSON array found in response');
    }
    
    let extractedItems;
    try {
      extractedItems = JSON.parse(matches[0]);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      console.error('Raw JSON string:', jsonStr);
      throw new Error('Failed to parse JSON response from AI');
    }

    if (!Array.isArray(extractedItems)) {
      throw new Error('Parsed result is not an array');
    }

    // Create a map of images for easier lookup
    const imageMap = new Map(images.map((img, index) => [`img-${index}.jpeg`, img]));

    // Map the extracted items and add the actual image data
    return extractedItems.map((item: any) => {
      const imageRef = item.imageRef;
      const mappedItem: ExtractedItem = {
        brand: isHMOrder ? "H&M" : (item.brand || 'Unknown Brand'),
        name: item.name || 'Unknown Product',
        price: item.price || '',
        originalPrice: item.originalPrice || '',
        discount: item.discount || '',
        size: item.size || '',
        color: item.color || '',
        productLink: item.productLink || ''
      };

      if (imageRef && imageMap.has(imageRef)) {
        mappedItem.image = imageMap.get(imageRef).imageBase64;
      }

      return mappedItem;
    });
  } catch (error) {
    console.error('Error in AI extraction:', error);
    console.error('Input text:', text);
    throw error;
  }
}

export async function POST(request: Request) {
  try {
    console.log('Starting PDF processing request');
    const formData = await request.formData();
    const file = formData.get('pdf') as File;

    if (!file) {
      return NextResponse.json({ error: 'No PDF file provided' }, { status: 400 });
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64String = buffer.toString('base64');
    const dataUrl = `data:application/pdf;base64,${base64String}`;

    // Initialize Mistral client
    const apiKey = process.env.MISTRAL_API_KEY;
    if (!apiKey) {
      throw new Error('Mistral API key not found');
    }

    const client = new Mistral({ apiKey });

    // Process the PDF with Mistral OCR
    console.log('Processing PDF with Mistral OCR...');
    const ocrResponse = await client.ocr.process({
      model: "mistral-ocr-latest",
      document: {
        type: "document_url",
        documentUrl: dataUrl
      },
      includeImageBase64: true
    });

    console.log('OCR processing completed');

    // Extract text and images
    const extractedText = ocrResponse.pages.map(page => page.markdown).join('\n\n');
    const extractedImages = ocrResponse.pages.flatMap(page => page.images || []);
    
    console.log('Extracted text length:', extractedText.length);
    console.log('Number of images:', extractedImages.length);
    
    // Use AI to extract items
    console.log('Extracting items using AI...');
    const items = await extractItemsWithAI(extractedText, extractedImages, client);
    
    console.log('Successfully extracted items:', items.length);
    
    return NextResponse.json({
      message: 'PDF processed successfully',
      items,
      pageCount: ocrResponse.pages.length,
      imageCount: extractedImages.length
    });

  } catch (error) {
    console.error('Error processing PDF:', error);
    return NextResponse.json({ 
      error: 'Error processing PDF',
      details: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
} 