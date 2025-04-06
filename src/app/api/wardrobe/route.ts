import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { log } from '@/lib/logger';
import { categorizeItem } from '@/lib/categorize-items';
import { processItemImage } from '@/lib/image-utils';
import { scrapeProduct } from '@/lib/scrape-product';

// GET /api/wardrobe - Get user's wardrobe
export async function GET(request: Request) {
  const requestId = Math.random().toString(36).substring(2, 8);
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [${requestId}] GET /api/wardrobe - Request received`);
  
  const session = await getServerSession(authOptions);
  log('GET /api/wardrobe - Session', { userId: session?.user?.id });
  
  if (!session?.user?.id) {
    log('GET /api/wardrobe - Unauthorized: No user ID in session');
    console.log(`[${timestamp}] [${requestId}] GET /api/wardrobe - Unauthorized, no user ID`);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.log(`[${timestamp}] [${requestId}] GET /api/wardrobe - Fetching items for user ${session.user.id}`);
    const startTime = performance.now();
    
    const items = await prisma.wardrobe.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        dateAdded: 'desc'
      }
    });

    const duration = Math.round(performance.now() - startTime);
    console.log(`[${timestamp}] [${requestId}] GET /api/wardrobe - Fetch completed in ${duration}ms, found ${items.length} items`);
    
    log(`GET /api/wardrobe - Found items for user`, { userId: session.user.id, count: items.length });
    return NextResponse.json(items);
  } catch (error) {
    console.log(`[${timestamp}] [${requestId}] GET /api/wardrobe - Error: ${error}`);
    log('Error fetching wardrobe', { error });
    return NextResponse.json(
      { error: 'Failed to fetch wardrobe' },
      { status: 500 }
    );
  }
}

// POST /api/wardrobe - Add item to wardrobe
export async function POST(request: Request) {
  const requestId = Math.random().toString(36).substring(2, 8);
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [${requestId}] POST /api/wardrobe - Request received`);
  
  const session = await getServerSession(authOptions);
  log('POST /api/wardrobe - Session', { userId: session?.user?.id, requestId });
  
  if (!session?.user?.id) {
    log('POST /api/wardrobe - Unauthorized: No user ID in session', { requestId });
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { url } = body;
    log('POST /api/wardrobe - Processing URL', { url, requestId });

    if (!url) {
      log('POST /api/wardrobe - No URL provided', { requestId });
      return NextResponse.json({ 
        error: 'URL parameter is required',
        message: 'Please provide a valid product URL' 
      }, { status: 400 });
    }
    
    // Validate URL
    try {
      new URL(url);
    } catch (urlError) {
      log('POST /api/wardrobe - Invalid URL format', { url, requestId });
      return NextResponse.json({ 
        error: 'Invalid URL format',
        message: 'Please provide a valid product URL' 
      }, { status: 400 });
    }

    // Scrape product information from any website
    log('POST /api/wardrobe - Scraping product from URL', { url, requestId });
    const productData = await scrapeProduct(url);
    
    if (!productData) {
      log('POST /api/wardrobe - Failed to extract product data', { url, requestId });
      return NextResponse.json({ 
        error: 'Failed to extract product data',
        message: 'Could not find a valid image or clothing item on this page.' 
      }, { status: 400 });
    }
    
    if (!productData.name || productData.name === 'Unknown Product') {
      log('POST /api/wardrobe - Failed to extract product name', { url, productData, requestId });
      return NextResponse.json({ 
        error: 'Failed to extract product details',
        message: 'Could not identify the product. Please try a different URL or a more popular retailer.' 
      }, { status: 400 });
    }
    
    log('POST /api/wardrobe - Product data extracted', { productData, requestId });
    
    let imageUrl = productData.image || '';
    let finalImageUrl = imageUrl;

    // Apply image cropping if image URL exists
    if (imageUrl) {
      try {
        log('POST /api/wardrobe - Fetching image for cropping', { imageUrl, requestId });
        
        // Fetch the image
        const imageResponse = await fetch(imageUrl);
        if (!imageResponse.ok) {
          throw new Error(`Failed to fetch image: ${imageResponse.status}`);
        }
        
        // Convert image to buffer
        const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());
        
        // Process the image using the same function used for email items
        const itemName = productData.name || 'Unknown Product';
        log('POST /api/wardrobe - Processing image', { itemName, requestId });
        
        // Run image through the processItemImage function
        const processedBuffer = await processItemImage(imageBuffer, itemName);
        
        // Convert processed buffer to base64 for storage
        finalImageUrl = `data:image/jpeg;base64,${processedBuffer.toString('base64')}`;
        
        log('POST /api/wardrobe - Image processing successful', { requestId });
      } catch (imageError) {
        // In case of failure, use the original image
        log('Error processing product image', { error: imageError, fallback: 'Using original image', requestId });
        // Keep using the original image URL
        finalImageUrl = imageUrl;
      }
    } else {
      log('POST /api/wardrobe - No image URL found for the product', { productName: productData.name, requestId });
    }

    // Save to database with the processed image
    const item = await prisma.wardrobe.create({
      data: {
        userId: session.user.id,
        brand: productData.brand || 'Unknown Brand',
        name: productData.name || 'Unknown Product',
        price: productData.price || '',
        originalPrice: productData.originalPrice || '',
        discount: productData.discount || '',
        image: finalImageUrl || '', // Use the cropped image or fallback to original
        productLink: url,
        size: productData.size || '',
        color: productData.color || '',
        category: productData.category || 'Uncategorized',
        sourceRetailer: productData.sourceRetailer || 'Unknown'
      }
    });

    log('POST /api/wardrobe - Created item', { item, requestId });
    return NextResponse.json({
      success: true,
      item,
      message: `Successfully added ${productData.name} from ${productData.sourceRetailer || 'store'} to your wardrobe`
    });
  } catch (error) {
    log('Error adding item to wardrobe', { error, requestId });
    return NextResponse.json(
      { 
        error: 'Failed to add item to wardrobe',
        message: 'An unexpected error occurred while adding this item to your wardrobe. Please try again.',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

// DELETE /api/wardrobe - Delete item from wardrobe
export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  log('DELETE /api/wardrobe - Session', { userId: session?.user?.id });
  
  if (!session?.user?.id) {
    log('DELETE /api/wardrobe - Unauthorized: No user ID in session');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      log('DELETE /api/wardrobe - No item ID provided');
      return NextResponse.json({ error: 'Item ID required' }, { status: 400 });
    }

    log('DELETE /api/wardrobe - Attempting to delete item', { id, userId: session.user.id });

    // First verify the item exists and belongs to the user
    const item = await prisma.wardrobe.findFirst({
      where: {
        id,
        userId: session.user.id
      }
    });

    if (!item) {
      log('DELETE /api/wardrobe - Item not found or not owned by user', { id, userId: session.user.id });
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    // Delete the item
    const deletedItem = await prisma.wardrobe.delete({
      where: {
        id
      }
    });

    log('DELETE /api/wardrobe - Successfully deleted item', { deletedItem });
    return NextResponse.json({ 
      message: 'Item deleted successfully', 
      deletedItem,
      success: true 
    });
  } catch (error: any) {
    log('Error deleting item', { error });
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Item not found', success: false },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to delete item', success: false },
      { status: 500 }
    );
  }
} 