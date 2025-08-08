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
  const normalizedRetailer = retailer.toLowerCase();
  
  // Validate against allowed values
  if (normalizedRetailer !== 'myntra' && normalizedRetailer !== 'h&m' && normalizedRetailer !== 'hm' && normalizedRetailer !== 'zara') {
    throw new ApiError(`Invalid retailer specified: ${retailer}`, 400, { 
      providedValue: retailer,
      allowedValues: ['Myntra', 'H&M', 'Zara'] 
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

  // Primary: retailer sender + specific subject heuristics
  const primaryQuery = normalizedRetailer === 'myntra'
    ? `from:myntra.com subject:"Your Myntra order item has been shipped"`
    : normalizedRetailer === 'h&m' || normalizedRetailer === 'hm'
    ? `from:delivery.hm.com subject:"Order Confirmation"`
    : normalizedRetailer === 'zara'
    ? `from:noreply@zara.com subject:"Thank you for your purchase"`
    : `from:${retailer} AND (${confirmationKeywordQuery})`;

  // Forward-friendly: brand tokens + order keywords + Fwd/FW, search anywhere
  const brandTokens = normalizedRetailer === 'myntra'
    ? '(myntra OR myntra.com)'
    : (normalizedRetailer === 'h&m' || normalizedRetailer === 'hm')
    ? '("H&M" OR hm.com OR www2.hm.com OR delivery.hm.com)'
    : normalizedRetailer === 'zara'
    ? '(zara OR zara.com)'
    : `(${retailer})`;
  // Require brand tokens together with order keywords or Fwd markers
  const forwardQuery = `in:anywhere ((${brandTokens}) AND ((${confirmationKeywordQuery}) OR subject:(FW OR Fwd OR FWD)))`;

  try {
    // Query both in parallel and merge
    const [primaryRes, forwardRes] = await Promise.all([
      GmailService.listEmails(session.user.id, { q: primaryQuery, maxResults: 15 }),
      GmailService.listEmails(session.user.id, { q: forwardQuery, maxResults: 15, includeSpamTrash: true }),
    ]);

    const all = [...(primaryRes.messages || []), ...(forwardRes.messages || [])];

    // De-duplicate by id
    const dedupMap = new Map<string, typeof all[number]>();
    for (const m of all) {
      if (m && m.id && !dedupMap.has(m.id)) dedupMap.set(m.id, m);
    }
    const deduped = Array.from(dedupMap.values());

    // Sort by date desc (fallback to internalDate if needed)
    deduped.sort((a, b) => {
      const ad = a.date ? a.date.getTime() : (a.internalDate ? parseInt(a.internalDate) : 0);
      const bd = b.date ? b.date.getTime() : (b.internalDate ? parseInt(b.internalDate) : 0);
      return bd - ad;
    });

    // Cap results
    const limited = deduped.slice(0, 10);

    log('Fetched emails (merged primary + forward)', {
      retailer,
      primaryCount: primaryRes.messages.length,
      forwardCount: forwardRes.messages.length,
      combinedCount: limited.length,
      userId: session.user.id,
    });

    return NextResponse.json({ messages: limited });
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