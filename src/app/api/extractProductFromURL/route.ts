import { NextResponse } from 'next/server';
import { scrapeProduct } from '@/lib/scrape-product';
import { processItemImage } from '@/lib/image-utils';
import { categorizeItem } from '@/lib/categorize-items';
import { log } from '@/lib/logger';

/**
 * API endpoint to extract product details from any clothing/accessory URL
 * Supports AI fallbacks for missing metadata
 */
export async function GET(request: Request) {
  const requestId = Math.random().toString(36).substring(2, 8);
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
  }

  // Validate URL format
  try {
    new URL(url);
  } catch (error) {
    return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
  }

  console.log(`[${requestId}] Extracting product from URL:`, url);

  try {
    // Try to scrape the product with the existing function
    const product = await scrapeProduct(url);
    
    if (!product || (!product.name && !product.image)) {
      console.error(`[${requestId}] Failed to extract core product data`);
      return NextResponse.json({ 
        error: 'Failed to extract product data',
        message: 'Could not find product information on the page'
      }, { status: 500 });
    }

    // Helper function to extract brand from URL domain
    function extractBrandFromUrl(url: string): string {
      try {
        const domain = new URL(url).hostname;
        // Handle known retailers
        if (domain.includes('hm.com')) return 'H&M';
        if (domain.includes('myntra.com')) return 'Myntra';
        if (domain.includes('zara.com')) return 'Zara';
        
        // For unknown retailers, try to get a clean brand name
        const brandPart = domain.split('.')[0];
        if (brandPart.toLowerCase().startsWith('www')) {
          // If domain starts with www, use the second part
          return domain.split('.')[1].charAt(0).toUpperCase() + domain.split('.')[1].slice(1);
        }
        return brandPart.charAt(0).toUpperCase() + brandPart.slice(1);
      } catch (error) {
        return 'Unknown Brand';
      }
    }

    // Apply fallbacks for missing data
    const enhancedProduct = {
      ...product,
      // Ensure we have a valid brand
      brand: product.brand || extractBrandFromUrl(url),
      // Make sure we have a name (even if generic)
      name: product.name || 'Product from ' + extractBrandFromUrl(url),
    };

    // Apply categorization
    enhancedProduct.category = categorizeItem({
      name: enhancedProduct.name,
      brand: enhancedProduct.brand,
      color: enhancedProduct.color,
      sourceRetailer: enhancedProduct.sourceRetailer
    });

    // Process the product image if available
    if (enhancedProduct.image) {
      try {
        console.log(`[${requestId}] Fetching image for processing:`, enhancedProduct.image);
        
        // Fetch the image
        const imageResponse = await fetch(enhancedProduct.image);
        if (imageResponse.ok) {
          // Convert image to buffer
          const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());
          
          // Process the image to extract the clothing item
          const processedBuffer = await processItemImage(imageBuffer, enhancedProduct.name);
          
          // Convert processed buffer to base64 for storage or transmission
          const base64Image = `data:image/jpeg;base64,${processedBuffer.toString('base64')}`;
          
          // Update the product with the processed image
          enhancedProduct.image = base64Image;
          console.log(`[${requestId}] Successfully processed product image`);
        } else {
          console.log(`[${requestId}] Failed to fetch image, using original URL`);
        }
      } catch (imageError) {
        console.error(`[${requestId}] Error processing image:`, imageError);
        // Keep using the original image URL
      }
    }

    // Clear up undefined values - typescript safe version
    const cleanProduct = { ...enhancedProduct };
    for (const key in cleanProduct) {
      if (cleanProduct[key as keyof typeof cleanProduct] === undefined) {
        // Only assign to known properties
        if (key in product) {
          (cleanProduct as any)[key] = '';
        }
      }
    }

    console.log(`[${requestId}] Successfully extracted product data`, {
      name: cleanProduct.name,
      brand: cleanProduct.brand,
      category: cleanProduct.category
    });
    
    return NextResponse.json(cleanProduct);
  } catch (error) {
    console.error(`[${requestId}] Error fetching product:`, error);
    return NextResponse.json({ 
      error: 'Failed to fetch product details',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 