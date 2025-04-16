import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { log } from '@/lib/logger';
import { authOptions } from '@/lib/auth';

// POST /api/packs/[id]/items - Add a wardrobe item to a pack
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const packId = params.id;
    const body = await request.json();
    const { wardrobeItemId } = body;

    if (!wardrobeItemId) {
      return NextResponse.json(
        { error: 'Wardrobe item ID is required' },
        { status: 400 }
      );
    }

    // Check if the pack exists and belongs to the user
    const pack = await prisma.pack.findFirst({
      where: {
        id: packId,
        userId: session.user.id
      }
    });

    if (!pack) {
      return NextResponse.json(
        { error: 'Pack not found or does not belong to the user' },
        { status: 404 }
      );
    }

    // Check if the wardrobe item exists and belongs to the user
    const wardrobeItem = await prisma.wardrobe.findFirst({
      where: {
        id: wardrobeItemId,
        userId: session.user.id
      }
    });

    if (!wardrobeItem) {
      return NextResponse.json(
        { error: 'Wardrobe item not found or does not belong to the user' },
        { status: 404 }
      );
    }

    // Check if the wardrobe item is already in the pack
    const existingPackItem = await prisma.packItem.findUnique({
      where: {
        packId_wardrobeItemId: {
          packId,
          wardrobeItemId
        }
      }
    });

    if (existingPackItem) {
      return NextResponse.json(
        { error: 'Wardrobe item is already in the pack' },
        { status: 409 }
      );
    }

    // Add the wardrobe item to the pack
    const packItem = await prisma.packItem.create({
      data: {
        packId,
        wardrobeItemId
      },
      include: {
        wardrobeItem: true
      }
    });

    log('POST /api/packs/[id]/items - Added wardrobe item to pack', { packId, wardrobeItemId });
    
    return NextResponse.json({
      success: true,
      packItem
    });
  } catch (error) {
    log('POST /api/packs/[id]/items - Unhandled error:', error);
    return NextResponse.json(
      { error: 'Failed to add wardrobe item to pack', details: String(error) },
      { status: 500 }
    );
  }
}

// DELETE /api/packs/[id]/items - Remove a wardrobe item from a pack
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const packId = params.id;
    const { searchParams } = new URL(request.url);
    const wardrobeItemId = searchParams.get('wardrobeItemId');
    
    if (!wardrobeItemId) {
      return NextResponse.json(
        { error: 'Wardrobe item ID is required' },
        { status: 400 }
      );
    }

    // Check if the pack exists and belongs to the user
    const pack = await prisma.pack.findFirst({
      where: {
        id: packId,
        userId: session.user.id
      }
    });

    if (!pack) {
      return NextResponse.json(
        { error: 'Pack not found or does not belong to the user' },
        { status: 404 }
      );
    }

    // Check if the wardrobe item is in the pack
    const packItem = await prisma.packItem.findUnique({
      where: {
        packId_wardrobeItemId: {
          packId,
          wardrobeItemId
        }
      }
    });

    if (!packItem) {
      return NextResponse.json(
        { error: 'Wardrobe item is not in the pack' },
        { status: 404 }
      );
    }

    // Remove the wardrobe item from the pack
    await prisma.packItem.delete({
      where: {
        packId_wardrobeItemId: {
          packId,
          wardrobeItemId
        }
      }
    });

    log('DELETE /api/packs/[id]/items - Removed wardrobe item from pack', { packId, wardrobeItemId });
    
    return NextResponse.json({
      success: true,
      message: 'Wardrobe item removed from pack successfully'
    });
  } catch (error) {
    log('DELETE /api/packs/[id]/items - Unhandled error:', error);
    return NextResponse.json(
      { error: 'Failed to remove wardrobe item from pack', details: String(error) },
      { status: 500 }
    );
  }
} 