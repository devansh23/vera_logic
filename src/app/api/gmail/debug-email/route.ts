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

// Configure for Node.js runtime (needed for Gmail API)
export const runtime = 'nodejs';

/**
 * Debug email handler implementation
 * Fetches an email by ID and returns its content along with the processing result
 */
async function debugEmailHandler(request: NextRequest) {
  // Get the current user session
  const session = await getServerSession(authOptions);
  
  // Verify user is authenticated
  if (!session?.user?.id) {
    throwUnauthorized('User must be logged in to debug emails');
  }

  // Get email ID from query params
  const searchParams = request.nextUrl.searchParams;
  const emailId = searchParams.get('emailId');

  if (!emailId) {
    throw new ApiError('Email ID is required', 400);
  }

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

  try {
    // Get the email by ID
    const email = await GmailService.getEmailById(session.user.id, emailId);
    
    if (!email) {
      throw new ApiError('Email not found', 404);
    }
    
    // Try to process the email
    let processingResult = null;
    let processingError = null;
    
    try {
      processingResult = await EmailProcessor.processMyntraEmail(email);
    } catch (error) {
      log('Error processing email during debug', {
        emailId,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      processingError = error instanceof Error ? error.message : 'Unknown processing error';
    }
    
    // Create a sanitized version of the email for the response
    // (to avoid sending unnecessary or sensitive data)
    const sanitizedEmail = {
      id: email.id,
      threadId: email.threadId,
      from: email.from,
      to: email.to,
      subject: email.subject,
      date: email.date,
      snippet: email.snippet,
      body: {
        text: email.body?.text,
        html: email.body?.html,
      },
    };
    
    return NextResponse.json({
      email: sanitizedEmail,
      processingResult,
      processingError,
      isMyntraEmail: EmailProcessor.isMyntraEmail(email),
      isOrderConfirmation: EmailProcessor.isMyntraOrderConfirmation(email),
      isShippingConfirmation: EmailProcessor.isMyntraShippingConfirmation(email),
      isDeliveryConfirmation: EmailProcessor.isMyntraDeliveryConfirmation(email),
    });
  } catch (error) {
    log('Error in debug email endpoint', {
      error: error instanceof Error ? error.message : 'Unknown error',
      emailId,
      userId: session.user.id
    });
    
    if (error instanceof ApiError) {
      throw error;
    }
    
    throw new ApiError(
      'Failed to debug email', 
      500,
      { 
        emailId, 
        originalError: error instanceof Error ? error.message : 'Unknown error' 
      }
    );
  }
}

/**
 * GET /api/gmail/debug-email - Debug an email by ID
 * 
 * Query parameters:
 * - emailId: ID of the email to debug
 */
export const GET = withErrorHandler(debugEmailHandler); 