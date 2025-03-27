import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { log } from '@/lib/logger';
import { withErrorHandler, throwUnauthorized } from '@/lib/api-error-handler';

/**
 * Test endpoint to verify the disconnect functionality
 * This endpoint will:
 * 1. Check the current connection status
 * 2. Call the disconnect endpoint
 * 3. Verify that tokens were removed
 */
async function testDisconnectHandler(request: NextRequest) {
  // Verify user is authenticated
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    throwUnauthorized('User must be logged in to test Gmail disconnection');
  }

  try {
    // Step 1: Get current connection status
    const beforeUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        gmailConnected: true,
        gmailAccessToken: true,
        gmailRefreshToken: true,
        gmailTokenExpiry: true,
        gmailLastSynced: true,
      },
    });

    if (!beforeUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const wasConnected = beforeUser.gmailConnected && !!beforeUser.gmailAccessToken;

    // Step 2: Call the disconnect endpoint
    const disconnectResponse = await fetch(
      new URL('/api/auth/gmail/disconnect', request.url).toString(),
      {
        method: 'POST',
        headers: {
          'Cookie': request.headers.get('cookie') || '', // Forward cookies for authentication
        },
      }
    );

    const disconnectResult = await disconnectResponse.json();

    // Step 3: Verify tokens were removed
    const afterUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        gmailConnected: true,
        gmailAccessToken: true,
        gmailRefreshToken: true,
        gmailTokenExpiry: true,
        gmailLastSynced: true,
      },
    });

    const nowConnected = afterUser?.gmailConnected && !!afterUser?.gmailAccessToken;

    return NextResponse.json({
      success: true,
      testResult: {
        wasConnected,
        nowConnected,
        tokensRemoved: wasConnected && !nowConnected,
        disconnectResult,
      },
    });
  } catch (error) {
    log('Error testing Gmail disconnection', { error });
    return NextResponse.json(
      { error: 'Failed to test Gmail disconnection' },
      { status: 500 }
    );
  }
}

// Configure for Node.js runtime
export const runtime = 'nodejs';

// POST /api/auth/gmail/test-disconnect - Test the Gmail disconnection endpoint
export const GET = withErrorHandler(testDisconnectHandler); 