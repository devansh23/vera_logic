import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const wardrobeItems = await prisma.wardrobe.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(wardrobeItems);
  } catch (error) {
    console.error('Error fetching wardrobe:', error);
    return NextResponse.json({ error: 'Failed to fetch wardrobe' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const items = Array.isArray(body) ? body : [body];

    const createdItems = [];
    
    for (const item of items) {
      const createdItem = await prisma.wardrobe.create({
        data: {
          userId: session.user.id,
          name: item.name || 'Unknown Product',
          brand: item.brand || 'Unknown',
          price: item.price || '',
          originalPrice: item.originalPrice || '',
          discount: item.discount || '',
          image: item.image || item.imageUrl || '',
          size: item.size || '',
          color: item.color || '',
          productLink: item.productLink || '',
          myntraLink: item.myntraLink || '',
          category: item.category || 'Uncategorized',
          sourceRetailer: item.sourceRetailer || item.brand || null,
        }
      });
      createdItems.push(createdItem);
    }

    return NextResponse.json(createdItems.length === 1 ? createdItems[0] : createdItems);
  } catch (error) {
    console.error('Error creating wardrobe item:', error);
    return NextResponse.json({ error: 'Failed to create wardrobe item' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: 'Item ID is required' }, { status: 400 });
    }

    // Verify the item belongs to the user
    const existingItem = await prisma.wardrobe.findFirst({
      where: {
        id: id,
        userId: session.user.id
      }
    });

    if (!existingItem) {
      return NextResponse.json({ error: 'Item not found or unauthorized' }, { status: 404 });
    }

    // Update the item
    const updatedItem = await prisma.wardrobe.update({
      where: {
        id: id
      },
      data: {
        name: updateData.name,
        brand: updateData.brand,
        price: updateData.price,
        originalPrice: updateData.originalPrice,
        discount: updateData.discount,
        image: updateData.image,
        size: updateData.size,
        color: updateData.color,
        productLink: updateData.productLink,
        myntraLink: updateData.myntraLink,
        category: updateData.category,
        sourceRetailer: updateData.sourceRetailer,
        updatedAt: new Date()
      }
    });

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error('Error updating wardrobe item:', error);
    return NextResponse.json({ error: 'Failed to update wardrobe item' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Item ID is required' }, { status: 400 });
    }

    // Verify the item belongs to the user before deleting
    const existingItem = await prisma.wardrobe.findFirst({
      where: {
        id: id,
        userId: session.user.id
      }
    });

    if (!existingItem) {
      return NextResponse.json({ error: 'Item not found or unauthorized' }, { status: 404 });
    }

    await prisma.wardrobe.delete({
      where: {
        id: id
      }
    });

    return NextResponse.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting wardrobe item:', error);
    return NextResponse.json({ error: 'Failed to delete wardrobe item' }, { status: 500 });
  }
} 