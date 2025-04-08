import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
import { scrapeProduct } from '@/lib/scrape-product';
import { processItemImage } from '@/lib/image-utils';

export async function GET(request: Request) {
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

  console.log('Extracting product from URL:', url);

  let browser;
  try {
    // Use the scrapeProduct function which already supports multiple retailers
    const product = await scrapeProduct(url);
    
    if (!product) {
      console.error('Failed to extract product data');
      return NextResponse.json({ 
        error: 'Failed to extract product data',
        message: 'Could not find product information on the page'
      }, { status: 500 });
    }

    // Process the product image if available
    if (product.image) {
      try {
        console.log('Fetching image for processing:', product.image);
        
        // Fetch the image
        const imageResponse = await fetch(product.image);
        if (imageResponse.ok) {
          // Convert image to buffer
          const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());
          
          // Process the image to extract the clothing item
          const processedBuffer = await processItemImage(imageBuffer, product.name);
          
          // Convert processed buffer to base64 for storage or transmission
          const base64Image = `data:image/jpeg;base64,${processedBuffer.toString('base64')}`;
          
          // Update the product with the processed image
          product.image = base64Image;
          console.log('Successfully processed product image');
        } else {
          console.log('Failed to fetch image, using original URL');
        }
      } catch (imageError) {
        console.error('Error processing image:', imageError);
        // Keep using the original image URL
      }
    }

    console.log('Successfully extracted product data:', product);
    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch product details',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 