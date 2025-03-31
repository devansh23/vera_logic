/**
 * Email processing utilities for handling different email formats
 */

import { EmailMessage } from '@/types/gmail';
import { extractInfoFromEmailHtml } from './email-content-parser';
import { log } from './logger';

/**
 * Process an email to extract its content and structured information
 */
export async function processEmail(email: EmailMessage) {
  if (!email.body?.html) {
    log('Email has no HTML body', { emailId: email.id });
    return null;
  }
  
  // Extract structured information from email HTML
  const extractedInfo = extractInfoFromEmailHtml(email);
  
  return {
    email,
    info: extractedInfo
  };
}

/**
 * Clean and normalize HTML content from emails
 */
export function cleanHtmlContent(html: string): string {
  if (!html) return '';
  
  // Simple HTML cleaning - remove scripts and iframes for security
  let cleaned = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
    
  return cleaned;
}

/**
 * Extract email type/category based on content analysis
 */
export function determineEmailType(email: EmailMessage): string {
  const subject = email.subject?.toLowerCase() || '';
  const html = email.body?.html?.toLowerCase() || '';
  
  if (subject.includes('order') || subject.includes('purchase') || 
      html.includes('order confirmation') || html.includes('purchase confirmation')) {
    return 'purchase';
  }
  
  if (subject.includes('ship') || subject.includes('delivery') || 
      html.includes('has shipped') || html.includes('out for delivery')) {
    return 'shipping';
  }
  
  if (subject.includes('return') || subject.includes('refund') || 
      html.includes('return confirmation') || html.includes('refund processed')) {
    return 'return';
  }
  
  return 'other';
} 