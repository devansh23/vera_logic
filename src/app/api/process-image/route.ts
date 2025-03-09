import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';
import tesseract from 'node-tesseract-ocr';

// Configure for Edge runtime
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const config = {
  lang: 'eng',
  oem: 1,
  psm: 3,
};

function cleanText(text: string): string {
  return text
    .replace(/\n+/g, ' ')  // Replace newlines with spaces
    .replace(/\s+/g, ' ')  // Replace multiple spaces with single space
    .trim();
}

function extractProductInfo(text: string) {
  // Clean the text first
  const cleanedText = cleanText(text);
  
  // Look for common patterns in product descriptions
  const patterns = [
    // Brand followed by product type
    /([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)*)\s+((?:Pure Cotton|Slim Fit|Regular Fit|Casual|Formal)[\s\w]+(?:Shirt|Pants|Jeans|T-Shirt))/i,
    // Simple brand and product pattern
    /([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)*)\s+([^.!?]+)/
  ];

  for (const pattern of patterns) {
    const match = cleanedText.match(pattern);
    if (match) {
      return {
        brand: match[1].trim(),
        name: match[2].trim()
      };
    }
  }
  return null;
}

function extractProductInfoLenient(text: string) {
  // Clean the text first
  const cleanedText = cleanText(text);
  const words = cleanedText.split(/\s+/);
  
  // Find the first word that looks like a brand (capitalized)
  const brandIndex = words.findIndex(word => /^[A-Z][a-zA-Z]{2,}$/.test(word));
  
  if (brandIndex >= 0) {
    // Take up to 8 words after the brand name for the product name
    const nameWords = words.slice(brandIndex + 1, brandIndex + 9)
      .filter(word => !word.includes('Size') && !word.includes('Qty'));
    
    return {
      brand: words[brandIndex],
      name: nameWords.join(' ')
    };
  }
  return null;
}

export async function POST(request: Request) {
  try {
    console.log('Starting image processing request');
    const formData = await request.formData();
    const file = formData.get('image') as File;

    if (!file) {
      return NextResponse.json({ error: 'No image file provided' }, { status: 400 });
    }

    // Save the file to a temporary location
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const tempPath = join(tmpdir(), `upload-${Date.now()}.png`);
    await writeFile(tempPath, buffer);

    console.log('Running OCR on image');
    const rawText = await tesseract.recognize(tempPath, config);
    const extractedText = cleanText(rawText);
    console.log('Extracted text:', extractedText);

    // Extract product information from the text
    const productInfo = extractProductInfo(extractedText) || extractProductInfoLenient(extractedText);
    
    if (!productInfo) {
      return NextResponse.json({ 
        error: 'Could not extract product information',
        extractedText 
      }, { status: 400 });
    }

    console.log('Product info:', productInfo);

    // Construct search query
    const searchQuery = `${productInfo.brand} ${productInfo.name}`.trim();
    console.log('Search query:', searchQuery);

    // Search Myntra
    const searchUrl = `/api/myntra-search?q=${encodeURIComponent(searchQuery)}`;
    const searchResponse = await fetch(`http://localhost:3000${searchUrl}`);
    const searchResults = await searchResponse.json();

    console.log('Search results:', searchResults);

    return NextResponse.json({
      extractedText,
      productInfo,
      searchResults: searchResults.slice(0, 3)
    });

  } catch (error) {
    console.error('Error processing image:', error);
    return NextResponse.json({ 
      error: 'Error processing image',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 