import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { log } from '@/lib/logger';
import * as GmailService from '@/lib/gmail-service';
import * as EmailProcessor from '@/lib/email-processor';
import { 
  withErrorHandler, 
  throwUnauthorized, 
  validateOrThrow, 
  ApiError 
} from '@/lib/api-error-handler';
import { withRetry, MAX_RETRIES } from '@/lib/retry-utils';
import { EmailSearchOptions } from '@/types/gmail';
import { addOrderItemsToWardrobe, updateEmailProcessingHistory } from '@/lib/wardrobe-utils';

// Configure for Node.js runtime (needed for Gmail API)
export const runtime = 'nodejs';

export interface ProcessedOrder {
  id: string;
  orderId: string;
  orderDate?: Date;
  totalAmount?: number;
  currency?: string;
  retailer: string;
  items: any[];
  status: string;
  emailId: string;
  emailDate?: Date;
  processed: boolean;
  error?: string;
  retryAttempts?: number;
  wardrobeItemsAdded?: string[]; // Track IDs of items added to wardrobe
  emailSubject?: string;
  emailFrom?: string;
  emailSnippet?: string;
}

/**
 * Process Myntra emails handler implementation
 */
async function processMyntraEmailsHandler(request: NextRequest) {
  // Get the current user session
  const session = await getServerSession(authOptions);
  
  // Verify user is authenticated
  if (!session?.user?.id) {
    throwUnauthorized('User must be logged in to process emails');
  }

  // Parse request body
  const body = await request.json().catch(() => ({}));
  const { 
    max = 10, 
    onlyUnread = true, 
    markAsRead = true, 
    daysBack = 30,
    includeEmailDetails = false  // New parameter for debugging
  } = body;

  // Check if Gmail is connected
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      gmailConnected: true,
      gmailAccessToken: true,
      gmailRefreshToken: true,
      gmailTokenExpiry: true,
    },
  });

  validateOrThrow(
    !!user && user.gmailConnected && !!user.gmailAccessToken,
    'Gmail not connected',
    400,
    { gmailConnected: false }
  );

  // Calculate the date to search from
  const searchFromDate = new Date();
  searchFromDate.setDate(searchFromDate.getDate() - daysBack);

  log('Fetching Myntra emails', {
    userId: session.user.id,
    max,
    onlyUnread,
    daysBack,
    searchFromDate,
    includeEmailDetails
  });

  // Get emails with retry for transient failures
  const { messages: emails } = await withRetry(
    async () => {
      // Prepare forward-friendly search query for Myntra, H&M, and Zara emails
      const orderKeywords = 'subject:("order confirmation" OR "order confirmed" OR "your order" OR receipt)';
      const brandTokens = '(myntra OR myntra.com OR "H&M" OR hm.com OR www2.hm.com OR delivery.hm.com OR zara OR zara.com)';
      const fwdTokens = 'subject:(FW OR Fwd OR FWD)';

      const searchOptions: EmailSearchOptions = {
        maxResults: max,
        afterDate: searchFromDate,
        q: `(((${brandTokens}) AND ((${orderKeywords}) OR ${fwdTokens})) OR from:myntra.com OR from:hm.com OR from:delivery.hm.com OR from:zara.com)`,
        onlyUnread: onlyUnread,
        includeSpamTrash: true,
      };
      
      // List emails matching the search criteria
      return await GmailService.listEmails(
        session.user.id,
        searchOptions
      );
    },
    {
      maxRetries: MAX_RETRIES,
      context: { 
        operation: 'listEmails',
        userId: session.user.id,
        maxResults: max
      }
    }
  );

  log('Found emails', { count: emails.length });

  // Add logic to filter and process H&M emails
  const isHMEmail = (email: { from?: string; subject?: string; }) => {
    const from = email.from || '';
    const subject = email.subject || '';
    return from.includes('hm.com') || subject.includes('H&M');
  };
  
  // Add logic to filter and process Zara emails
  const isZaraEmail = (email: { from?: string; subject?: string; }) => {
    const from = email.from || '';
    const subject = email.subject || '';
    return from.includes('zara.com') || subject.includes('Zara');
  };

  // Filter for Myntra, H&M, and Zara emails
  const filteredEmails = emails.filter(email => 
    EmailProcessor.isMyntraEmail(email) || 
    isHMEmail(email) || 
    isZaraEmail(email)
  );
  log('Filtered emails', { count: filteredEmails.length });

  // Process each email
  const processedOrders: ProcessedOrder[] = [];
  let totalItemsAddedToWardrobe = 0;
  
  for (const email of filteredEmails) {
    try {
      // Add retry context for this specific email
      const emailContext = {
        emailId: email.id,
        subject: email.subject,
        date: email.date?.toISOString(),
        userId: session.user.id
      };

      // Check if email is already processed
      const existingOrder = await prisma.order.findFirst({
        where: {
          userId: session.user.id,
          emailId: email.id,
        },
        select: { id: true },
      });

      if (existingOrder) {
        log('Email already processed, skipping', emailContext);
        continue;
      }

      // Process email into products and add to wardrobe
      const { products, addedWardrobeItems } = await EmailProcessor.processEmail(email, {
        userId: session.user.id,
        includeEmailDetails,
      });

      // Determine which retailer this email is from
      if (EmailProcessor.isMyntraEmail(email)) {
        // Process Myntra email
        // ... existing code ...
      } else if (isHMEmail(email)) {
        // Process H&M email
        // ... existing code ...
      } else if (isZaraEmail(email)) {
        // Log that we're processing a Zara email
        log('Processing Zara email', { emailId: email.id });
        // You can add specific processing logic similar to Myntra here
      }

      // Process the email with retry for transient failures
      let retryAttempts = 0;
      const orderInfo = await withRetry(
        async () => {
          // Process the email with retry mechanisms built into the processing function
          const result = await EmailProcessor.processMyntraEmail(email);
          if (!result || !result.orderId) {
            throw new Error('Failed to extract order information from email');
          }
          return result;
        },
        {
          maxRetries: MAX_RETRIES,
          context: emailContext,
          onRetry: (error, attempt) => {
            retryAttempts = attempt;
            log('Retrying email processing', { 
              attempt, 
              emailId: email.id,
              error: error instanceof Error ? error.message : 'Unknown error'
            });
          }
        }
      ).catch(error => {
        log('Failed to process email after retries', {
          error: error instanceof Error ? error.message : 'Unknown error',
          emailId: email.id,
          maxRetries: MAX_RETRIES,
          retryAttempts
        });
        return null;
      });
      
      if (orderInfo) {
        log('Processed Myntra order', {
          orderId: orderInfo.orderId,
          items: orderInfo.items.length,
          retryAttempts: retryAttempts
        });

        // Save order to database
        const order = await prisma.order.create({
          data: {
            userId: session.user.id,
            orderId: orderInfo.orderId,
            orderDate: orderInfo.orderDate,
            totalAmount: orderInfo.totalAmount,
            currency: orderInfo.currency,
            retailer: 'Myntra',
            paymentMethod: orderInfo.paymentMethod,
            shippingAddress: orderInfo.shippingAddress,
            status: orderInfo.orderStatus || 'Confirmed',
            emailId: email.id,
            items: orderInfo.items as any,
            trackingNumber: orderInfo.trackingNumber,
            trackingUrl: orderInfo.trackingUrl,
          },
        });

        // Add items to wardrobe using our utility function
        const wardrobeItemIds = await addOrderItemsToWardrobe(
          session.user.id,
          order.orderId,
          orderInfo.items
        );
        
        totalItemsAddedToWardrobe += wardrobeItemIds.length;

        // Update email processing history
        await updateEmailProcessingHistory(
          session.user.id,
          email.id,
          email.subject || '',
          wardrobeItemIds.length
        );

        const orderData: ProcessedOrder = {
          id: order.id,
          orderId: order.orderId,
          orderDate: order.orderDate || undefined,
          totalAmount: order.totalAmount || undefined,
          currency: order.currency || undefined,
          retailer: order.retailer,
          items: order.items as any[],
          status: order.status,
          emailId: email.id,
          emailDate: email.date,
          processed: true,
          retryAttempts: retryAttempts > 0 ? retryAttempts : undefined,
          wardrobeItemsAdded: wardrobeItemIds
        };
        
        // Add email details if requested
        if (includeEmailDetails) {
          orderData.emailSubject = email.subject;
          orderData.emailFrom = email.from;
          orderData.emailSnippet = email.snippet;
        }
        
        processedOrders.push(orderData);

        // Mark email as read if requested
        if (markAsRead) {
          await withRetry(
            async () => {
              await GmailService.markEmailAsRead(session.user.id, email.id);
              log('Marked email as read', { emailId: email.id });
            },
            {
              maxRetries: 2, // Fewer retries for marking as read
              context: {
                operation: 'markEmailAsRead',
                emailId: email.id,
                userId: session.user.id
              }
            }
          ).catch(error => {
            log('Failed to mark email as read after retries', {
              error: error instanceof Error ? error.message : 'Unknown error',
              emailId: email.id
            });
          });
        }
      } else {
        log('Failed to process Myntra email', { 
          emailId: email.id,
          retryAttempts
        });
        
        const failedOrderData: ProcessedOrder = {
          id: '',
          orderId: '',
          retailer: 'Myntra',
          items: [],
          status: 'Unknown',
          emailId: email.id,
          emailDate: email.date,
          processed: false,
          error: 'Failed to extract order information',
          retryAttempts: retryAttempts > 0 ? retryAttempts : undefined
        };
        
        // Add email details if requested
        if (includeEmailDetails) {
          failedOrderData.emailSubject = email.subject;
          failedOrderData.emailFrom = email.from;
          failedOrderData.emailSnippet = email.snippet;
        }
        
        processedOrders.push(failedOrderData);
      }
    } catch (emailError) {
      log('Error processing email', { emailId: email.id, error: emailError });
      
      const errorOrderData: ProcessedOrder = {
        id: '',
        orderId: '',
        retailer: 'Myntra',
        items: [],
        status: 'Unknown',
        emailId: email.id,
        emailDate: email.date,
        processed: false,
        error: `Error: ${emailError instanceof Error ? emailError.message : String(emailError)}`
      };
      
      // Add email details if requested
      if (includeEmailDetails && email) {
        errorOrderData.emailSubject = email.subject;
        errorOrderData.emailFrom = email.from;
        errorOrderData.emailSnippet = email.snippet;
      }
      
      processedOrders.push(errorOrderData);
    }
  }

  // Update last synced timestamp
  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      gmailLastSynced: new Date(),
    },
  });

  return NextResponse.json({
    success: true,
    message: `Processed ${processedOrders.length} Myntra emails`,
    stats: {
      totalEmails: emails.length,
      myntraEmails: filteredEmails.length,
      processedOrders: processedOrders.length,
      successfullyProcessed: processedOrders.filter(o => o.processed).length,
      failedToProcess: processedOrders.filter(o => !o.processed).length,
      ordersWithRetries: processedOrders.filter(o => o.retryAttempts && o.retryAttempts > 0).length,
      itemsAddedToWardrobe: totalItemsAddedToWardrobe
    },
    orders: processedOrders,
  });
}

/**
 * POST /api/gmail/process-myntra-emails - Process Myntra emails from Gmail
 * 
 * Query parameters:
 * - max: Maximum number of emails to process (default: 10)
 * - onlyUnread: Only process unread emails (default: true)
 * - markAsRead: Mark processed emails as read (default: true)
 * - daysBack: Number of days back to look for emails (default: 30)
 * - includeEmailDetails: Include email details in the response (default: false)
 */
export const POST = withErrorHandler(processMyntraEmailsHandler); 