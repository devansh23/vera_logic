import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { log } from '@/lib/logger';

// Configure for Node.js runtime (needed for Prisma)
export const runtime = 'nodejs';

/**
 * GET /api/gmail/process-status - Check the status of an email processing job
 * 
 * Query parameters:
 * - id: The ID of the email processing job to check
 */
export async function GET(request: NextRequest) {
  try {
    // Get the current user session
    const session = await getServerSession(authOptions);
    
    // For testing only: allow bypass with a specific header in development
    const isTestMode = process.env.NODE_ENV === 'development' && 
      request.headers.get('x-test-auth') === 'true';
    
    let userId = session?.user?.id;
    
    // If in test mode, use a test user ID
    if (isTestMode) {
      userId = 'cm8dazc2b0007bwpo2xeaxi74'; // Use a valid test user ID
      log('Using test authentication bypass', { userId });
    }
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the job ID from the query parameters
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('id');

    if (!jobId) {
      return NextResponse.json(
        { error: 'Missing job ID', details: 'Please provide a valid job ID parameter' },
        { status: 400 }
      );
    }

    // Find the processing job
    const processingJob = await prisma.emailProcessingStatus.findUnique({
      where: {
        id: jobId
      },
    });

    // Check if the job exists
    if (!processingJob) {
      return NextResponse.json(
        { error: 'Processing job not found', details: 'The requested job does not exist' },
        { status: 404 }
      );
    }

    // Check if the job belongs to the current user
    if (processingJob.userId !== userId) {
      return NextResponse.json(
        { error: 'Forbidden', details: 'You do not have permission to access this job' },
        { status: 403 }
      );
    }

    // Return the processing job status
    return NextResponse.json({
      id: processingJob.id,
      status: processingJob.status,
      startedAt: processingJob.startedAt,
      completedAt: processingJob.completedAt,
      retailer: processingJob.retailer,
      stats: {
        emailsFound: processingJob.emailsFound || 0,
        emailsProcessed: processingJob.emailsProcessed || 0,
        ordersCreated: processingJob.ordersCreated || 0,
        failedEmails: processingJob.failedEmails || 0
      },
      error: processingJob.errorMessage,
      settings: {
        daysBack: processingJob.daysBack,
        maxEmails: processingJob.maxEmails,
        onlyUnread: processingJob.onlyUnread,
        markAsRead: processingJob.markAsRead
      }
    });
  } catch (error) {
    log('Error checking processing status', { error });
    return NextResponse.json(
      { 
        error: 'Failed to check processing status',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/gmail/process-status/list - Get a list of email processing jobs for the current user
 */
export async function POST(request: NextRequest) {
  try {
    // Get the current user session
    const session = await getServerSession(authOptions);
    
    // For testing only: allow bypass with a specific header in development
    const isTestMode = process.env.NODE_ENV === 'development' && 
      request.headers.get('x-test-auth') === 'true';
    
    let userId = session?.user?.id;
    
    // If in test mode, use a test user ID
    if (isTestMode) {
      userId = 'cm8dazc2b0007bwpo2xeaxi74'; // Use a valid test user ID
      log('Using test authentication bypass', { userId });
    }
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body for filters
    const body = await request.json().catch(() => ({}));
    const { status, retailer, limit = 10, offset = 0 } = body;

    // Build the where clause for filtering
    const where: any = {
      userId: userId
    };

    if (status) {
      where.status = status;
    }

    if (retailer) {
      where.retailer = retailer;
    }

    // Get the total count
    const totalCount = await prisma.emailProcessingStatus.count({
      where
    });

    // Get the processing jobs
    const processingJobs = await prisma.emailProcessingStatus.findMany({
      where,
      orderBy: {
        startedAt: 'desc'
      },
      take: limit,
      skip: offset
    });

    // Format the response
    const formattedJobs = processingJobs.map((job: any) => ({
      id: job.id,
      status: job.status,
      retailer: job.retailer,
      startedAt: job.startedAt,
      completedAt: job.completedAt,
      stats: {
        emailsFound: job.emailsFound || 0,
        emailsProcessed: job.emailsProcessed || 0,
        ordersCreated: job.ordersCreated || 0,
        failedEmails: job.failedEmails || 0
      }
    }));

    return NextResponse.json({
      jobs: formattedJobs,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount
      }
    });

  } catch (error) {
    log('Error getting processing jobs list', { error });
    return NextResponse.json(
      { 
        error: 'Failed to get processing jobs',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 