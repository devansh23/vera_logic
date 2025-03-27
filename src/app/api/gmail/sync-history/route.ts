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

/**
 * Get email processing history for the authenticated user
 */
async function getSyncHistoryHandler(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    throwUnauthorized('User must be logged in to view sync history');
  }

  try {
    // Get the most recent 50 processing jobs
    const history = await prisma.emailProcessingStatus.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        startedAt: 'desc',
      },
      take: 50,
      select: {
        id: true,
        startedAt: true,
        completedAt: true,
        status: true,
        retailer: true,
        emailsFound: true,
        emailsProcessed: true,
        ordersCreated: true,
        failedEmails: true,
        errorMessage: true,
      },
    });

    return NextResponse.json({
      success: true,
      history,
    });
  } catch (error) {
    log('Error fetching sync history', { error, userId: session.user.id });
    throw new ApiError(
      'Failed to fetch sync history',
      500,
      { originalError: error instanceof Error ? error.message : 'Unknown error' }
    );
  }
}

// Configure for Node.js runtime
export const runtime = 'nodejs';

// GET /api/gmail/sync-history - Get email processing history
export const GET = withErrorHandler(getSyncHistoryHandler); 