import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET /api/outfits - Get all outfits for the current user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const outfits = await prisma.outfit.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        items: {
          include: {
            wardrobeItem: {
              select: {
                name: true,
                image: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(outfits);
  } catch (error) {
    console.error('Error fetching outfits:', error);
    return NextResponse.json(
      { error: 'Failed to fetch outfits' },
      { status: 500 }
    );
  }
}

// POST /api/outfits - Create a new outfit
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      console.log('POST /api/outfits - Unauthorized: No user session');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    console.log('POST /api/outfits - Request body:', JSON.stringify(body, null, 2));
    const { name, items, tryOnImage } = body;

    if (!name || !items || !Array.isArray(items) || items.length === 0) {
      console.log('POST /api/outfits - Invalid request body:', { name, itemsLength: items?.length });
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    // Validate that all items have wardrobeItemId
    const missingIds = items.filter(item => !item.wardrobeItemId);
    if (missingIds.length > 0) {
      console.log('POST /api/outfits - Missing wardrobeItemId in items:', missingIds);
      return NextResponse.json(
        { error: 'All outfit items must have wardrobeItemId' },
        { status: 400 }
      );
    }

    // First check if all wardrobeItemIds exist in the database
    const wardrobeItemIds = items.map(item => item.wardrobeItemId);
    console.log('POST /api/outfits - Checking wardrobe items:', wardrobeItemIds);

    const existingWardrobeItems = await prisma.wardrobe.findMany({
      where: {
        id: {
          in: wardrobeItemIds
        }
      }
    });

    if (existingWardrobeItems.length !== wardrobeItemIds.length) {
      const missingIds = wardrobeItemIds.filter(id => 
        !existingWardrobeItems.some(item => item.id === id)
      );
      console.log('POST /api/outfits - Missing wardrobe items:', missingIds);
      return NextResponse.json(
        { error: 'Some wardrobe items do not exist', details: missingIds },
        { status: 400 }
      );
    }

    // Validate item data before creating outfit to catch any issues
    const itemsToCreate = items.map(item => {
      // Check if wardrobeItemId is valid 
      if (!item.wardrobeItemId || typeof item.wardrobeItemId !== 'string') {
        console.error('Invalid wardrobeItemId', item);
        throw new Error(`Invalid wardrobeItemId for item: ${JSON.stringify(item)}`);
      }

      // Ensure all required fields have values and proper types
      return {
        wardrobeItemId: item.wardrobeItemId,
        left: parseFloat(typeof item.left === 'number' ? item.left.toFixed(2) : '0'),
        top: parseFloat(typeof item.top === 'number' ? item.top.toFixed(2) : '0'),
        width: parseFloat(typeof item.width === 'number' ? item.width.toFixed(2) : '150'),
        height: parseFloat(typeof item.height === 'number' ? item.height.toFixed(2) : '150'),
        zIndex: typeof item.zIndex === 'number' ? Math.round(item.zIndex) : 1,
        isPinned: Boolean(item.isPinned)
      };
    });
    
    console.log('POST /api/outfits - Items to create:', JSON.stringify(itemsToCreate, null, 2));

    // Create outfit with try-on image
    const outfit = await prisma.outfit.create({
      data: {
        name,
        userId: session.user.id,
        tryOnImage: tryOnImage || null, // Handle null case explicitly
        items: {
          create: itemsToCreate
        }
      },
      include: {
        items: {
          include: {
            wardrobeItem: {
              select: {
                name: true,
                image: true
              }
            }
          }
        }
      }
    });
    
    console.log('POST /api/outfits - Successfully created outfit:', outfit.id);
    
    return NextResponse.json({
      success: true,
      outfit
    });
  } catch (error) {
    console.error('POST /api/outfits - Unhandled error:', error);
    return NextResponse.json(
      { error: 'Failed to create outfit', details: String(error) },
      { status: 500 }
    );
  }
}

// PUT /api/outfits/:id - Update an outfit
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { id, name, items } = data;
    
    console.log('PUT /api/outfits - Request:', { id, name, itemsCount: items?.length });
    
    if (!id || !name || !items || !Array.isArray(items)) {
      return NextResponse.json(
        { error: 'Invalid request data. Missing id, name, or items.' },
        { status: 400 }
      );
    }
    
    // First, check if the outfit exists and belongs to the user
    const existingOutfit = await prisma.outfit.findFirst({
      where: {
        id,
        userId: session.user.id
      }
    });
    
    if (!existingOutfit) {
      return NextResponse.json(
        { error: 'Outfit not found or does not belong to the user' },
        { status: 404 }
      );
    }
    
    // Update outfit - delete all existing outfit items and create new ones
    const updatedOutfit = await prisma.outfit.update({
      where: {
        id,
        userId: session.user.id
      },
      data: {
        name,
        items: {
          // Delete all existing items
          deleteMany: {},
          // Create new items
          create: items.map(item => ({
            wardrobeItemId: item.wardrobeItemId,
            left: item.left,
            top: item.top,
            width: item.width || 150,
            height: item.height || 150,
            zIndex: item.zIndex || 1,
            isPinned: item.isPinned || false
          }))
        }
      },
      include: {
        items: {
          include: {
            wardrobeItem: {
              select: {
                name: true,
                image: true
              }
            }
          }
        }
      }
    });
    
    console.log('PUT /api/outfits - Successfully updated outfit:', id);
    return NextResponse.json(updatedOutfit);
  } catch (error) {
    console.error('PUT /api/outfits - Error:', error);
    return NextResponse.json(
      { error: 'Failed to update outfit' },
      { status: 500 }
    );
  }
}

// DELETE /api/outfits/:id - Delete an outfit
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Outfit ID is required' },
        { status: 400 }
      );
    }

    await prisma.outfit.delete({
      where: {
        id,
        userId: session.user.id, // Ensure the outfit belongs to the user
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting outfit', error);
    return NextResponse.json(
      { error: 'Failed to delete outfit' },
      { status: 500 }
    );
  }
}
