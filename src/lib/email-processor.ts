import { EmailMessage } from '@/types/gmail';

// Basic email identification functions
export function isMyntraEmail(email: EmailMessage): boolean {
  return !!(email.from?.toLowerCase().includes('myntra') || 
         email.subject?.toLowerCase().includes('myntra'));
}

export function isMyntraOrderConfirmation(email: EmailMessage): boolean {
  return isMyntraEmail(email) && 
         !!(email.subject?.toLowerCase().includes('confirmed') ||
          email.subject?.toLowerCase().includes('order'));
}

export function isMyntraShippingConfirmation(email: EmailMessage): boolean {
  return isMyntraEmail(email) && 
         !!email.subject?.toLowerCase().includes('shipped');
}

export function isMyntraDeliveryConfirmation(email: EmailMessage): boolean {
  return isMyntraEmail(email) && 
         !!email.subject?.toLowerCase().includes('delivered');
}

// Order information extraction functions
export function extractMyntraOrderId(email: EmailMessage): string | null {
  // Basic implementation - extract order ID from subject or body
  const subject = email.subject || '';
  const body = email.body?.text || email.body?.html || '';
  
  // Look for order ID patterns
  const orderIdMatch = subject.match(/order[:\s#]*([A-Z0-9]+)/i) ||
                      body.match(/order[:\s#]*([A-Z0-9]+)/i);
  
  return orderIdMatch ? orderIdMatch[1] : null;
}

export function extractMyntraOrderAmount(email: EmailMessage): { amount: number | null; currency: string } {
  // Basic implementation
  return { amount: null, currency: 'INR' };
}

export function extractMyntraOrderDate(email: EmailMessage): Date | null {
  return email.date || null;
}

export function extractMyntraOrderItems(email: EmailMessage): Array<Record<string, unknown>> {
  // Basic implementation
  return [];
}

export function extractMyntraShippingAddress(email: EmailMessage): string | null {
  // Basic implementation
  return null;
}

export function extractMyntraPaymentMethod(email: EmailMessage): string | null {
  // Basic implementation
  return null;
}

export function extractMyntraTrackingInfo(email: EmailMessage): { trackingNumber: string | null; trackingUrl: string | null } {
  // Basic implementation
  return { trackingNumber: null, trackingUrl: null };
}

// Main processing function
export async function processMyntraEmail(email: EmailMessage): Promise<Record<string, unknown> | null> {
  // Basic implementation
  const orderId = extractMyntraOrderId(email);
  
  if (!orderId) {
    return null;
  }
  
  return {
    orderId,
    orderDate: extractMyntraOrderDate(email),
    items: extractMyntraOrderItems(email),
    amount: extractMyntraOrderAmount(email),
    shippingAddress: extractMyntraShippingAddress(email),
    paymentMethod: extractMyntraPaymentMethod(email),
    trackingInfo: extractMyntraTrackingInfo(email),
    emailId: email.id,
    emailDate: email.date,
    emailSubject: email.subject,
    emailFrom: email.from
  };
}

// Test functions
export const testFunctions = {
  extractEmailAddress: (emailString: string): string => {
    const match = emailString.match(/<(.+?)>/);
    return match ? match[1] : emailString;
  },
  
  extractName: (emailString: string): string => {
    const match = emailString.match(/^(.+?)\s*</);
    return match ? match[1].trim() : '';
  }
}; 