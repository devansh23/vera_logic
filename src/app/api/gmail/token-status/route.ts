import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { log } from '@/lib/logger';
import { 
  withErrorHandler, 
  throwUnauthorized, 
  ApiError 
} from '@/lib/api-error-handler';
import { refreshTokenIfNeeded } from '@/lib/gmail-auth';
import { getGmailTokenStatus } from '@/lib/gmail-service';

/**
 * Get Gmail token status
 * This endpoint is useful for debugging and monitoring token refresh
 */
async function getTokenStatusHandler() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    throwUnauthorized('User must be logged in to check token status');
  }

  const tokenStatus = await getGmailTokenStatus(session.user.id);
  
  return NextResponse.json({
    success: true,
    status: tokenStatus
  });
}

/**
 * Force Gmail token refresh
 * This endpoint forces a token refresh even if the token is not expired
 */
async function forceTokenRefreshHandler(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    throwUnauthorized('User must be logged in to refresh token');
  }

  // Get current token state
  const beforeStatus = await getGmailTokenStatus(session.user.id);
  
  if (!beforeStatus.connected) {
    throw new ApiError('Gmail not connected', 400, { gmailConnected: false });
  }
  
  // Force refresh token
  const { accessToken, tokenExpiry } = await refreshTokenIfNeeded(session.user.id);
  
  // Get updated token state
  const afterStatus = await getGmailTokenStatus(session.user.id);
  
  return NextResponse.json({
    success: true,
    message: 'Token refreshed successfully',
    before: beforeStatus,
    after: afterStatus,
    tokenDetails: {
      tokenRefreshed: true,
      newExpiry: tokenExpiry
    }
  });
}

// Configure for Node.js runtime (needed for Gmail API)
export const runtime = 'nodejs';

// GET /api/gmail/token-status - Get token status
export const GET = withErrorHandler(getTokenStatusHandler);

// POST /api/gmail/token-status - Force token refresh
export const POST = withErrorHandler(forceTokenRefreshHandler); 