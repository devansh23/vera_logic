import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { log } from '@/lib/logger';

/**
 * GET /api/auth/gmail/status - Check Gmail connection status
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get the user with Gmail connection details
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        gmailConnected: true,
        gmailAccessToken: true,
        gmailTokenExpiry: true,
        gmailLastSynced: true,
      },
    });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Check if the token is expired
    const isTokenExpired = user.gmailTokenExpiry 
      ? new Date(user.gmailTokenExpiry) < new Date() 
      : true;
    
    return NextResponse.json({
      connected: user.gmailConnected && !!user.gmailAccessToken && !isTokenExpired,
      lastSynced: user.gmailLastSynced,
    });
  } catch (error) {
    log('Error checking Gmail connection status', { error });
    return NextResponse.json(
      { error: 'Failed to check Gmail connection status' },
      { status: 500 }
    );
  }
} 