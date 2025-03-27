import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { log } from '@/lib/logger';
import * as GmailService from '@/lib/gmail-service';
import { extractItemsFromEmailScreenshot } from '@/lib/email-screenshot-extractor';
import { withErrorHandler, throwUnauthorized, ApiError } from '@/lib/api-error-handler';
import { EmailMessage } from '@/types/gmail';

export const runtime = 'nodejs';

interface RequestBody {
  emailIds?: string[];
  retailer?: string;
  maxEmails?: number;
}

async function validateRetailer(retailer: string): Promise<string> {
  // Normalize the retailer value
  const normalizedRetailer = retailer.toLowerCase().trim();
  
  // Validate against allowed values
  if (normalizedRetailer !== 'myntra' && normalizedRetailer !== 'h&m') {
    throw new ApiError(`Invalid retailer specified: ${retailer}`, 400, { 
      providedValue: retailer,
      allowedValues: ['Myntra', 'H&M'] 
    });
  }
  
  return retailer;
}

async function addItemsToWardrobeHandler(request: NextRequest) {
  // Check user authentication
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throwUnauthorized('User must be logged in to add items to wardrobe');
  }
  
  const userId = session.user.id;
  
  // Parse request body
  const body: RequestBody = await request.json();
  
  // Validate request parameters
  if (!body.emailIds && !body.retailer) {
    throw new ApiError('Either emailIds or retailer must be provided', 400);
  }
  
  // Set a default for maxEmails if not specified and using retailer option
  const maxEmails = body.maxEmails || 5;
  
  try {
    let emails: EmailMessage[] = [];
    
    // Fetch emails based on provided parameters
    if (body.emailIds && body.emailIds.length > 0) {
      // Fetch specific emails by IDs
      log('Fetching specific emails by IDs', { 
        emailCount: body.emailIds.length,
        userId 
      });
      
      emails = await Promise.all(
        body.emailIds.map(async (emailId) => {
          const email = await GmailService.getEmailById(userId, emailId);
          return email || null;
        })
      ).then(results => results.filter(Boolean) as EmailMessage[]);
      
    } else if (body.retailer) {
      // Validate retailer
      const retailer = await validateRetailer(body.retailer);
      
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
      const searchQuery = retailer.toLowerCase() === 'myntra'
        ? `(from:myntra.com OR from:donotreply@myntra.com OR from:orders@myntra.com) AND (${confirmationKeywordQuery})`
        : retailer.toLowerCase() === 'h&m' || retailer.toLowerCase() === 'hm'
        ? `(from:hm.com OR from:delivery.hm.com OR from:orders.hm.com OR from:mailer.hm.com) AND (${confirmationKeywordQuery})`
        : retailer.toLowerCase() === 'zara'
        ? `(from:zara.com OR from:notices@zara.com OR from:info@zara.com OR from:orders@zara.com OR from:noreply@zara.com) AND (${confirmationKeywordQuery})`
        : `from:${retailer} AND (${confirmationKeywordQuery})`;

      // Fetch emails matching the retailer and confirmation keywords
      log('Fetching emails by retailer query', { retailer, userId });
      
      const emailsResponse = await GmailService.listEmails(userId, {
        q: searchQuery,
        maxResults: maxEmails,
      });
      
      // Convert to EmailMessage type and filter out any null values
      emails = (emailsResponse.messages as unknown as EmailMessage[]).filter(email => email !== null);
    }
    
    if (emails.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No matching emails found'
      });
    }
    
    // Process each email to extract items using the screenshot method
    log('Processing emails with screenshot method', { 
      emailCount: emails.length,
      userId 
    });
    
    let totalItemsFound = 0;
    let addedItems = 0;
    let duplicatesSkipped = 0;
    
    for (const email of emails) {
      try {
        const retailer = body.retailer || 
          (email.from && email.from.includes('myntra') ? 'Myntra' : 
           email.from && email.from.includes('hm.com') ? 'H&M' : 'Unknown');
           
        // Skip if retailer is unknown
        if (retailer === 'Unknown') {
          log('Skipping email with unknown retailer', { emailId: email.id });
          continue;
        }
        
        // Extract items using screenshot method
        const extractedItems = await extractItemsFromEmailScreenshot(email, retailer);
        
        if (extractedItems.length === 0) {
          log('No items found in email', { emailId: email.id, retailer });
          continue;
        }
        
        totalItemsFound += extractedItems.length;
        
        // Add extracted items to wardrobe with deduplication
        for (const item of extractedItems) {
          // Check if this item already exists in the wardrobe
          const existingItems = await prisma.wardrobe.findMany({
            where: {
              userId,
              OR: [
                // Same email source
                {
                  sourceEmailId: email.id,
                  sourceOrderId: item.sourceOrderId
                },
                // Similar item with same brand and name
                { 
                  brand: item.brand,
                  name: {
                    contains: item.name,
                    mode: 'insensitive'
                  }
                },
                // Has image and matches image (if image exists)
                item.image ? {
                  image: item.image
                } : {}
              ]
            }
          });
          
          if (existingItems.length > 0) {
            log('Item already exists in wardrobe', { 
              brand: item.brand, 
              name: item.name 
            });
            duplicatesSkipped++;
            continue;
          }
          
          // Add the item to wardrobe
          await prisma.wardrobe.create({
            data: {
              userId,
              brand: item.brand,
              name: item.name,
              price: item.price || '',
              originalPrice: item.originalPrice,
              discount: item.discount,
              image: item.image,
              productLink: item.productLink,
              myntraLink: item.myntraLink,
              size: item.size,
              color: item.color,
              source: 'email-screenshot',
              sourceEmailId: email.id,
              sourceOrderId: item.sourceOrderId,
              sourceRetailer: retailer
            }
          });
          
          addedItems++;
        }
      } catch (error) {
        log('Error processing email', { 
          error, 
          emailId: email.id 
        });
        // Continue with next email
      }
    }
    
    // Return results
    return NextResponse.json({
      success: true,
      message: `Successfully processed ${emails.length} emails`,
      results: {
        totalEmails: emails.length,
        totalItemsFound,
        addedItems,
        duplicatesSkipped
      }
    });
    
  } catch (error) {
    log('Error adding items to wardrobe', { error });
    throw error;
  }
}

export const POST = withErrorHandler(addItemsToWardrobeHandler); 