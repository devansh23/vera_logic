import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { log } from '@/lib/logger';
import { categorizeItem } from '@/lib/categorize-items';
import { processItemImage } from '@/lib/image-utils';
import { scrapeProduct } from '@/lib/scrape-product';
import { fetchImageAsBuffer } from '@/lib/image-utils';
import { getColorInfo, determineColorTag } from '@/lib/color-utils';

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
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const data = await req.json();
    const items = Array.isArray(data) ? data : [data];

    const createdItems = await Promise.all(
      items.map(async (item) => {
        // Determine the color tag for the item
        const colorTag = determineColorTag(item.color, item.dominantColor);

        return prisma.wardrobe.create({
          data: {
            userId: session.user.id,
            brand: item.brand || 'Unknown',
            name: item.name,
            price: item.price || '',
            originalPrice: item.originalPrice || '',
            discount: item.discount || '',
            image: item.image || item.imageUrl || '',
            productLink: item.productLink || '',
            myntraLink: item.myntraLink || '',
            size: item.size || '',
            color: item.color || '',
            dominantColor: item.dominantColor || null,
            colorTag: colorTag,
            source: item.source || null,
            sourceEmailId: item.sourceEmailId || null,
            sourceOrderId: item.sourceOrderId || null,
            sourceRetailer: item.sourceRetailer || null,
            category: item.category || 'Uncategorized'
          }
        });
      })
    );

    return NextResponse.json(createdItems);
  } catch (error) {
    console.error('Error in POST /api/wardrobe:', error);
    return new NextResponse(
      error instanceof Error ? error.message : 'Internal Server Error',
      { status: 500 }
    );
  }
}

// PUT /api/wardrobe - Update item in wardrobe
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const data = await req.json();
    
    // Determine the color tag for the item
    const colorTag = determineColorTag(data.color, data.dominantColor);

    const updatedItem = await prisma.wardrobe.update({
      where: {
        id: data.id,
        userId: session.user.id
      },
      data: {
        brand: data.brand,
        name: data.name,
        price: data.price || '',
        originalPrice: data.originalPrice || '',
        discount: data.discount || '',
        image: data.image || data.imageUrl || '',
        productLink: data.productLink || '',
        myntraLink: data.myntraLink || '',
        size: data.size || '',
        color: data.color || '',
        dominantColor: data.dominantColor || null,
        colorTag: colorTag,
        source: data.source || null,
        sourceEmailId: data.sourceEmailId || null,
        sourceOrderId: data.sourceOrderId || null,
        sourceRetailer: data.sourceRetailer || null,
        category: data.category || 'Uncategorized'
      }
    });

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error('Error in PUT /api/wardrobe:', error);
    return new NextResponse(
      error instanceof Error ? error.message : 'Internal Server Error',
      { status: 500 }
    );
  }
}

// DELETE /api/wardrobe - Delete item from wardrobe
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return new NextResponse('Missing item ID', { status: 400 });
    }

    await prisma.wardrobe.delete({
      where: {
        id,
        userId: session.user.id
      }
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error in DELETE /api/wardrobe:', error);
    return new NextResponse(
      error instanceof Error ? error.message : 'Internal Server Error',
      { status: 500 }
    );
  }
} 