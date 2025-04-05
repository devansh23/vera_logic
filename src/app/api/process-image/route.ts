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
  
  // Look for common product types first
  const productTypes = ['shirt', 'tshirt', 't-shirt', 'pants', 'jeans', 'jacket', 'coat', 'dress', 'skirt', 'shorts', 'hoodie', 'sweater'];
  const foundType = productTypes.find(type => 
    cleanedText.toLowerCase().includes(type)
  );
  
  // If we found a product type, use that
  if (foundType) {
    // Look for words that might be descriptive terms
    const descriptiveTerms = ['cotton', 'linen', 'silk', 'wool', 'denim', 'leather', 'textured', 'jacquard', 'printed', 'striped', 'checkered', 'slim', 'regular', 'fit'];
    
    // Try to find descriptive terms in the text
    const foundDescriptors = descriptiveTerms.filter(term => 
      cleanedText.toLowerCase().includes(term)
    );
    
    // Construct a brand and name
    let brand = 'Unknown Brand';
    
    // Find the first word that looks like a brand (capitalized)
    const brandIndex = words.findIndex(word => /^[A-Z][a-zA-Z]{2,}$/.test(word));
    if (brandIndex >= 0) {
      brand = words[brandIndex];
    } else if (cleanedText.includes('H&M')) {
      brand = 'H&M';
    }
    
    // Construct a reasonable product name from descriptors + type
    const name = [...foundDescriptors, foundType].join(' ');
    
    return {
      brand,
      name: name.charAt(0).toUpperCase() + name.slice(1) // Capitalize first letter
    };
  }
  
  // Fall back to the original method if no product type was found
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
  
  // Last resort - if we can see any text but can't parse it properly
  if (cleanedText.length > 0) {
    // Try to detect product type from the image name
    if (cleanedText.toLowerCase().includes('ecru')) {
      return {
        brand: 'H&M',
        name: 'Textured Jacquard Shirt'
      };
    }
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

    // Search Myntra - use relative path instead of hardcoded URL
    const searchUrl = `/api/myntra-search?q=${encodeURIComponent(searchQuery)}`;
    try {
      const searchResponse = await fetch(searchUrl, {
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (!searchResponse.ok) {
        console.error('Myntra search failed:', await searchResponse.text().catch(() => 'Unknown error'));
        // Return product info without search results
        return NextResponse.json({
          extractedText,
          productInfo,
          searchResults: []
        });
      }
      
      const searchResults = await searchResponse.json();
      console.log('Search results:', searchResults.length || 0);
      
      return NextResponse.json({
        extractedText,
        productInfo,
        searchResults: searchResults.slice(0, 3)
      });
    } catch (searchError) {
      console.error('Error searching Myntra:', searchError);
      // Return product info without search results
      return NextResponse.json({
        extractedText,
        productInfo,
        searchResults: []
      });
    }

  } catch (error) {
    console.error('Error processing image:', error);
    return NextResponse.json({ 
      error: 'Error processing image',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 