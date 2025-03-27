import { NextRequest, NextResponse } from 'next/server';
import { getTokens } from '@/lib/gmail-auth';
import { prisma } from '@/lib/prisma';
import { log } from '@/lib/logger';

/**
 * GET /api/auth/gmail/callback - Handle the OAuth callback from Google
 */
export async function GET(request: NextRequest) {
  try {
    // Get the authorization code and state from the URL query parameters
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');
    
    // Log all the parameters for debugging
    log('Gmail OAuth callback received', { 
      error,
      hasCode: !!code, 
      hasState: !!state,
      query: Object.fromEntries(searchParams.entries())
    });
    
    // If there's an error or missing parameters, redirect to the error page
    if (error || !code || !state) {
      log('Gmail OAuth callback error', { error, code: !!code, state: !!state });
      return NextResponse.redirect(new URL('/gmail-auth-error?reason=' + encodeURIComponent(error || 'missing_parameters'), request.url));
    }
    
    // The state parameter contains the user ID
    const userId = state;
    
    try {
      // Get tokens from the authorization code
      const tokens = await getTokens(code);
      
      // Update the user with the Gmail tokens
      await prisma.user.update({
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
      
      // Redirect to the success page
      return NextResponse.redirect(new URL('/gmail-auth-success', request.url));
    } catch (tokenError) {
      log('Error getting tokens', { 
        error: tokenError,
        userId
      });
      return NextResponse.redirect(new URL('/gmail-auth-error?reason=token_error', request.url));
    }
  } catch (error) {
    log('Error handling Gmail auth callback', { error });
    return NextResponse.redirect(new URL('/gmail-auth-error?reason=server_error', request.url));
  }
} 