'use client';

import { useState } from 'react';
import { 
  EmailMessage, 
  EmailProduct, 
  OrderInfo, 
  EmailProcessingResult, 
  EmailProcessingStatus 
} from '@/types/gmail';

/**
 * This component doesn't render anything useful.
 * It's just to test that our TypeScript interfaces are working correctly.
 */
export default function GmailTypeTest() {
  // Test EmailMessage type
  const [email, setEmail] = useState<EmailMessage>({
    id: 'test-id',
    threadId: 'thread-123',
    labelIds: ['INBOX', 'UNREAD'],
    snippet: 'This is a preview of the email...',
    historyId: '12345',
    internalDate: '1620000000000',
    sizeEstimate: 10240,
    from: 'sender@example.com',
    to: 'recipient@example.com',
    subject: 'Test Email',
    date: new Date(),
    body: {
      text: 'Plain text email body',
      html: '<p>HTML email body</p>'
    }
  });

  // Test EmailProduct type
  const [product, setProduct] = useState<EmailProduct>({
    productName: 'Test Product',
    brand: 'Test Brand',
    price: 99.99,
    currency: 'USD',
    quantity: 1,
    size: 'M',
    color: 'Blue'
  });

  // Test OrderInfo type
  const [order, setOrder] = useState<OrderInfo>({
    orderId: 'ORDER-123',
    retailer: 'Test Store',
    orderDate: new Date(),
    totalAmount: 99.99,
    currency: 'USD',
    items: [product],
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    orderStatus: 'Confirmed'
  });

  // Test EmailProcessingResult type
  const [result, setResult] = useState<EmailProcessingResult>({
    success: true,
    orderInfo: order,
    emailId: 'test-id',
    processingTime: 250,
    extractionMethod: 'html'
  });

  // Test EmailProcessingStatus type
  const [status, setStatus] = useState<EmailProcessingStatus>({
    id: 'job-123',
    status: 'completed',
    startedAt: new Date(),
    completedAt: new Date(),
    retailer: 'Test Store',
    stats: {
      emailsFound: 10,
      emailsProcessed: 8,
      ordersCreated: 3,
      failedEmails: 2
    },
    settings: {
      daysBack: 30,
      maxEmails: 100,
      onlyUnread: true,
      markAsRead: true
    }
  });

  // This component doesn't actually render anything useful
  return (
    <div className="hidden">
      <p>Type test component - not meant to be rendered</p>
    </div>
  );
} 