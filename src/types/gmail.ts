/**
 * Gmail Integration Types
 * 
 * This file contains type definitions for Gmail integration in the Vera application.
 * These types are used for handling Gmail API requests, managing tokens, and processing email content.
 */

import { gmail_v1 } from 'googleapis';

// ====================================================
// AUTHENTICATION & TOKEN MANAGEMENT
// ====================================================

/**
 * Gmail OAuth token information
 */
export interface GmailToken {
  /** OAuth access token for Gmail API */
  accessToken: string;
  /** OAuth refresh token - used to get new access tokens */
  refreshToken?: string;
  /** When the access token expires */
  expiryDate: number | Date;
  /** Scopes granted to the token */
  scope?: string;
}

/**
 * Gmail connection status
 */
export interface GmailConnectionStatus {
  /** Whether Gmail is successfully connected */
  connected: boolean;
  /** When the token will expire */
  tokenExpiry: Date | null;
  /** Whether the token is currently expired */
  isTokenExpired: boolean;
  /** Last time the Gmail account was synced */
  lastSynced: Date | null;
}

/**
 * Token refresh response
 */
export interface TokenRefreshResult {
  /** Whether the token refresh was successful */
  tokenRefreshed: boolean;
  /** New access token */
  accessToken?: string;
  /** When the new token expires */
  newExpiry?: Date;
  /** Error message if token refresh failed */
  error?: string;
}

// ====================================================
// EMAIL MESSAGES & ATTACHMENTS
// ====================================================

/**
 * Email message structure
 */
export interface EmailMessage {
  /** Unique ID of the email */
  id: string;
  /** Thread ID the email belongs to */
  threadId: string;
  /** Gmail labels applied to the email */
  labelIds: string[];
  /** Short snippet of the email content */
  snippet: string;
  /** Gmail history ID */
  historyId: string;
  /** Internal date as a string */
  internalDate: string;
  /** Raw message payload from Gmail API */
  payload?: gmail_v1.Schema$MessagePart;
  /** Size of the email in bytes */
  sizeEstimate: number;
  /** Raw email content (if requested) */
  raw?: string;
  
  // Custom fields for our application
  /** Sender email address */
  from?: string;
  /** Recipient email address */
  to?: string;
  /** Email subject */
  subject?: string;
  /** Parsed date of the email */
  date?: Date;
  /** Email body content */
  body?: {
    /** Plain text version of the email */
    text?: string;
    /** HTML version of the email */
    html?: string;
  };
  /** Attachments included in the email */
  attachments?: EmailAttachment[];
}

/**
 * Email attachment structure
 */
export interface EmailAttachment {
  /** Filename of the attachment */
  filename: string;
  /** MIME type of the attachment */
  mimeType: string;
  /** Size of the attachment in bytes */
  size: number;
  /** Gmail attachment ID (for fetching content) */
  attachmentId?: string;
  /** Attachment data as a Buffer */
  data?: Buffer;
}

/**
 * Options for searching emails
 */
export interface EmailSearchOptions {
  /** Maximum number of results to return */
  maxResults?: number;
  /** Raw query string */
  query?: string;
  /** Gmail label IDs to filter by */
  labelIds?: string[];
  /** Page token for pagination */
  pageToken?: string;
  /** Whether to include spam and trash */
  includeSpamTrash?: boolean;
  /** Gmail search query syntax */
  q?: string;
  /** Filter for only unread emails */
  onlyUnread?: boolean;
  /** Filter for emails after this date */
  afterDate?: Date;
  /** Filter for emails before this date */
  beforeDate?: Date;
}

/**
 * Response from listing emails
 */
export interface EmailListResponse {
  /** List of emails matching the search criteria */
  messages: EmailMessage[];
  /** Token for fetching the next page of results */
  nextPageToken?: string;
  /** Total number of messages matching the search */
  resultSizeEstimate?: number;
}

// ====================================================
// EMAIL PROCESSING & PRODUCTS
// ====================================================

/**
 * Generic product information extracted from emails
 */
export interface EmailProduct {
  /** Product name */
  productName: string;
  /** Brand name */
  brand?: string;
  /** Product price */
  price?: number;
  /** Currency of the price */
  currency?: string;
  /** Original price before discount */
  originalPrice?: number;
  /** Discount percentage or amount */
  discount?: string;
  /** Quantity ordered */
  quantity?: number;
  /** Product size */
  size?: string;
  /** Product color */
  color?: string;
  /** Stock keeping unit */
  sku?: string;
  /** Product category */
  category?: string;
  /** Product subcategory */
  subcategory?: string;
  /** List of product images */
  images?: string[];
  /** Primary product image */
  imageUrl?: string;
  /** Link to the product */
  productLink?: string;
  /** Product description */
  description?: string;
  /** Product variants */
  variants?: string[];
  /** Product material */
  material?: string;
}

/**
 * Generic order information from any retailer
 */
export interface OrderInfo {
  /** Order ID/number from the retailer */
  orderId: string;
  /** Date the order was placed */
  orderDate?: Date;
  /** Total amount of the order */
  totalAmount?: number;
  /** Currency of the order */
  currency?: string;
  /** Items in the order */
  items: EmailProduct[];
  /** Shipping address */
  shippingAddress?: string;
  /** Tracking number */
  trackingNumber?: string;
  /** Tracking URL */
  trackingUrl?: string;
  /** Expected delivery date */
  deliveryDate?: Date;
  /** Payment method used */
  paymentMethod?: string;
  /** Current order status */
  orderStatus?: string;
  /** Customer name */
  customerName?: string;
  /** Customer email */
  customerEmail?: string;
  /** Invoice URL */
  invoiceUrl?: string;
  /** Retailer or store name */
  retailer: string;
  /** Email ID this order was extracted from */
  emailId?: string;
}

/**
 * Email processing result
 */
export interface EmailProcessingResult {
  /** Whether processing was successful */
  success: boolean;
  /** Extracted order information */
  orderInfo?: OrderInfo;
  /** Error message if processing failed */
  error?: string;
  /** Processing time in milliseconds */
  processingTime?: number;
  /** Number of retry attempts */
  retryAttempts?: number;
  /** Email ID that was processed */
  emailId: string;
  /** Method used to extract the information */
  extractionMethod?: 'html' | 'text' | 'pdf' | 'ai';
}

/**
 * Email processing job status
 */
export interface EmailProcessingStatus {
  /** Job ID */
  id: string;
  /** Current status of the job */
  status: 'pending' | 'processing' | 'completed' | 'failed';
  /** When the job started */
  startedAt: Date | string;
  /** When the job completed (if finished) */
  completedAt?: Date | string | null;
  /** Retailer being processed */
  retailer?: string | null;
  /** Job statistics */
  stats: {
    /** Number of emails found matching criteria */
    emailsFound: number | null;
    /** Number of emails successfully processed */
    emailsProcessed: number | null;
    /** Number of orders created */
    ordersCreated: number | null;
    /** Number of emails that failed processing */
    failedEmails: number | null;
  };
  /** Error message if the job failed */
  error?: string | null;
  /** Processing settings */
  settings?: {
    /** Days back to search for emails */
    daysBack: number;
    /** Maximum emails to process */
    maxEmails: number;
    /** Whether to only process unread emails */
    onlyUnread: boolean;
    /** Whether to mark processed emails as read */
    markAsRead: boolean;
  };
}

/**
 * Internal type variations for Gmail service implementation
 * These types are designed to be compatible with the existing Gmail service code
 */
export namespace GmailServiceTypes {
  /**
   * Email message structure with nullable values for Gmail service compatibility
   */
  export interface EmailMessage {
    /** Unique ID of the email */
    id: string;
    /** Thread ID the email belongs to */
    threadId: string;
    /** Gmail labels applied to the email */
    labelIds: string[];
    /** Short snippet of the email content */
    snippet: string;
    /** Gmail history ID */
    historyId: string;
    /** Internal date as a string */
    internalDate: string;
    /** Raw message payload from Gmail API */
    payload?: gmail_v1.Schema$MessagePart;
    /** Size of the email in bytes */
    sizeEstimate: number;
    /** Raw email content (if requested) */
    raw?: string;
    
    // Custom fields for our application
    /** Sender email address */
    from?: string;
    /** Recipient email address */
    to?: string;
    /** Email subject */
    subject?: string;
    /** Parsed date of the email */
    date?: Date;
    /** Email body content */
    body?: {
      /** Plain text version of the email */
      text?: string | null;
      /** HTML version of the email */
      html?: string | null;
    };
    /** Attachments included in the email */
    attachments?: EmailAttachment[];
  }
} 