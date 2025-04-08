import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { log } from '@/lib/logger';
import { categorizeItem } from '@/lib/categorize-items';
import { processItemImage } from '@/lib/image-utils';
import { scrapeProduct } from '@/lib/scrape-product';
import { fetchImageAsBuffer } from '@/lib/image-utils';
import { getColorInfo } from '@/lib/color-utils';

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
    const data = await request.json();
    
    // Get image buffer for color detection
    const imageBuffer = data.image ? await fetchImageAsBuffer(data.image) : null;
    
    // Get color information
    const { dominantColor, colorTag } = await getColorInfo({
      rawColor: data.color,
      imageBuffer,
    });

    const item = await prisma.wardrobe.create({
      data: {
        userId: session.user.id,
        brand: data.brand || '',
        name: data.name,
        price: data.price || '0',
        originalPrice: data.originalPrice,
        discount: data.discount,
        image: data.image,
        productLink: data.productLink,
        myntraLink: data.myntraLink,
        size: data.size,
        color: data.color,
        dominantColor,
        colorTag,
        category: data.category || 'Uncategorized',
        source: data.source,
        sourceEmailId: data.sourceEmailId,
        sourceOrderId: data.sourceOrderId,
        sourceRetailer: data.sourceRetailer,
      },
    });

    return NextResponse.json(item);
  } catch (error) {
    log('Error creating wardrobe item', { error });
    return NextResponse.json(
      { error: 'Failed to create wardrobe item' },
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