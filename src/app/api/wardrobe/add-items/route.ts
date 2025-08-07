import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { log } from '@/lib/logger';
import { addItemsToWardrobe } from '@/lib/wardrobe-integration';

interface AddItemsRequest {
  items: Array<{
    brand?: string;
    name: string;
    price?: string;
    originalPrice?: string;
    discount?: string;
    size?: string;
    color?: string;
    imageUrl?: string;
    image?: string;
    productLink?: string;
    category?: string;
    source?: string;
    sourceEmailId?: string;
    sourceRetailer?: string;
    retailer: string;
    emailId: string;
    orderId?: string;
  }>;
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const body: AddItemsRequest = await request.json();
    const { items } = body;

    log('Adding items to wardrobe', {
      userId: session.user.id,
      itemCount: items.length
    });

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'No items provided' },
        { status: 400 }
      );
    }

    // Use the wardrobe integration with proper deduplication
    const result = await addItemsToWardrobe(session.user.id, items);

    const processingTime = Date.now() - startTime;

    log('Items added to wardrobe successfully', {
      userId: session.user.id,
      totalItems: result.totalItems,
      addedItems: result.addedItems,
      duplicatesSkipped: result.duplicatesSkipped,
      processingTime
    });

    return NextResponse.json({
      success: true,
      message: `Successfully processed ${result.totalItems} items`,
      totalItems: result.totalItems,
      addedItems: result.addedItems,
      duplicatesSkipped: result.duplicatesSkipped,
      processingTime
    });

  } catch (error) {
    const processingTime = Date.now() - startTime;
    
    log('Failed to add items to wardrobe', {
      error: error instanceof Error ? error.message : 'Unknown error',
      processingTime
    });

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to add items to wardrobe',
        details: error instanceof Error ? error.message : 'Unknown error',
        processingTime
      },
      { status: 500 }
    );
  }
} 