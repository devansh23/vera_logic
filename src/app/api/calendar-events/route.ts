import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { log } from '@/lib/logger';

// GET /api/calendar-events - Get user's calendar events
export async function GET(request: NextRequest) {
  const session = await getServerSession();
  
  log('GET /api/calendar-events - Session', { userId: session?.user?.id });
  
  if (!session?.user?.id) {
    log('GET /api/calendar-events - Unauthorized: No user ID in session');
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    const where: any = {
      userId: session.user.id,
    };
    
    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }
    
    const events = await prisma.calendarEvent.findMany({
      where,
      include: {
        outfit: {
          include: {
            items: {
              include: {
                wardrobeItem: true,
              },
            },
          },
        },
      },
    });
    
    log(`GET /api/calendar-events - Found events for user`, { userId: session.user.id, count: events.length });
    
    return NextResponse.json(events);
  } catch (error) {
    log('Error fetching calendar events', { error });
    return NextResponse.json(
      { error: 'Failed to fetch calendar events' },
      { status: 500 }
    );
  }
}

// POST /api/calendar-events - Create a new calendar event
export async function POST(request: NextRequest) {
  const session = await getServerSession();
  
  log('POST /api/calendar-events - Session', { userId: session?.user?.id });
  
  if (!session?.user?.id) {
    log('POST /api/calendar-events - Unauthorized: No user ID in session');
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  try {
    const body = await request.json();
    
    if (!body.title || !body.date || !body.outfitId) {
      log('POST /api/calendar-events - Invalid request body', { body });
      return NextResponse.json(
        { error: 'Invalid request body. Title, date, and outfitId are required.' },
        { status: 400 }
      );
    }
    
    // Check if outfit exists and belongs to the user
    const outfit = await prisma.outfit.findFirst({
      where: {
        id: body.outfitId,
        userId: session.user.id,
      },
    });
    
    if (!outfit) {
      log('POST /api/calendar-events - Outfit not found or not owned by user', { outfitId: body.outfitId, userId: session.user.id });
      return NextResponse.json(
        { error: 'Outfit not found or not owned by you' },
        { status: 404 }
      );
    }
    
    const event = await prisma.calendarEvent.create({
      data: {
        title: body.title,
        date: new Date(body.date),
        outfitId: body.outfitId,
        userId: session.user.id,
      },
    });
    
    log('POST /api/calendar-events - Created event', { event });
    
    return NextResponse.json(event);
  } catch (error) {
    log('Error creating calendar event', { error });
    return NextResponse.json(
      { error: 'Failed to create calendar event', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// DELETE /api/calendar-events - Delete a calendar event
export async function DELETE(request: NextRequest) {
  const session = await getServerSession();
  
  log('DELETE /api/calendar-events - Session', { userId: session?.user?.id });
  
  if (!session?.user?.id) {
    log('DELETE /api/calendar-events - Unauthorized: No user ID in session');
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      log('DELETE /api/calendar-events - No event ID provided');
      return NextResponse.json(
        { error: 'No event ID provided' },
        { status: 400 }
      );
    }
    
    log('DELETE /api/calendar-events - Attempting to delete event', { id, userId: session.user.id });
    
    // Check if event exists and belongs to user
    const event = await prisma.calendarEvent.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });
    
    if (!event) {
      log('DELETE /api/calendar-events - Event not found or not owned by user', { id, userId: session.user.id });
      return NextResponse.json(
        { error: 'Event not found or not owned by you' },
        { status: 404 }
      );
    }
    
    const deletedEvent = await prisma.calendarEvent.delete({
      where: {
        id,
      },
    });
    
    log('DELETE /api/calendar-events - Successfully deleted event', { deletedEvent });
    
    return NextResponse.json({
      message: 'Calendar event deleted successfully',
      eventId: deletedEvent.id,
    });
  } catch (error) {
    log('Error deleting calendar event', { error });
    return NextResponse.json(
      { error: 'Failed to delete calendar event', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 