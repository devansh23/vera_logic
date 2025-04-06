import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { log } from '@/lib/logger';
import { categorizeItem } from '@/lib/categorize-items';
import { processItemImage } from '@/lib/image-utils';

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
  const session = await getServerSession(authOptions);
  log('POST /api/wardrobe - Session', { userId: session?.user?.id });
  
  if (!session?.user?.id) {
    log('POST /api/wardrobe - Unauthorized: No user ID in session');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { url } = body;
    log('POST /api/wardrobe - Processing URL', { url });

    // Get the base URL for API calls
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const host = request.headers.get('host') || 'localhost:3000';
    const baseUrl = `${protocol}://${host}`;

    // Fetch product details from Myntra/H&M
    const productResponse = await fetch(`${baseUrl}/api/myntra-product?url=${encodeURIComponent(url)}`);
    if (!productResponse.ok) {
      const errorText = await productResponse.text();
      log('Failed to fetch product details', { error: errorText });
      throw new Error('Failed to fetch product details');
    }

    const productData = await productResponse.json();
    log('POST /api/wardrobe - Product data', { productData });
    
    let imageUrl = productData.image || '';
    let finalImageUrl = imageUrl;

    // Apply image cropping if image URL exists
    if (imageUrl) {
      try {
        log('POST /api/wardrobe - Fetching image for cropping', { imageUrl });
        
        // Fetch the image
        const imageResponse = await fetch(imageUrl);
        if (!imageResponse.ok) {
          throw new Error(`Failed to fetch image: ${imageResponse.status}`);
        }
        
        // Convert image to buffer
        const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());
        
        // Process the image using the same function used for email items
        const itemName = productData.name || 'Unknown Product';
        log('POST /api/wardrobe - Processing image', { itemName });
        
        // Run image through the processItemImage function
        const processedBuffer = await processItemImage(imageBuffer, itemName);
        
        // Convert processed buffer to base64 for storage
        finalImageUrl = `data:image/jpeg;base64,${processedBuffer.toString('base64')}`;
        
        log('POST /api/wardrobe - Image processing successful');
      } catch (imageError) {
        // In case of failure, use the original image
        log('Error processing product image', { error: imageError, fallback: 'Using original image' });
        // Keep using the original image URL
        finalImageUrl = imageUrl;
      }
    }

    // Determine category for the item
    const itemToCategorizee = {
      name: productData.name || 'Unknown Product',
      brand: productData.brand || 'Unknown Brand',
      color: productData.color || '',
      sourceRetailer: new URL(url).hostname.includes('myntra.com') ? 'Myntra' : 'Other'
    };
    const category = categorizeItem(itemToCategorizee);

    // Save to database with the processed image
    const item = await prisma.wardrobe.create({
      data: {
        userId: session.user.id,
        brand: productData.brand || 'Unknown Brand',
        name: productData.name || 'Unknown Product',
        price: productData.price || '',
        originalPrice: productData.originalPrice || '',
        discount: productData.discount || '',
        image: finalImageUrl, // Use the cropped image or fallback to original
        productLink: url,
        size: productData.size || '',
        color: productData.color || '',
        category: category
      }
    });

    log('POST /api/wardrobe - Created item', { item });
    return NextResponse.json(item);
  } catch (error) {
    log('Error adding item to wardrobe', { error });
    return NextResponse.json(
      { error: 'Failed to add item to wardrobe' },
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