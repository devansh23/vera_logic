import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { log } from '@/lib/logger';
import * as GmailService from '@/lib/gmail-service';
import { withErrorHandler, throwUnauthorized, ApiError } from '@/lib/api-error-handler';

export const runtime = 'nodejs';

async function fetchEmailsHandler(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throwUnauthorized('User must be logged in to fetch emails');
  }

  const searchParams = request.nextUrl.searchParams;
  const retailer = searchParams.get('retailer');
  
  // Log the raw retailer value to help with debugging
  log('Received retailer parameter', { retailer });

  if (!retailer) {
    throw new ApiError('Retailer parameter is required', 400);
  }
  
  // Normalize the retailer value by trimming and converting to lowercase
  const normalizedRetailer = retailer.toLowerCase().trim();
  
  // Validate against allowed values
  if (normalizedRetailer !== 'myntra' && normalizedRetailer !== 'h&m') {
    throw new ApiError(`Invalid retailer specified: ${retailer}`, 400, { 
      providedValue: retailer,
      allowedValues: ['Myntra', 'H&M'] 
    });
  }

  // Define common order confirmation keywords
  const orderConfirmationKeywords = [
    'order confirmation',
    'order confirmed',
    'order placed',
    'thank you for your order',
    'your order',
    'order number',
    'order receipt',
    'purchase confirmation',
    'receipt'
  ];
  
  // Create a combined query string with OR conditions for order confirmation keywords
  const confirmationKeywordQuery = orderConfirmationKeywords
    .map(keyword => `subject:(${keyword})`)
    .join(' OR ');

  // Build retailer-specific search query combined with confirmation keywords
  const searchQuery = normalizedRetailer === 'myntra'
    ? `(from:myntra.com OR from:donotreply@myntra.com OR from:orders@myntra.com) AND (${confirmationKeywordQuery})`
    : `(from:hm.com OR from:delivery.hm.com OR from:orders.hm.com OR from:mailer.hm.com) AND (${confirmationKeywordQuery})`;

  try {
    const emailsResponse = await GmailService.listEmails(session.user.id, {
      q: searchQuery,
      maxResults: 10,
    });

    log('Fetched emails', {
      count: emailsResponse.messages.length,
      retailer,
      userId: session.user.id
    });

    // Return the messages directly in a flattened structure
    return NextResponse.json({ messages: emailsResponse.messages });
  } catch (error) {
    log('Error fetching emails', { error, retailer, userId: session.user.id });
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Failed to fetch emails from Gmail', 500, { 
      originalError: error instanceof Error ? error.message : 'Unknown error',
      retailer 
    });
  }
}

export const GET = withErrorHandler(fetchEmailsHandler); 