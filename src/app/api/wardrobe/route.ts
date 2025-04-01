import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { log } from '@/lib/logger';
import { categorizeItem } from '@/lib/categorize-items';

// GET /api/wardrobe - Get user's wardrobe
export async function GET() {
  const session = await getServerSession(authOptions);
  log('GET /api/wardrobe - Session', { userId: session?.user?.id });
  
  if (!session?.user?.id) {
    log('GET /api/wardrobe - Unauthorized: No user ID in session');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const items = await prisma.wardrobe.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        dateAdded: 'desc'
      }
    });

    log(`GET /api/wardrobe - Found items for user`, { userId: session.user.id, count: items.length });
    return NextResponse.json(items);
  } catch (error) {
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

    // Determine category for the item
    const itemToCategorizee = {
      name: productData.name || 'Unknown Product',
      brand: productData.brand || 'Unknown Brand',
      color: productData.color || '',
      sourceRetailer: new URL(url).hostname.includes('myntra.com') ? 'Myntra' : 'Other'
    };
    const category = categorizeItem(itemToCategorizee);

    // Save to database
    const item = await prisma.wardrobe.create({
      data: {
        userId: session.user.id,
        brand: productData.brand || 'Unknown Brand',
        name: productData.name || 'Unknown Product',
        price: productData.price || '',
        originalPrice: productData.originalPrice || '',
        discount: productData.discount || '',
        image: productData.image || '',
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