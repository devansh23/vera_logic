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
}

async function extractItemsWithAI(text: string, images: any[], client: Mistral): Promise<ExtractedItem[]> {
  const prompt = `You are an AI assistant analyzing a Myntra order email. The email contains product information with images marked as ![img-X.jpeg].

For each product in the email, extract these details in order of appearance:
1. The image reference that appears BEFORE the product details (e.g. ![img-0.jpeg])
2. The brand name (usually in all caps)
3. The complete product name/description
4. Price details if available (final price, original price, discount)

Important rules:
- Each product section typically starts with an image reference
- Process items in the order they appear in the email
- Include the image reference that comes BEFORE each product's details
- Do not skip any products or images
- Ensure each product has its corresponding image reference

Please respond with a JSON array of products, where each product has:
{
  "imageRef": "img-X.jpeg",  // The image reference that precedes this product
  "brand": "BRAND NAME",
  "name": "Complete product name",
  "price": "price if available",
  "originalPrice": "original price if available",
  "discount": "discount if available"
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
      maxTokens: 1000
    });

    if (!response.choices?.[0]?.message?.content) {
      throw new Error('No content received from AI');
    }

    const content = response.choices[0].message.content;
    if (typeof content !== 'string') {
      throw new Error('Unexpected content format received from AI');
    }

    // Extract the JSON array from the response
    const jsonStr = content.replace(/```json\n?|\n?```/g, '').trim();
    const extractedItems = JSON.parse(jsonStr);

    // Create a map of images for easier lookup
    const imageMap = new Map(images.map((img, index) => [`img-${index}.jpeg`, img]));

    // Map the extracted items and add the actual image data
    return extractedItems.map((item: any) => {
      const imageRef = item.imageRef;
      if (imageRef && imageMap.has(imageRef)) {
        item.image = imageMap.get(imageRef).imageBase64;
      }
      delete item.imageRef;
      return item;
    });
  } catch (error) {
    console.error('Error in AI extraction:', error);
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
    
    // Use AI to extract items
    console.log('Extracting items using AI...');
    const items = await extractItemsWithAI(extractedText, extractedImages, client);
    
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
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 