import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { log } from '@/lib/logger';
import { extractItemsFromEmail, ExtractedWardrobeItem } from '@/lib/email-item-extractor';
import { addItemsToWardrobe } from '@/lib/wardrobe-integration';
import { listEmails, getEmailById } from '@/lib/gmail-service';

/**
 * API endpoint to extract items from emails and add them to the wardrobe
 * 
 * POST /api/wardrobe/add-from-emails
 * 
 * Body: {
 *  emailIds?: string[],  // Specific email IDs to process
 *  retailer?: string,    // If not providing emailIds, specify retailer to fetch emails from
 *  maxEmails?: number,   // Maximum number of emails to process
 * }
 */
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  log('POST /api/wardrobe/add-from-emails - Session', { userId: session?.user?.id });
  
  if (!session?.user?.id) {
    log('POST /api/wardrobe/add-from-emails - Unauthorized: No user ID in session');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const userId = session.user.id;
    const body = await request.json();
    const { emailIds, retailer, maxEmails = 10 } = body;
    
    log('POST /api/wardrobe/add-from-emails - Processing request', { 
      userId, 
      emailIdsCount: emailIds?.length, 
      retailer, 
      maxEmails 
    });
    
    // Array to store all the emails we're going to process
    let emailsToProcess: any[] = [];
    
    // If specific email IDs are provided
    if (emailIds && emailIds.length > 0) {
      log('POST /api/wardrobe/add-from-emails - Processing specific email IDs', { 
        userId, 
        emailIds 
      });
      
      // Fetch each email by ID
      for (const emailId of emailIds) {
        const email = await getEmailById(userId, emailId);
        if (email) {
          emailsToProcess.push({ email, retailer: retailer || 'unknown' });
        }
      }
    } 
    // Otherwise fetch emails based on retailer
    else if (retailer) {
      log('POST /api/wardrobe/add-from-emails - Fetching emails by retailer', { 
        userId, 
        retailer, 
        maxEmails 
      });
      
      // Build search query for order confirmations from this retailer
      const options = {
        maxResults: maxEmails,
        q: createOrderConfirmationQuery(retailer),
      };
      
      // Fetch emails
      const { messages } = await listEmails(userId, options);
      emailsToProcess = messages.map(email => ({ email, retailer }));
    } else {
      // Neither emailIds nor retailer provided
      log('POST /api/wardrobe/add-from-emails - Invalid request: No emailIds or retailer provided', { userId });
      return NextResponse.json(
        { error: 'You must provide either emailIds or retailer' },
        { status: 400 }
      );
    }
    
    log('POST /api/wardrobe/add-from-emails - Found emails to process', { 
      userId, 
      emailCount: emailsToProcess.length 
    });
    
    // If no emails found
    if (emailsToProcess.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No emails found to process',
        results: {
          totalEmails: 0,
          totalItemsFound: 0,
          addedItems: 0,
          duplicatesSkipped: 0
        }
      });
    }
    
    // Process each email and extract items
    let allExtractedItems: ExtractedWardrobeItem[] = [];
    
    for (const { email, retailer } of emailsToProcess) {
      const items = await extractItemsFromEmail(email, retailer);
      allExtractedItems = [...allExtractedItems, ...items];
    }
    
    log('POST /api/wardrobe/add-from-emails - Extracted items', { 
      userId, 
      extractedItemCount: allExtractedItems.length 
    });
    
    // Add items to wardrobe with deduplication
    const wardrobeResult = await addItemsToWardrobe(userId, allExtractedItems);
    
    // Return results
    return NextResponse.json({
      success: true,
      results: {
        totalEmails: emailsToProcess.length,
        totalItemsFound: allExtractedItems.length,
        addedItems: wardrobeResult.addedItems,
        duplicatesSkipped: wardrobeResult.duplicatesSkipped
      }
    });
  } catch (error) {
    log('Error processing emails for wardrobe', { error });
    return NextResponse.json(
      { 
        error: 'Failed to process emails',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * Create a Gmail search query for order confirmation emails from a specific retailer
 */
function createOrderConfirmationQuery(retailer: string): string {
  // Base search for confirmation emails
  const confirmationKeywords = [
    'order confirmation',
    'order placed',
    'order received',
    'thank you for your order',
    'purchase confirmation',
    'order details',
    'order summary',
    'payment successful',
    'payment received',
    'receipt',
    'invoice'
  ];
  
  // Retailer-specific search parameters
  let retailerQuery = '';
  
  switch (retailer.toLowerCase()) {
    case 'myntra':
      retailerQuery = '(from:myntra.com OR from:orders@myntra.com OR from:noreply@myntra.com OR from:info@myntra.com)';
      break;
    case 'h&m':
    case 'h & m':
    case 'hm':
      retailerQuery = '(from:hm.com OR from:orders@hm.com OR from:noreply@hm.com OR from:service@hm.com)';
      break;
    case 'zara':
      retailerQuery = '(from:zara.com OR from:notices@zara.com OR from:info@zara.com OR from:orders@zara.com OR from:noreply@zara.com)';
      break;
    default:
      retailerQuery = `from:${retailer}`;
  }
  
  // Combine retailer query with confirmation keywords
  const keywordPart = confirmationKeywords.map(kw => `"${kw}"`).join(' OR ');
  
  return `${retailerQuery} (${keywordPart})`;
} 