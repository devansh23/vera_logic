import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { log } from '@/lib/logger';
import { authOptions } from '@/lib/auth';

// GET /api/packs - Get all packs for the current user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    log('GET /api/packs - Session', { userId: session?.user?.id });
    
    if (!session?.user?.id) {
      log('GET /api/packs - Unauthorized: No user ID in session');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (id) {
      // Get a specific pack with full details
      const pack = await prisma.pack.findUnique({
        where: {
          id,
          userId: session.user.id
        },
        include: {
          packOutfits: {
            include: {
              outfit: {
                include: {
                  items: {
                    include: {
                      wardrobeItem: true
                    }
                  }
                }
              }
            }
          },
          packItems: {
            include: {
              wardrobeItem: true
            }
          }
        }
      });

      if (!pack) {
        return NextResponse.json(
          { error: 'Pack not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(pack);
    } else {
      // Get all packs with basic details
      const packs = await prisma.pack.findMany({
        where: {
          userId: session.user.id
        },
        include: {
          packOutfits: {
            include: {
              outfit: true
            }
          },
          packItems: {
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

      log(`GET /api/packs - Found packs for user`, { userId: session.user.id, count: packs.length });
      
      return NextResponse.json(packs);
    }
  } catch (error) {
    log('Error fetching packs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch packs' },
      { status: 500 }
    );
  }
}

// POST /api/packs - Create a new pack
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    log('POST /api/packs - Session', { userId: session?.user?.id });
    
    if (!session?.user?.id) {
      log('POST /api/packs - Unauthorized: No user ID in session');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    log('POST /api/packs - Request body:', JSON.stringify(body, null, 2));
    
    const { name, description, outfitIds, wardrobeItemIds } = body;

    if (!name) {
      log('POST /api/packs - Invalid request: Missing name');
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    // Create the pack with any outfits and items specified
    const packData: any = {
      name,
      description: description || null,
      userId: session.user.id,
    };

    // Add outfit relations if provided
    if (outfitIds && Array.isArray(outfitIds) && outfitIds.length > 0) {
      packData.packOutfits = {
        create: outfitIds.map(outfitId => ({
          outfitId
        }))
      };
      
      // Fetch all wardrobe items from the selected outfits for auto-inclusion
      const outfitItems = await prisma.outfitItem.findMany({
        where: {
          outfitId: {
            in: outfitIds
          }
        },
        select: {
          wardrobeItemId: true
        }
      });
      
      // Get unique wardrobeItemIds from outfit items
      const outfitWardrobeItemIds = outfitItems.map(item => item.wardrobeItemId);
      
      // Combine with manually selected wardrobe items and deduplicate
      let allWardrobeItemIds = [...new Set([
        ...(wardrobeItemIds || []),
        ...outfitWardrobeItemIds
      ])];
      
      log('POST /api/packs - Auto-including outfit items:', { 
        fromOutfits: outfitWardrobeItemIds.length,
        manuallySelected: (wardrobeItemIds || []).length,
        afterDeduplication: allWardrobeItemIds.length
      });
      
      // Set packItems with the combined deduplicated list
      packData.packItems = {
        create: allWardrobeItemIds.map(wardrobeItemId => ({
          wardrobeItemId
        }))
      };
    } else if (wardrobeItemIds && Array.isArray(wardrobeItemIds) && wardrobeItemIds.length > 0) {
      // If no outfits but wardrobe items are provided
      packData.packItems = {
        create: wardrobeItemIds.map(wardrobeItemId => ({
          wardrobeItemId
        }))
      };
    }

    const pack = await prisma.pack.create({
      data: packData,
      include: {
        packOutfits: {
          include: {
            outfit: true
          }
        },
        packItems: {
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
    
    log('POST /api/packs - Successfully created pack:', pack.id);
    
    return NextResponse.json({
      success: true,
      pack
    });
  } catch (error) {
    log('POST /api/packs - Unhandled error:', error);
    return NextResponse.json(
      { error: 'Failed to create pack', details: String(error) },
      { status: 500 }
    );
  }
}

// PUT /api/packs - Update a pack
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    log('PUT /api/packs - Request body:', JSON.stringify(body, null, 2));
    
    const { id, name, description, outfitIds, wardrobeItemIds } = body;

    if (!id || !name) {
      return NextResponse.json(
        { error: 'Pack ID and name are required' },
        { status: 400 }
      );
    }

    // Check if the pack exists and belongs to the user
    const existingPack = await prisma.pack.findFirst({
      where: {
        id,
        userId: session.user.id
      }
    });

    if (!existingPack) {
      return NextResponse.json(
        { error: 'Pack not found or does not belong to the user' },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData: any = {
      name,
      description: description || null
    };

    // If outfits were specified, first delete all existing outfit relationships
    if (outfitIds && Array.isArray(outfitIds)) {
      // Delete existing outfit relationships
      await prisma.packOutfit.deleteMany({
        where: {
          packId: id
        }
      });
      
      // Add new outfit relationships
      if (outfitIds.length > 0) {
        updateData.packOutfits = {
          create: outfitIds.map(outfitId => ({
            outfitId
          }))
        };
      }
    }

    // If wardrobe items were specified, first delete all existing item relationships
    if (wardrobeItemIds !== undefined) {
      // Delete existing item relationships
      await prisma.packItem.deleteMany({
        where: {
          packId: id
        }
      });
      
      // Gather all wardrobe items from outfits if outfits are specified
      let allWardrobeItemIds: string[] = [];
      
      if (outfitIds && Array.isArray(outfitIds) && outfitIds.length > 0) {
        // Fetch all wardrobe items from the selected outfits for auto-inclusion
        const outfitItems = await prisma.outfitItem.findMany({
          where: {
            outfitId: {
              in: outfitIds
            }
          },
          select: {
            wardrobeItemId: true
          }
        });
        
        // Get unique wardrobeItemIds from outfit items
        const outfitWardrobeItemIds = outfitItems.map(item => item.wardrobeItemId);
        
        // Combine with manually selected wardrobe items and deduplicate
        allWardrobeItemIds = [...new Set([
          ...(wardrobeItemIds || []),
          ...outfitWardrobeItemIds
        ])];
        
        log('PUT /api/packs - Auto-including outfit items:', { 
          fromOutfits: outfitWardrobeItemIds.length,
          manuallySelected: (wardrobeItemIds || []).length,
          afterDeduplication: allWardrobeItemIds.length
        });
      } else {
        // If no outfits or outfits not updated, just use the provided wardrobe items
        allWardrobeItemIds = wardrobeItemIds || [];
      }
      
      // Add new wardrobe item relationships if there are any
      if (allWardrobeItemIds.length > 0) {
        updateData.packItems = {
          create: allWardrobeItemIds.map(wardrobeItemId => ({
            wardrobeItemId
          }))
        };
      }
    }

    // Update the pack
    const pack = await prisma.pack.update({
      where: {
        id
      },
      data: updateData,
      include: {
        packOutfits: {
          include: {
            outfit: true
          }
        },
        packItems: {
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

    log('PUT /api/packs - Successfully updated pack:', pack.id);
    
    return NextResponse.json({
      success: true,
      pack
    });
  } catch (error) {
    log('PUT /api/packs - Unhandled error:', error);
    return NextResponse.json(
      { error: 'Failed to update pack', details: String(error) },
      { status: 500 }
    );
  }
}

// DELETE /api/packs - Delete a pack
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Pack ID is required' },
        { status: 400 }
      );
    }

    // Check if the pack exists and belongs to the user
    const existingPack = await prisma.pack.findFirst({
      where: {
        id,
        userId: session.user.id
      }
    });

    if (!existingPack) {
      return NextResponse.json(
        { error: 'Pack not found or does not belong to the user' },
        { status: 404 }
      );
    }

    // Delete the pack (Prisma will cascade delete the related records)
    await prisma.pack.delete({
      where: {
        id
      }
    });

    return NextResponse.json({
      success: true
    });
  } catch (error) {
    log('DELETE /api/packs - Unhandled error:', error);
    return NextResponse.json(
      { error: 'Failed to delete pack' },
      { status: 500 }
    );
  }
} 