import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { log } from '@/lib/logger';
import { categorizeItem } from '@/lib/categorize-items';
import { getColorInfo } from '@/lib/color-utils';
import { fetchImageAsBuffer } from '@/lib/image-utils';

// Define a type for wardrobe items
interface WardrobeItem {
  id?: string;
  brand?: string;
  name?: string;
  price?: string;
  originalPrice?: string;
  discount?: string;
  image?: string;
  imageUrl?: string;
  productLink?: string;
  myntraLink?: string;
  size?: string;
  color?: string;
  sourceRetailer?: string;
  category?: string;
  source?: string;
  sourceEmailId?: string;
  sourceOrderId?: string;
}

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

    // Get all existing items for this user
    const existingItems = await prisma.wardrobe.findMany({
      where: {
        userId: session.user.id
      },
      select: {
        id: true
      }
    });
    
    // Create a set of existing IDs for faster lookup
    const existingIds = new Set(existingItems.map(item => item.id));
    
    // Track IDs that will be processed to determine which ones to delete later
    const processedIds = new Set<string>();
    
    // Process items: update existing ones or create new ones
    const savedItems = await Promise.all(
      items.map(async (item: any) => {
        // Determine category for the item if not already set
        const category = item.category || categorizeItem({
          id: item.id || '',
          name: item.name || 'Unknown Product',
          brand: item.brand || 'Unknown Brand',
          price: item.price || '',
          color: item.color || '',
          sourceRetailer: item.sourceRetailer || 'Unknown'
        });

        // Handle both imageUrl and image fields correctly
        const imageValue = item.imageUrl || item.image || '';

        // Get color information
        let imageBuffer = null;
        if (imageValue) {
          try {
            imageBuffer = await fetchImageAsBuffer(imageValue);
          } catch (e) {
            log('Failed to fetch image buffer for color info in Save', { imageValue, error: e });
          }
        }
        
        const { dominantColor, colorTag } = await getColorInfo({
          rawColor: item.color,
          imageBuffer: imageBuffer,
        });
        
        const itemData = {
          userId: session.user.id,
          brand: item.brand || 'Unknown Brand',
          name: item.name || 'Unknown Product',
          price: item.price || '',
          originalPrice: item.originalPrice || '',
          discount: item.discount || '',
          image: imageValue,
          productLink: item.productLink || item.myntraLink || '',
          size: item.size || '',
          color: item.color || '',
          dominantColor: dominantColor,
          colorTag: colorTag,
          source: item.source || null,
          sourceEmailId: item.sourceEmailId || null,
          sourceOrderId: item.sourceOrderId || null,
          sourceRetailer: item.sourceRetailer || null,
          category: category
        };
        
        // If item has a non-temporary ID and it exists in the database, update it
        if (item.id && !item.id.startsWith('temp-') && existingIds.has(item.id)) {
          processedIds.add(item.id);
          return prisma.wardrobe.update({
            where: {
              id: item.id,
              userId: session.user.id
            },
            data: itemData
          });
        } else {
          // Otherwise create a new item
          return prisma.wardrobe.create({
            data: itemData
          });
        }
      })
    );
    
    // Delete items that are no longer in the list
    const idsToDelete = Array.from(existingIds).filter(id => !processedIds.has(id));
    if (idsToDelete.length > 0) {
      await prisma.wardrobe.deleteMany({
        where: {
          id: {
            in: idsToDelete
          },
          userId: session.user.id
        }
      });
      log('POST /api/wardrobe/save - Deleted removed items', { count: idsToDelete.length });
    }

    log('POST /api/wardrobe/save - Updated/created items', { count: savedItems.length });
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