import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { prisma } from './prisma';
import { log } from './logger';
import { ApiError } from './api-error-handler';

// Gmail API scopes needed for reading and sending emails
const SCOPES = [
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/gmail.compose',
  'https://www.googleapis.com/auth/gmail.modify'
];

function resolveRedirectUri(): string {
  // Primary: explicit Gmail redirect env
  const explicit = process.env.GMAIL_REDIRECT_URI;
  // Secondary: derive from NEXTAUTH_URL
  const baseFromNextAuth = process.env.NEXTAUTH_URL;
  // Tertiary: derive from Vercel provided host
  const baseFromVercel = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined;

  // Prefer explicit value if present and not obviously localhost in production
  if (explicit && (process.env.NODE_ENV !== 'production' || !explicit.includes('localhost'))) {
    return explicit;
  }

  const base = baseFromNextAuth || baseFromVercel;
  if (base) {
    return `${base.replace(/\/$/, '')}/api/auth/gmail/callback`;
  }

  throw new Error('Unable to resolve Gmail redirect URI. Set GMAIL_REDIRECT_URI or NEXTAUTH_URL in environment.');
}

/**
 * Creates and configures a new OAuth2 client
 */
export function getOAuth2Client(): OAuth2Client {
  const clientId = process.env.GMAIL_CLIENT_ID;
  const clientSecret = process.env.GMAIL_CLIENT_SECRET;
  const redirectUri = resolveRedirectUri();

  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error('Missing required environment variables for Gmail authentication');
  }

  return new google.auth.OAuth2(clientId, clientSecret, redirectUri);
}

/**
 * Generates the authorization URL for Gmail OAuth
 */
export function generateAuthUrl(userId: string, email?: string): string {
  const redirectUri = resolveRedirectUri();
  const oauth2Client = getOAuth2Client();
  
  const options: any = {
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent',  // Always show the consent screen
    state: userId,      // Pass the user ID as state to retrieve it after authorization
    include_granted_scopes: true, // Include any previously granted scopes
    redirect_uri: redirectUri,
  };
  
  // If we have the user's email, use it as a login hint
  if (email) {
    options.login_hint = email;
  }
  
  return oauth2Client.generateAuthUrl(options);
}

/**
 * Retrieves access and refresh tokens using the authorization code
 */
export async function getTokens(code: string): Promise<{
  access_token: string;
  refresh_token?: string;
  expiry_date: number;
}> {
  const oauth2Client = getOAuth2Client();
  
  try {
    const { tokens } = await oauth2Client.getToken(code);
    
    if (!tokens.access_token) {
      throw new Error('Failed to retrieve access token');
    }
    
    // Convert null to undefined for refresh_token to satisfy TypeScript
    const refreshToken = tokens.refresh_token === null ? undefined : tokens.refresh_token;
    
    // If no expiry_date is provided, set it to 1 hour from now
    const expiryDate = tokens.expiry_date || Date.now() + 3600 * 1000;
    
    log('Successfully retrieved tokens', { 
      hasAccessToken: !!tokens.access_token,
      hasRefreshToken: !!refreshToken,
      expiryDate: new Date(expiryDate).toISOString()
    });
    
    return {
      access_token: tokens.access_token,
      refresh_token: refreshToken,
      expiry_date: expiryDate,
    };
  } catch (error) {
    log('Error retrieving tokens', { error });
    throw new ApiError('Failed to retrieve Gmail tokens', 500);
  }
}

/**
 * Sets credentials on an OAuth2 client
 */
export function setCredentials(
  oauth2Client: OAuth2Client,
  credentials: {
    access_token: string;
    refresh_token?: string;
    expiry_date: number | undefined;
  }
): void {
  oauth2Client.setCredentials(credentials);
}

/**
 * Refreshes the access token if it's expired
 */
export async function refreshAccessToken(
  oauth2Client: OAuth2Client,
  refreshToken: string
): Promise<{
  access_token: string;
  expiry_date: number;
}> {
  try {
    oauth2Client.setCredentials({
      refresh_token: refreshToken
    });
    
    log('Attempting to refresh access token');
    const { credentials } = await oauth2Client.refreshAccessToken();
    
    if (!credentials.access_token) {
      throw new Error('Refresh did not return an access token');
    }
    
    const expiryDate = credentials.expiry_date || Date.now() + 3600 * 1000;
    
    log('Successfully refreshed access token', { 
      expiryDate: new Date(expiryDate).toISOString()
    });
    
    return {
      access_token: credentials.access_token,
      expiry_date: expiryDate
    };
  } catch (error) {
    log('Error refreshing access token', { error });
    throw new ApiError(
      'Failed to refresh Gmail access token', 
      500, 
      { originalError: error instanceof Error ? error.message : 'Unknown error' }
    );
  }
}

/**
 * Checks if a token is expired or near expiry (within 5 minutes)
 */
export function isTokenExpiredOrNearExpiry(expiryDate: Date | null | undefined): boolean {
  if (!expiryDate) return true;
  
  // Consider token expired if it's within 5 minutes of expiry
  const fiveMinutesMs = 5 * 60 * 1000;
  return new Date(expiryDate).getTime() - fiveMinutesMs < Date.now();
}

/**
 * Refreshes token if needed and updates the database
 */
export async function refreshTokenIfNeeded(userId: string): Promise<{
  accessToken: string;
  tokenExpiry: Date;
  oauth2Client: OAuth2Client;
}> {
  try {
    // Get user with Gmail tokens
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        gmailAccessToken: true,
        gmailRefreshToken: true,
        gmailTokenExpiry: true,
        gmailConnected: true,
        email: true,
      },
    });

    if (!user || !user.gmailConnected) {
      throw new ApiError('User has not connected Gmail', 401, { userId });
    }

    if (!user.gmailAccessToken || !user.gmailRefreshToken) {
      throw new ApiError('Missing Gmail tokens', 401, { 
        userId,
        hasAccessToken: !!user.gmailAccessToken,
        hasRefreshToken: !!user.gmailRefreshToken
      });
    }

    // Create OAuth2 client
    const oauth2Client = getOAuth2Client();
    
    // Check if token is expired or near expiry
    if (isTokenExpiredOrNearExpiry(user.gmailTokenExpiry)) {
      log('Token is expired or near expiry, refreshing', { 
        userId,
        tokenExpiry: user.gmailTokenExpiry?.toISOString()
      });
      
      // Refresh the token
      const { access_token, expiry_date } = await refreshAccessToken(
        oauth2Client, 
        user.gmailRefreshToken
      );
      
      // Update the database with new token details
      await prisma.user.update({
        where: { id: userId },
        data: {
          gmailAccessToken: access_token,
          gmailTokenExpiry: new Date(expiry_date),
        },
      });
      
      // Set credentials on the OAuth2 client
      oauth2Client.setCredentials({
        access_token,
        refresh_token: user.gmailRefreshToken,
        expiry_date,
      });
      
      return {
        accessToken: access_token,
        tokenExpiry: new Date(expiry_date),
        oauth2Client,
      };
    } else {
      // Token is still valid, use existing token
      oauth2Client.setCredentials({
        access_token: user.gmailAccessToken,
        refresh_token: user.gmailRefreshToken,
        expiry_date: user.gmailTokenExpiry?.getTime(),
      });
      
      return {
        accessToken: user.gmailAccessToken,
        tokenExpiry: user.gmailTokenExpiry || new Date(Date.now() + 3600 * 1000),
        oauth2Client,
      };
    }
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    log('Error refreshing token', { error, userId });
    throw new ApiError(
      'Failed to refresh Gmail token', 
      500, 
      { originalError: error instanceof Error ? error.message : 'Unknown error' }
    );
  }
} 