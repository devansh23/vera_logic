import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// PATCH /api/outfits/[outfitId]
export async function PATCH(
  request: Request,
  { params }: { params: { outfitId: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { outfitId } = params;
  let name: string;

  try {
    const body = await request.json();
    name = body.name;
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ message: 'Name is required' }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ message: 'Invalid request body' }, { status: 400 });
  }

  try {
    // Verify the user owns the outfit before updating
    const outfit = await prisma.outfit.findUnique({
      where: {
        id: outfitId,
      },
      select: {
        userId: true, // Select only userId for ownership check
      },
    });

    if (!outfit) {
      return NextResponse.json({ message: 'Outfit not found' }, { status: 404 });
    }

    if (outfit.userId !== session.user.id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    // Update the outfit name
    const updatedOutfit = await prisma.outfit.update({
      where: {
        id: outfitId,
        // Redundant check, but good practice
        userId: session.user.id, 
      },
      data: {
        name: name.trim(),
      },
    });

    return NextResponse.json(updatedOutfit);
  } catch (error) {
    console.error('Error updating outfit name:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
} 