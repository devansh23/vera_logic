import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { log } from '@/lib/logger';
import { withErrorHandler, throwUnauthorized, ApiError } from '@/lib/api-error-handler';

/**
 * Handle Gmail disconnection by removing authorization tokens
 */
async function disconnectGmailHandler(request: NextRequest) {
  // Verify user is authenticated
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    throwUnauthorized('User must be logged in to disconnect Gmail');
  }

  try {
    // Get the current user status
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        gmailConnected: true,
        email: true,
      },
    });

    if (!user) {
      throw new ApiError('User not found', 404);
    }

    // Update the user to remove Gmail tokens
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        gmailAccessToken: null,
        gmailRefreshToken: null,
        gmailTokenExpiry: null,
        gmailConnected: false,
        gmailLastSynced: null,
      },
    });
    
    log('Successfully disconnected Gmail for user', { 
      userId: session.user.id,
      wasConnected: user.gmailConnected 
    });
    
    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Gmail disconnected successfully',
    });
  } catch (error) {
    // Log the error
    log('Error disconnecting Gmail', { 
      error: error instanceof Error ? error.message : 'Unknown error',
      userId: session.user.id
    });
    
    // Re-throw API errors
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Handle other errors
    throw new ApiError(
      'Failed to disconnect Gmail account', 
      500, 
      { originalError: error instanceof Error ? error.message : 'Unknown error' }
    );
  }
}

// Configure for Node.js runtime
export const runtime = 'nodejs';

// POST /api/auth/gmail/disconnect - Disconnect Gmail account
export const POST = withErrorHandler(disconnectGmailHandler); 