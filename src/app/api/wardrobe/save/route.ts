import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { log } from '@/lib/logger';

// POST /api/wardrobe/save - Save the entire wardrobe state
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  log('POST /api/wardrobe/save - Session', { userId: session?.user?.id });
  
  if (!session?.user?.id) {
    log('POST /api/wardrobe/save - Unauthorized: No user ID in session');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { items } = await request.json();
    log('POST /api/wardrobe/save - Saving wardrobe', { itemCount: items.length });

    // First, delete all existing items for this user
    await prisma.wardrobe.deleteMany({
      where: {
        userId: session.user.id
      }
    });
    
    log('POST /api/wardrobe/save - Deleted existing items');

    // Then create all the new items
    const savedItems = await Promise.all(
      items.map(async (item: any) => {
        return prisma.wardrobe.create({
          data: {
            userId: session.user.id,
            brand: item.brand || 'Unknown Brand',
            name: item.name || 'Unknown Product',
            price: item.price || '',
            originalPrice: item.originalPrice || '',
            discount: item.discount || '',
            image: item.image || '',
            productLink: item.productLink || item.myntraLink || '',
            size: item.size || '',
            color: item.color || ''
          }
        });
      })
    );

    log('POST /api/wardrobe/save - Created new items', { count: savedItems.length });
    return NextResponse.json({ 
      message: 'Wardrobe saved successfully',
      count: savedItems.length
    });
  } catch (error: any) {
    log('Error saving wardrobe', { error });
    return NextResponse.json(
      { error: 'Failed to save wardrobe', details: error.message || 'Unknown error' },
      { status: 500 }
    );
  }
} 