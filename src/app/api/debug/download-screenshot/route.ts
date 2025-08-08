import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { debugScreenshots } from '@/lib/email-screenshot-extractor';
import { withErrorHandler, ApiError, throwUnauthorized } from '@/lib/api-error-handler';

export const runtime = 'nodejs';

async function downloadScreenshotHandler(request: NextRequest) {
  // Disable debug endpoints in production unless explicitly enabled
  if (process.env.NODE_ENV === 'production' && process.env.ENABLE_DEBUG_ENDPOINTS !== 'true') {
    throw new ApiError('Debug endpoints are disabled in production', 403);
  }

  // Check user authentication
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throwUnauthorized('User must be logged in to download screenshots');
  }
  
  // Get email ID from query parameters
  const emailId = request.nextUrl.searchParams.get('emailId');
  
  if (!emailId) {
    throw new ApiError('Email ID is required', 400);
  }
  
  // Get screenshot from the debug map
  const screenshot = debugScreenshots.get(emailId);
  
  if (!screenshot) {
    throw new ApiError('Screenshot not found for the specified email ID', 404);
  }
  
  // Create response with proper headers for download
  const response = new NextResponse(screenshot);
  
  // Set appropriate headers for a PNG file download
  response.headers.set('Content-Type', 'image/png');
  response.headers.set('Content-Disposition', `attachment; filename="email-screenshot-${emailId}.png"`);
  
  return response;
}

export const GET = withErrorHandler(downloadScreenshotHandler); 