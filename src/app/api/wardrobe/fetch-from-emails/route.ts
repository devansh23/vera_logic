import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { log } from '@/lib/logger';
import { getEmailById, listEmails } from '@/lib/gmail-service';
import { extractItemsFromHtml } from '../add-from-emails-html/route';
import { categorizeItem } from '@/lib/categorize-items';
import { ExtractedItem } from '@/types/email-extraction';
import { processItemImage, fetchImageAsBuffer } from '@/lib/image-utils';
import { getColorInfo } from '@/lib/color-utils';
import fetch from 'node-fetch';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Add type for email query creation
const createOrderConfirmationQuery = (retailer: string): string => {
  return `from:(${retailer}) subject:(order confirmation OR order placed OR order details)`;
};

/**
 * API endpoint to extract items from emails without adding them to the wardrobe
 * 
 * POST /api/wardrobe/fetch-from-emails
 * 
 * Body: {
 *  emailId?: string,    // Specific email ID to process
 *  emailIds?: string[], // Multiple specific email IDs to process
 *  retailer?: string,   // If not providing emailId, specify retailer to fetch emails from
 *  maxEmails?: number,  // Maximum number of emails to process when using retailer
 * }
 */
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  log('POST /api/wardrobe/fetch-from-emails - Session', { userId: session?.user?.id });
  
  if (!session?.user?.id) {
    log('POST /api/wardrobe/fetch-from-emails - Unauthorized: No user ID in session');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const userId = session.user.id;
    const body = await request.json();
    const { emailId, emailIds, retailer, maxEmails = 10 } = body;
    
    // Handle single email case
    if (emailId) {
      log('POST /api/wardrobe/fetch-from-emails - Processing single email', { emailId, retailer });
      return await processSingleEmail(userId, emailId, retailer || 'unknown');
    }
    
    // Handle multiple specific emails case
    if (emailIds && emailIds.length > 0) {
      log('POST /api/wardrobe/fetch-from-emails - Processing multiple specific emails', { 
        emailIdsCount: emailIds.length,
        retailer
      });
      
      const allItems = [];
      
      for (const id of emailIds) {
        const response = await processSingleEmail(userId, id, retailer || 'unknown');
        const data = await response.json();
        
        if (data.items && data.items.length > 0) {
          allItems.push(...data.items);
        }
      }
      
      return NextResponse.json({
        success: allItems.length > 0,
        message: `${allItems.length} items found in ${emailIds.length} emails`,
        totalItemsFound: allItems.length,
        items: allItems
      });
    }
    
    // Handle retailer-based fetching
    if (retailer) {
      log('POST /api/wardrobe/fetch-from-emails - Processing emails for retailer', { retailer, maxEmails });
      return await processMultipleEmails(userId, retailer, maxEmails);
    }
    
    // If we got here, no valid parameters were provided
    log('POST /api/wardrobe/fetch-from-emails - Invalid request: No emailId, emailIds or retailer provided');
    return NextResponse.json(
      { error: 'You must provide either emailId, emailIds or retailer' },
      { status: 400 }
    );
  } catch (error) {
    log('Error processing emails', { error });
    return NextResponse.json(
      { 
        error: 'Failed to process emails',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

async function processSingleEmail(userId: string, emailId: string, retailer: string) {
  try {
    // Fetch the email HTML content
    const email = await getEmailById(userId, emailId);
    
    if (!email || !email.body?.html) {
      log('Failed to fetch email content or no HTML content', { emailId });
      return NextResponse.json({
        success: false,
        message: 'Failed to fetch email content or no HTML content',
        totalItemsFound: 0,
        items: []
      }, { status: 400 });
    }
    
    log('Processing email HTML content', { emailId, htmlLength: email.body.html.length });
    
    // Extract items from the HTML content
    const items = await extractItemsFromHtml(email.body.html, retailer);
    
    if (items.length === 0) {
      log('No items detected in the email', { emailId });
      return NextResponse.json({
        success: false,
        message: '0 items detected in the email',
        totalItemsFound: 0,
        items: []
      });
    }
    
    // Process each item with categorization and image processing
    const processedItems = await Promise.all(items.map(async (item, index) => {
      // Determine category for the item
      const category = categorizeItem({
        name: item.name,
        brand: item.brand || 'Unknown Brand',
        color: item.color || '',
        sourceRetailer: retailer
      });

      // Process image if available
      let processedImage = item.image;
      let imageBuffer = null;
      if (item.image) {
        try {
          imageBuffer = await fetchImageAsBuffer(item.image);
          if (imageBuffer) {
            const processedImageBuffer = await processItemImage(imageBuffer, item.name);
            processedImage = `data:image/jpeg;base64,${processedImageBuffer.toString('base64')}`;
          }
        } catch (error) {
          log('Image processing failed', { error, itemName: item.name });
          // Keep original image on failure
        }
      }

      // Get color information
      const { dominantColor, colorTag } = await getColorInfo({
        rawColor: item.color,
        imageBuffer,
      });

      return {
        ...item,
        id: `${Date.now()}-${index}-${Math.random().toString(36).substring(2, 7)}`,
        category,
        image: processedImage,
        imageUrl: processedImage, // Set both image and imageUrl for consistency
        emailId,
        retailer,
        dominantColor,
        colorTag
      };
    }));
    
    log('Items processed with categories and images', { count: processedItems.length, emailId });
    
    return NextResponse.json({
      success: processedItems.length > 0,
      message: `${processedItems.length} items found in email`,
      items: processedItems
    });
  } catch (error) {
    log('Error processing HTML content', { error, emailId });
    return NextResponse.json({
      error: 'Failed to process email HTML content',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

async function processMultipleEmails(userId: string, retailer: string, maxEmails: number) {
  log('Processing multiple emails', { retailer, maxEmails });
  
  try {
    // Build search query for order confirmations with retailer-specific patterns
    const searchQuery = retailer.toLowerCase() === 'myntra'
      ? `from:myntra.com subject:"Your Myntra order item has been shipped"`
      : retailer.toLowerCase() === 'zara'
      ? `from:noreply@zara.com subject:"Thank you for your purchase"`
      : retailer.toLowerCase() === 'h&m'
      ? `from:delivery.hm.com subject:"Order Confirmation"`
      : createOrderConfirmationQuery(retailer);
    
    log('Using email search query', { retailer, searchQuery });
    
    const options = {
      maxResults: maxEmails,
      q: searchQuery,
    };
    
    // Get the list of emails matching the query
    const emailsResponse = await listEmails(userId, options);
    
    if (!emailsResponse.messages || emailsResponse.messages.length === 0) {
      // If no emails found for Zara with specific query, try a more general query
      if (retailer.toLowerCase() === 'zara') {
        log('No emails found with specific Zara query, trying broader query', { retailer });
        
        // Try a more general query for Zara emails
        const broadOptions = {
          maxResults: maxEmails,
          q: `from:zara.com OR from:noreply@zara.com`
        };
        
        const broadResponse = await listEmails(userId, broadOptions);
        
        if (broadResponse.messages && broadResponse.messages.length > 0) {
          log('Found Zara emails with broader query', { count: broadResponse.messages.length });
          return processEmailsResponse(userId, retailer, broadResponse);
        }
      }
      
      log('No emails found for retailer', { retailer });
      return NextResponse.json({
        success: false,
        message: `No order confirmation emails found for ${retailer}`,
        totalItemsFound: 0,
        items: []
      });
    }
    
    log('Found emails for processing', { count: emailsResponse.messages.length, retailer });
    
    return processEmailsResponse(userId, retailer, emailsResponse);
  } catch (error) {
    log('Error processing multiple emails', { error });
    return NextResponse.json({
      error: 'Failed to process emails',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

// Helper function to process email response and extract items
async function processEmailsResponse(
  userId: string, 
  retailer: string, 
  emailsResponse: any
) {
  // Variables to track processing state
  let totalItemsFound = 0;
  const allItems = [];
  const errors = [];
  
  // Process each email and extract items
  for (const emailMessage of emailsResponse.messages) {
    try {
      const email = await getEmailById(userId, emailMessage.id);
      
      if (!email?.body?.html) {
        errors.push({ emailId: emailMessage.id, error: 'No HTML content found' });
        continue;
      }
      
      const items = await extractItemsFromHtml(email.body.html, retailer);
      totalItemsFound += items.length;
      
      if (items.length > 0) {
        // Process items with categorization and image processing
        const processedItems = await Promise.all(items.map(async (item, index) => {
          // Determine category for the item
          const category = categorizeItem({
            name: item.name,
            brand: item.brand || 'Unknown Brand',
            color: item.color || '',
            sourceRetailer: retailer
          });

          // Process image if available
          let processedImage = item.image;
          let imageBuffer = null;
          if (item.image) {
            try {
              imageBuffer = await fetchImageAsBuffer(item.image);
              if (imageBuffer) {
                const processedImageBuffer = await processItemImage(imageBuffer, item.name);
                processedImage = `data:image/jpeg;base64,${processedImageBuffer.toString('base64')}`;
              }
            } catch (error) {
              log('Image processing failed', { error, itemName: item.name });
              // Keep original image on failure
            }
          }

          // Get color information
          const { dominantColor, colorTag } = await getColorInfo({
            rawColor: item.color,
            imageBuffer,
          });

          return {
            ...item,
            id: `${Date.now()}-${index}-${Math.random().toString(36).substring(2, 7)}`,
            category,
            image: processedImage,
            imageUrl: processedImage, // Set both image and imageUrl for consistency
            emailId: emailMessage.id,
            retailer,
            dominantColor,
            colorTag
          };
        }));
        
        allItems.push(...processedItems);
      }
    } catch (error) {
      log('Error processing email', { error, emailId: emailMessage.id });
      errors.push({ 
        emailId: emailMessage.id, 
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }
  
  return NextResponse.json({
    success: totalItemsFound > 0,
    message: `${totalItemsFound} items found in ${emailsResponse.messages.length} emails`,
    totalItemsFound,
    items: allItems,
    processedEmails: emailsResponse.messages.length,
    errors: errors.length > 0 ? errors : undefined
  });
} 