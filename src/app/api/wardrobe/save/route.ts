import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { log } from '@/lib/logger';
import { categorizeItem } from '@/lib/categorize-items';
import { getColorInfo } from '@/lib/color-utils';
import { fetchImageAsBuffer } from '@/lib/image-utils';

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

    // Use transaction to ensure atomicity and avoid connection leaks
    const result = await prisma.$transaction(async (tx) => {
      // Get existing IDs from the database to know what items to keep
      const existingItems = await tx.wardrobe.findMany({
        where: { userId: session.user.id },
        select: { id: true }
      });
      const existingIds = new Set(existingItems.map(item => item.id));
      
      // Get IDs from the incoming items - these are the items we want to keep
      const incomingIds = new Set(items.map((item: any) => item.id).filter(Boolean));
      
      // Items to delete are those that exist in the DB but not in incoming items
      const idsToDelete = Array.from(existingIds).filter(id => !incomingIds.has(id));
      
      // Delete items that are no longer in the wardrobe
      if (idsToDelete.length > 0) {
        await tx.wardrobe.deleteMany({
          where: {
            id: { in: idsToDelete },
            userId: session.user.id
          }
        });
        log('POST /api/wardrobe/save - Deleted items no longer in wardrobe', { count: idsToDelete.length });
      }
      
      // Process items in batches to avoid too many parallel operations
      const batchSize = 10; // Adjust based on your DB performance
      const savedItems = [];
      
      // Process in batches
      for (let i = 0; i < items.length; i += batchSize) {
        const batch = items.slice(i, i + batchSize);
        const batchResults = await Promise.all(
          batch.map(async (item: any) => {
            // Make sure we have an ID we can work with
            const hasValidId = item.id && typeof item.id === 'string' && item.id.length > 0;
            
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
              image: imageValue, // Use the resolved image value
              productLink: item.productLink || item.myntraLink || '',
              size: item.size || '',
              color: item.color || '', // Keep original color string
              dominantColor: dominantColor, // Use determined dominant color
              colorTag: colorTag, // Use determined color tag
              source: item.source || null,
              sourceEmailId: item.sourceEmailId || null,
              sourceOrderId: item.sourceOrderId || null,
              sourceRetailer: item.sourceRetailer || null,
              category: category
            };
            
            // If the item has a valid ID and it exists in the database, update it
            if (hasValidId && existingIds.has(item.id)) {
              return tx.wardrobe.update({
                where: { id: item.id },
                data: itemData
              });
            } 
            // Otherwise create a new item
            else {
              return tx.wardrobe.create({
                data: itemData
              });
            }
          })
        );
        
        savedItems.push(...batchResults);
      }
      
      return savedItems;
    }, {
      // Set a reasonable timeout for the transaction
      timeout: 30000 // 30 seconds
    });

    log('POST /api/wardrobe/save - Updated/created items', { count: result.length });
    return NextResponse.json({ 
      message: 'Wardrobe saved successfully',
      count: result.length,
      updatedItems: result
    });
  } catch (error: any) {
    log('Error saving wardrobe', { error });
    return NextResponse.json(
      { error: 'Failed to save wardrobe', details: error.message || 'Unknown error' },
      { status: 500 }
    );
  }
} 