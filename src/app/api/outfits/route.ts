import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET /api/outfits - Get all outfits for the current user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const outfits = await prisma.outfit.findMany({
      where: { 
        user: {
          email: session.user.email
        }
      },
      include: {
        items: {
          include: {
            wardrobeItem: true
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
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
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const data = await request.json();
    const { name, items } = data;
    
    if (!name || !items || !Array.isArray(items)) {
      return NextResponse.json(
        { error: 'Invalid data format. Name and items array are required.' },
        { status: 400 }
      );
    }
    
    // Get the user ID
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Create the outfit with items
    const outfit = await prisma.outfit.create({
      data: {
        name,
        userId: user.id,
        items: {
          create: items.map((item: any) => ({
            wardrobeItemId: item.wardrobeItemId,
            left: item.left,
            top: item.top,
            zIndex: 1, // Default z-index
            width: item.width || 150, // Default width
            height: item.height || 150, // Default height
          }))
        }
      },
      include: {
        items: true
      }
    });
    
    return NextResponse.json(outfit);
  } catch (error) {
    console.error('Error creating outfit:', error);
    return NextResponse.json(
      { error: 'Failed to create outfit' },
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

    const outfit = await prisma.outfit.update({
      where: {
        id,
        userId: session.user.id, // Ensure the outfit belongs to the user
      },
      data: {
        name,
        items,
      },
    });

    return NextResponse.json(outfit);
  } catch (error) {
    log('Error updating outfit', { error });
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
    log('Error deleting outfit', { error });
    return NextResponse.json(
      { error: 'Failed to delete outfit' },
      { status: 500 }
    );
  }
}
