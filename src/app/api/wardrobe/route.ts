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

    // NEW: URL-based add flow (e.g., { url: "https://myntra.com/..." })
    if (data && typeof data === 'object' && typeof data.url === 'string' && data.url.trim().length > 0) {
      try {
        // Scrape product details from the URL
        const product = await scrapeProduct(data.url.trim());

        // Fetch image buffer for color info if available
        const imageUrlFromProduct = product.image || (product as any).imageUrl;
        let imageBuffer = null;
        if (imageUrlFromProduct) {
          try {
            imageBuffer = await fetchImageAsBuffer(imageUrlFromProduct);
          } catch (e) {
            log('Failed to fetch image buffer for color info in URL add flow', { imageUrlFromProduct, error: e });
          }
        }

        const { dominantColor, colorTag } = await getColorInfo({
          rawColor: product.color,
          imageBuffer: imageBuffer,
        });

        // Create wardrobe item using scraped details
        try {
          const createdItem = await prisma.wardrobe.create({
            data: {
              userId: session.user.id,
              brand: product.brand || 'Unknown',
              name: product.name,
              price: product.price || '',
              originalPrice: (product as any).originalPrice || '',
              discount: (product as any).discount || '',
              image: imageUrlFromProduct || '',
              productLink: product.productLink || data.url.trim(),
              size: product.size || '',
              color: product.color || '',
              dominantColor: dominantColor,
              colorTag: colorTag,
              source: 'url',
              sourceEmailId: null,
              sourceOrderId: null,
              sourceRetailer: product.sourceRetailer || product.brand || null,
              category: product.category || 'Uncategorized',
            },
          });

          // Return in the format the UI expects
          return NextResponse.json({ item: createdItem });
        } catch (e) {
          // Handle duplicate constraint gracefully (userId, brand, name, size)
          if ((e as any)?.code === 'P2002') {
            const existing = await prisma.wardrobe.findFirst({
              where: {
                userId: session.user.id,
                brand: product.brand || 'Unknown',
                name: product.name,
                size: product.size || ''
              }
            });
            if (existing) {
              // Update existing with any improved fields from scrape
              const updated = await prisma.wardrobe.update({
                where: { id: existing.id },
                data: {
                  price: product.price || existing.price || '',
                  originalPrice: (product as any).originalPrice || existing.originalPrice || '',
                  discount: (product as any).discount || existing.discount || '',
                  image: imageUrlFromProduct || existing.image || '',
                  productLink: product.productLink || existing.productLink || '',
                  color: product.color || existing.color || '',
                  dominantColor: dominantColor || existing.dominantColor || '',
                  colorTag: colorTag || existing.colorTag || '',
                  source: existing.source ?? 'url',
                  sourceRetailer: product.sourceRetailer || existing.sourceRetailer || product.brand || null,
                  category: product.category || existing.category || 'Uncategorized',
                }
              });
              return NextResponse.json({ item: updated, duplicate: true });
            }
          }
          throw e;
        }
      } catch (scrapeError) {
        console.error('Error scraping/creating item from URL:', scrapeError);
        return new NextResponse(
          scrapeError instanceof Error ? scrapeError.message : 'Failed to add product from URL',
          { status: 500 }
        );
      }
    }

    // Existing behavior: accept a single item or array of items
    const items = Array.isArray(data) ? data : [data];

    const createdItems = await Promise.all(
      items.map(async (item) => {
        // Get color information
        const imageUrl = item.image || item.imageUrl;
        let imageBuffer = null;
        if (imageUrl) {
          try {
            imageBuffer = await fetchImageAsBuffer(imageUrl);
          } catch (e) {
            log('Failed to fetch image buffer for color info in POST', { imageUrl, error: e });
          }
        }
        
        const { dominantColor, colorTag } = await getColorInfo({
          rawColor: item.color,
          imageBuffer: imageBuffer,
        });

        try {
          return await prisma.wardrobe.create({
            data: {
              userId: session.user.id,
              brand: item.brand || 'Unknown',
              name: item.name,
              price: item.price || '',
              originalPrice: item.originalPrice || '',
              discount: item.discount || '',
              image: imageUrl || '', // Ensure image URL is saved
              productLink: item.productLink || '',
              myntraLink: item.myntraLink || '',
              size: item.size || '',
              color: item.color || '', // Keep the original color string
              dominantColor: dominantColor, // Use determined dominant color
              colorTag: colorTag, // Use determined color tag
              source: item.source || 'url',
              sourceEmailId: item.sourceEmailId || null,
              sourceOrderId: item.sourceOrderId || null,
              sourceRetailer: item.sourceRetailer || null,
              category: item.category || 'Uncategorized'
            }
          });
        } catch (e) {
          // Handle duplicate constraint gracefully (userId, brand, name, size)
          if ((e as any)?.code === 'P2002') {
            const existing = await prisma.wardrobe.findFirst({
              where: {
                userId: session.user.id,
                brand: item.brand || 'Unknown',
                name: item.name,
                size: item.size || ''
              }
            });
            if (existing) {
              // Update existing with edited fields from client (e.g., category)
              const updated = await prisma.wardrobe.update({
                where: { id: existing.id },
                data: {
                  price: item.price || existing.price || '',
                  originalPrice: item.originalPrice || existing.originalPrice || '',
                  discount: item.discount || existing.discount || '',
                  image: imageUrl || existing.image || '',
                  productLink: item.productLink || existing.productLink || '',
                  size: item.size || existing.size || '',
                  color: item.color || existing.color || '',
                  dominantColor: dominantColor || existing.dominantColor || '',
                  colorTag: colorTag || existing.colorTag || '',
                  source: item.source || existing.source || 'url',
                  sourceEmailId: item.sourceEmailId || existing.sourceEmailId || null,
                  sourceOrderId: item.sourceOrderId || existing.sourceOrderId || null,
                  sourceRetailer: item.sourceRetailer || existing.sourceRetailer || null,
                  category: item.category || existing.category || 'Uncategorized'
                }
              });
              return updated;
            }
          }
          throw e;
        }
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
    
    // Get color information
    const imageUrl = data.image || data.imageUrl;
    let imageBuffer = null;
    if (imageUrl) {
      try {
        imageBuffer = await fetchImageAsBuffer(imageUrl);
      } catch (e) {
        log('Failed to fetch image buffer for color info in PUT', { imageUrl, error: e });
      }
    }
        
    const { dominantColor, colorTag } = await getColorInfo({
      rawColor: data.color,
      imageBuffer: imageBuffer,
    });

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
        image: imageUrl || '', // Ensure image URL is saved
        productLink: data.productLink || '',
        myntraLink: data.myntraLink || '',
        size: data.size || '',
        color: data.color || '', // Keep the original color string
        dominantColor: dominantColor, // Use determined dominant color
        colorTag: colorTag, // Use determined color tag
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