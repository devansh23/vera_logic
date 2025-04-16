import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { log } from '@/lib/logger';
import { authOptions } from '@/lib/auth';

// POST /api/packs/[id]/outfits - Add an outfit to a pack
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
    const { outfitId } = body;

    if (!outfitId) {
      return NextResponse.json(
        { error: 'Outfit ID is required' },
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

    // Check if the outfit exists and belongs to the user
    const outfit = await prisma.outfit.findFirst({
      where: {
        id: outfitId,
        userId: session.user.id
      }
    });

    if (!outfit) {
      return NextResponse.json(
        { error: 'Outfit not found or does not belong to the user' },
        { status: 404 }
      );
    }

    // Check if the outfit is already in the pack
    const existingPackOutfit = await prisma.packOutfit.findUnique({
      where: {
        packId_outfitId: {
          packId,
          outfitId
        }
      }
    });

    if (existingPackOutfit) {
      return NextResponse.json(
        { error: 'Outfit is already in the pack' },
        { status: 409 }
      );
    }

    // Add the outfit to the pack
    const packOutfit = await prisma.packOutfit.create({
      data: {
        packId,
        outfitId
      },
      include: {
        outfit: true
      }
    });

    log('POST /api/packs/[id]/outfits - Added outfit to pack', { packId, outfitId });
    
    return NextResponse.json({
      success: true,
      packOutfit
    });
  } catch (error) {
    log('POST /api/packs/[id]/outfits - Unhandled error:', error);
    return NextResponse.json(
      { error: 'Failed to add outfit to pack', details: String(error) },
      { status: 500 }
    );
  }
}

// DELETE /api/packs/[id]/outfits - Remove an outfit from a pack
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
    const outfitId = searchParams.get('outfitId');
    
    if (!outfitId) {
      return NextResponse.json(
        { error: 'Outfit ID is required' },
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

    // Check if the outfit is in the pack
    const packOutfit = await prisma.packOutfit.findUnique({
      where: {
        packId_outfitId: {
          packId,
          outfitId
        }
      }
    });

    if (!packOutfit) {
      return NextResponse.json(
        { error: 'Outfit is not in the pack' },
        { status: 404 }
      );
    }

    // Remove the outfit from the pack
    await prisma.packOutfit.delete({
      where: {
        packId_outfitId: {
          packId,
          outfitId
        }
      }
    });

    log('DELETE /api/packs/[id]/outfits - Removed outfit from pack', { packId, outfitId });
    
    return NextResponse.json({
      success: true,
      message: 'Outfit removed from pack successfully'
    });
  } catch (error) {
    log('DELETE /api/packs/[id]/outfits - Unhandled error:', error);
    return NextResponse.json(
      { error: 'Failed to remove outfit from pack', details: String(error) },
      { status: 500 }
    );
  }
} 