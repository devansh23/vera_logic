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
