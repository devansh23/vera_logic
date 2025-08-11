import { GmailServiceTypes } from '@/types/gmail';
import { log } from './logger';
import { initializeGmailClient, getEmailById as gmailGetEmailById } from './gmail-service';

export interface EmailFetchOptions {
  maxResults?: number;
  onlyUnread?: boolean;
  daysBack?: number;
  afterDate?: Date;
  beforeDate?: Date;
}

export class EmailRetrievalService {
  async fetchEmailsForRetailer(
    userId: string,
    retailer: string,
    options: EmailFetchOptions = {}
  ): Promise<GmailServiceTypes.EmailMessage[]> {
    try {
      log('Fetching emails for retailer', { userId, retailer, options });

      const gmail = await initializeGmailClient(userId);
      
      // Build retailer-specific search query
      const searchQuery = this.buildRetailerSearchQuery(retailer, options);
      
      // Calculate date range
      const afterDate = options.afterDate || this.calculateAfterDate(options.daysBack || 30);
      
      // Build complete search query
      let query = `(${searchQuery})`;
      if (options.onlyUnread) {
        query += ' is:unread';
      }
      if (afterDate) {
        query += ` after:${afterDate.toISOString().split('T')[0]}`;
      }

      log('Gmail search query', { query });

      // List messages
      const response = await gmail.users.messages.list({
        userId: 'me',
        maxResults: options.maxResults || 10,
        q: query,
        includeSpamTrash: true,
      });

      const messages = response.data.messages || [];
      log('Found messages', { count: messages.length });

      // Get full message details
      const emails = await Promise.all(
        messages.map(async (msg) => {
          try {
            if (!msg.id) return null;
            return await gmailGetEmailById(userId, msg.id, gmail);
          } catch (error) {
            log('Error fetching email details', { 
              error: error instanceof Error ? error.message : 'Unknown error',
              messageId: msg.id 
            });
            return null;
          }
        })
      );

      const validEmails = emails.filter(Boolean) as GmailServiceTypes.EmailMessage[];
      log('Retrieved emails', { count: validEmails.length, retailer });

      return validEmails;
    } catch (error) {
      log('Error fetching emails for retailer', { 
        error: error instanceof Error ? error.message : 'Unknown error',
        userId,
        retailer
      });
      throw error;
    }
  }

  async getEmailById(userId: string, emailId: string): Promise<GmailServiceTypes.EmailMessage | null> {
    try {
      log('Fetching email by ID', { userId, emailId });
      return await gmailGetEmailById(userId, emailId);
    } catch (error) {
      log('Error fetching email by ID', { 
        error: error instanceof Error ? error.message : 'Unknown error',
        userId,
        emailId
      });
      throw error;
    }
  }

  private buildRetailerSearchQuery(retailer: string, options: EmailFetchOptions): string {
    const normalizedRetailer = retailer.toLowerCase();

    // Define common order confirmation keywords
    const orderConfirmationKeywords = [
      'order confirmation',
      'order confirmed',
      'order placed',
      'thank you for your order',
      'your order',
      'order number',
      'order receipt',
      'purchase confirmation',
      'receipt'
    ];

    const confirmationKeywordQuery = orderConfirmationKeywords
      .map(keyword => `subject:(${keyword})`)
      .join(' OR ');

    // Primary: retailer sender + specific subject heuristics (aligned with fetch-emails endpoint)
    const primaryQuery = normalizedRetailer === 'myntra'
      ? `from:myntra.com subject:"Your Myntra order item has been shipped"`
      : (normalizedRetailer === 'h&m' || normalizedRetailer === 'hm')
      ? `from:delivery.hm.com subject:"Order Confirmation"`
      : normalizedRetailer === 'zara'
      ? `from:noreply@zara.com subject:"Thank you for your purchase"`
      : `from:${retailer} AND (${confirmationKeywordQuery})`;

    // Forward-friendly: brand tokens + order keywords + Fwd/FW, search anywhere
    const brandTokens = normalizedRetailer === 'myntra'
      ? '(myntra OR myntra.com)'
      : (normalizedRetailer === 'h&m' || normalizedRetailer === 'hm')
      ? '("H&M" OR hm.com OR www2.hm.com OR delivery.hm.com)'
      : normalizedRetailer === 'zara'
      ? '(zara OR zara.com)'
      : `(${retailer})`;

    const forwardQuery = `in:anywhere ((${brandTokens}) AND ((${confirmationKeywordQuery}) OR subject:(FW OR Fwd OR FWD)))`;

    // Combine both queries with OR
    return `(${primaryQuery}) OR (${forwardQuery})`;
  }

  private calculateAfterDate(daysBack: number): Date {
    const date = new Date();
    date.setDate(date.getDate() - daysBack);
    return date;
  }
} 