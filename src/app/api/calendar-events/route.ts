import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { log } from '@/lib/logger';

// GET /api/calendar-events - Get all calendar events for the current user
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');

    const where = {
      userId: session.user.id,
      ...(startDate && endDate
        ? {
            date: {
              gte: new Date(startDate),
              lte: new Date(endDate),
            },
          }
        : {}),
    };

    const events = await prisma.calendarEvent.findMany({
      where,
      include: {
        outfit: true,
      },
      orderBy: { date: 'asc' },
    });

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
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { title, date, outfitId } = data;

    const event = await prisma.calendarEvent.create({
      data: {
        title,
        date: new Date(date),
        outfitId,
        userId: session.user.id,
      },
      include: {
        outfit: true,
      },
    });

    return NextResponse.json(event);
  } catch (error) {
    log('Error creating calendar event', { error });
    return NextResponse.json(
      { error: 'Failed to create calendar event' },
      { status: 500 }
    );
  }
}

// PUT /api/calendar-events/:id - Update a calendar event
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { id, title, date, outfitId } = data;

    const event = await prisma.calendarEvent.update({
      where: {
        id,
        userId: session.user.id,
      },
      data: {
        title,
        date: new Date(date),
        outfitId,
      },
      include: {
        outfit: true,
      },
    });

    return NextResponse.json(event);
  } catch (error) {
    log('Error updating calendar event', { error });
    return NextResponse.json(
      { error: 'Failed to update calendar event' },
      { status: 500 }
    );
  }
}

// DELETE /api/calendar-events/:id - Delete a calendar event
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
        { error: 'Calendar event ID is required' },
        { status: 400 }
      );
    }

    await prisma.calendarEvent.delete({
      where: {
        id,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    log('Error deleting calendar event', { error });
    return NextResponse.json(
      { error: 'Failed to delete calendar event' },
      { status: 500 }
    );
  }
} 