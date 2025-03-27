import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generateAuthUrl, getTokens } from '@/lib/gmail-auth';
import { log } from '@/lib/logger';

/**
 * GET /api/auth/gmail - Generate Gmail authorization URL
 */
export async function GET(request: NextRequest) {
  try {
    // Get the current user session
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Generate the authorization URL, passing the user's email if available
    const authUrl = generateAuthUrl(session.user.id, session.user.email || undefined);
    
    log('Generated Gmail auth URL for user', { userId: session.user.id });
    
    return NextResponse.json({ authUrl });
  } catch (error) {
    log('Error generating Gmail auth URL', { error });
    return NextResponse.json(
      { error: 'Failed to generate authorization URL' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/auth/gmail - Handle Gmail OAuth callback
 */
export async function POST(request: NextRequest) {
  try {
    const { code, state } = await request.json();
    
    if (!code || !state) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }
    
    // The state parameter contains the user ID
    const userId = state;
    
    // Get tokens from the authorization code
    const tokens = await getTokens(code);
    
    // Update the user with the Gmail tokens
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        gmailAccessToken: tokens.access_token,
        gmailRefreshToken: tokens.refresh_token,
        gmailTokenExpiry: new Date(tokens.expiry_date),
        gmailConnected: true,
        gmailLastSynced: new Date(),
      },
    });
    
    log('Successfully connected Gmail for user', { userId });
    
    return NextResponse.json({
      success: true,
      message: 'Gmail connected successfully',
      email: user.email,
    });
  } catch (error) {
    log('Error handling Gmail auth callback', { error });
    return NextResponse.json(
      { error: 'Failed to connect Gmail account' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/auth/gmail - Disconnect Gmail account
 */
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
    
    log('Disconnected Gmail for user', { userId: session.user.id });
    
    return NextResponse.json({
      success: true,
      message: 'Gmail disconnected successfully',
    });
  } catch (error) {
    log('Error disconnecting Gmail', { error });
    return NextResponse.json(
      { error: 'Failed to disconnect Gmail account' },
      { status: 500 }
    );
  }
} 