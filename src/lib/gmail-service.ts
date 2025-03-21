import { google, gmail_v1 } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { refreshTokenIfNeeded, getOAuth2Client } from './gmail-auth';
import { prisma } from './prisma';
import { log } from './logger';
import { ApiError } from './api-error-handler';
import { 
  EmailMessage,
  EmailAttachment,
  EmailSearchOptions,
  EmailListResponse,
  GmailConnectionStatus,
  GmailServiceTypes
} from '@/types/gmail';

// Export the Gmail class for direct use if needed
export { gmail_v1 };

// For internal use with the Gmail service implementation
type InternalEmailMessage = GmailServiceTypes.EmailMessage;

/**
 * Initialize Gmail API client for a user
 * This function handles token refresh automatically when needed
 */
export async function initializeGmailClient(userId: string): Promise<gmail_v1.Gmail> {
  try {
    // Refresh token if needed and get configured OAuth2 client
    const { oauth2Client } = await refreshTokenIfNeeded(userId);
    
    // Create and return Gmail API client
    return google.gmail({ version: 'v1', auth: oauth2Client });
  } catch (error) {
    log('Error initializing Gmail client', { error, userId });
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      `Failed to initialize Gmail client`, 
      500,
      { userId, originalError: error instanceof Error ? error.message : 'Unknown error' }
    );
  }
}

/**
 * Build a Gmail search query string from options
 */
function buildSearchQuery(options: EmailSearchOptions): string {
  const query: string[] = [];
  
  // Add query string if provided
  if (options.q) {
    query.push(options.q);
  }
  
  // Filter for unread messages
  if (options.onlyUnread) {
    query.push('is:unread');
  }
  
  // Date filters
  if (options.afterDate) {
    query.push(`after:${options.afterDate.toISOString().split('T')[0]}`);
  }
  
  if (options.beforeDate) {
    query.push(`before:${options.beforeDate.toISOString().split('T')[0]}`);
  }
  
  return query.join(' ');
}

/**
 * List emails matching search criteria
 */
export async function listEmails(
  userId: string,
  options: EmailSearchOptions = {}
): Promise<{
  messages: InternalEmailMessage[];
  nextPageToken?: string;
}> {
  try {
    const gmail = await initializeGmailClient(userId);
    
    // Build the search query
    const q = buildSearchQuery(options);

    // List messages
    const res = await gmail.users.messages.list({
      userId: 'me',
      maxResults: options.maxResults || 20,
      q,
      pageToken: options.pageToken,
      labelIds: options.labelIds,
      includeSpamTrash: options.includeSpamTrash,
    });

    const messages = res.data.messages || [];
    const nextPageToken = res.data.nextPageToken;

    // If no messages found, return empty array
    if (messages.length === 0) {
      return { messages: [], nextPageToken };
    }

    // Get full message details for each message
    const fullMessages = await Promise.all(
      messages.map(msg => {
        // Make sure msg.id is defined
        if (!msg.id) return null;
        return getEmailById(userId, msg.id, gmail);
      })
    );

    return {
      messages: fullMessages.filter(Boolean) as InternalEmailMessage[],
      nextPageToken,
    };
  } catch (error) {
    log('Error listing emails', { error, userId });
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      'Failed to list emails', 
      500,
      { userId, originalError: error instanceof Error ? error.message : 'Unknown error' }
    );
  }
}

/**
 * Get a single email by ID
 */
export async function getEmailById(
  userId: string,
  messageId: string,
  gmailClient?: gmail_v1.Gmail
): Promise<InternalEmailMessage | null> {
  try {
    const gmail = gmailClient || await initializeGmailClient(userId);
    
    // Get the message
    const res = await gmail.users.messages.get({
      userId: 'me',
      id: messageId,
      format: 'full',
    });

    const message = res.data;
    
    if (!message || !message.payload) {
      return null;
    }

    // Extract email metadata
    const headers = message.payload.headers || [];
    const from = headers.find(h => h.name?.toLowerCase() === 'from')?.value || '';
    const to = headers.find(h => h.name?.toLowerCase() === 'to')?.value || '';
    const subject = headers.find(h => h.name?.toLowerCase() === 'subject')?.value || '';
    const dateHeader = headers.find(h => h.name?.toLowerCase() === 'date')?.value;
    const date = dateHeader ? new Date(dateHeader) : undefined;

    // Extract email body and attachments
    const { textContent, htmlContent, attachments } = parseMessageParts(message.payload);

    // Construct email message object
    const emailMessage: InternalEmailMessage = {
      id: message.id || '',
      threadId: message.threadId || '',
      labelIds: message.labelIds || [],
      snippet: message.snippet || '',
      historyId: message.historyId || '',
      internalDate: message.internalDate || '',
      payload: message.payload,
      sizeEstimate: message.sizeEstimate || 0,
      from,
      to,
      subject,
      date,
      body: {
        text: textContent,
        html: htmlContent,
      },
      attachments,
    };

    return emailMessage;
  } catch (error) {
    log('Error getting email by ID', { error, userId, messageId });
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      'Failed to get email by ID', 
      500,
      { userId, messageId, originalError: error instanceof Error ? error.message : 'Unknown error' }
    );
  }
}

/**
 * Parse message parts to extract body and attachments
 */
function parseMessageParts(
  part: gmail_v1.Schema$MessagePart
): {
  textContent: string | undefined;
  htmlContent: string | undefined;
  attachments: EmailAttachment[];
} {
  let textContent: string | undefined = '';
  let htmlContent: string | undefined = '';
  const attachments: EmailAttachment[] = [];

  // Process this part
  if (part.mimeType === 'text/plain' && part.body?.data) {
    textContent = Buffer.from(part.body.data, 'base64').toString('utf-8');
  } else if (part.mimeType === 'text/html' && part.body?.data) {
    htmlContent = Buffer.from(part.body.data, 'base64').toString('utf-8');
  } else if (part.mimeType?.startsWith('multipart/')) {
    // Process child parts recursively
    if (part.parts) {
      for (const childPart of part.parts) {
        const { textContent: childText, htmlContent: childHtml, attachments: childAttachments } = 
          parseMessageParts(childPart);
        
        if (childText) textContent = (textContent || '') + childText;
        if (childHtml) htmlContent = (htmlContent || '') + childHtml;
        attachments.push(...childAttachments);
      }
    }
  } else if (part.body?.attachmentId) {
    // This is an attachment
    attachments.push({
      filename: part.filename || 'unnamed',
      mimeType: part.mimeType || 'application/octet-stream',
      size: part.body.size || 0,
      attachmentId: part.body.attachmentId,
    });
  }

  // Convert empty strings to undefined for consistency
  if (textContent === '') textContent = undefined;
  if (htmlContent === '') htmlContent = undefined;

  return { textContent, htmlContent, attachments };
}

/**
 * Get an attachment by message ID and attachment ID
 */
export async function getAttachment(
  userId: string,
  messageId: string,
  attachmentId: string
): Promise<Buffer | null> {
  try {
    const gmail = await initializeGmailClient(userId);
    
    // Get the attachment
    const res = await gmail.users.messages.attachments.get({
      userId: 'me',
      messageId,
      id: attachmentId,
    });

    if (!res.data.data) {
      return null;
    }

    // Decode base64 data
    return Buffer.from(res.data.data, 'base64');
  } catch (error) {
    log('Error getting attachment', { error, userId, messageId, attachmentId });
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      'Failed to get attachment', 
      500,
      { userId, messageId, attachmentId, originalError: error instanceof Error ? error.message : 'Unknown error' }
    );
  }
}

/**
 * Mark an email as read
 */
export async function markEmailAsRead(userId: string, messageId: string): Promise<void> {
  try {
    const gmail = await initializeGmailClient(userId);
    
    // Remove UNREAD label
    await gmail.users.messages.modify({
      userId: 'me',
      id: messageId,
      requestBody: {
        removeLabelIds: ['UNREAD'],
      },
    });
    
    log('Marked email as read', { userId, messageId });
  } catch (error) {
    log('Error marking email as read', { error, userId, messageId });
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      'Failed to mark email as read', 
      500,
      { userId, messageId, originalError: error instanceof Error ? error.message : 'Unknown error' }
    );
  }
}

/**
 * Get Gmail labels for a user
 */
export async function getLabels(userId: string): Promise<gmail_v1.Schema$Label[]> {
  try {
    const gmail = await initializeGmailClient(userId);
    
    const res = await gmail.users.labels.list({
      userId: 'me',
    });

    return res.data.labels || [];
  } catch (error) {
    log('Error getting labels', { error, userId });
    return [];
  }
}

/**
 * Get the token status for a user
 * This is useful for checking if the gmail integration is working
 */
export async function getGmailTokenStatus(userId: string): Promise<GmailConnectionStatus> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        gmailConnected: true,
        gmailTokenExpiry: true,
        gmailLastSynced: true,
      },
    });
    
    if (!user) {
      throw new ApiError('User not found', 404, { userId });
    }
    
    const isTokenExpired = !user.gmailTokenExpiry || user.gmailTokenExpiry < new Date();
    
    return {
      connected: !!user.gmailConnected,
      tokenExpiry: user.gmailTokenExpiry,
      isTokenExpired,
      lastSynced: user.gmailLastSynced,
    };
  } catch (error) {
    log('Error getting Gmail token status', { error, userId });
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      'Failed to get Gmail token status', 
      500,
      { userId, originalError: error instanceof Error ? error.message : 'Unknown error' }
    );
  }
} 