import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { log } from '@/lib/logger';
import { EmailRetrievalService } from '@/lib/email-retrieval';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const retailer = searchParams.get('retailer');
    const maxResults = parseInt(searchParams.get('maxResults') || '10');
    const onlyUnread = searchParams.get('onlyUnread') !== 'false';
    const daysBack = parseInt(searchParams.get('daysBack') || '30');

    if (!retailer) {
      return NextResponse.json(
        { error: 'Retailer parameter is required' },
        { status: 400 }
      );
    }

    log('Listing emails for retailer', {
      userId: session.user.id,
      retailer,
      maxResults,
      onlyUnread,
      daysBack
    });

    const emailService = new EmailRetrievalService();
    
    const emails = await emailService.fetchEmailsForRetailer(
      session.user.id,
      retailer,
      { maxResults, onlyUnread, daysBack }
    );

    // Return email IDs and basic info for testing
    const emailList = emails.map(email => ({
      id: email.id,
      subject: email.subject,
      from: email.from,
      date: email.date,
      snippet: email.snippet
    }));

    return NextResponse.json({
      success: true,
      retailer,
      count: emailList.length,
      emails: emailList
    });

  } catch (error) {
    log('Error listing emails', {
      error: error instanceof Error ? error.message : 'Unknown error'
    });

    return NextResponse.json(
      { error: 'Failed to list emails' },
      { status: 500 }
    );
  }
} 