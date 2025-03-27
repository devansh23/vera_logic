# Testing the Gmail Integration

This document outlines the testing strategy for the Gmail integration in the Vera application, including unit tests, integration tests, and mocking strategies.

## Table of Contents

- [Testing Philosophy](#testing-philosophy)
- [Unit Testing Components](#unit-testing-components)
- [Integration Testing](#integration-testing)
- [Mock Implementations](#mock-implementations)
- [Test Data](#test-data)
- [GitHub Actions Setup](#github-actions-setup)

## Testing Philosophy

The Gmail integration testing follows these principles:

1. **Isolated Testing**: Individual components are tested in isolation using mocks for external dependencies
2. **End-to-End Verification**: Integration tests verify the complete flow from UI to API to Gmail
3. **Comprehensive Coverage**: Tests should cover authentication, token refresh, email processing, and error cases
4. **Realistic Test Data**: Use real-world email examples (with sensitive data removed)
5. **CI Integration**: Tests run automatically in CI/CD pipelines

## Unit Testing Components

### Testing Authentication Flow

```typescript
// __tests__/lib/gmail-auth.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
  generateAuthUrl,
  exchangeCodeForToken,
  refreshAccessToken
} from '@/lib/gmail-auth';
import { prisma } from '@/lib/prisma';

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      update: vi.fn()
    },
    gmailToken: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn()
    }
  }
}));

// Mock Google OAuth2 client
vi.mock('googleapis', () => ({
  google: {
    auth: {
      OAuth2: vi.fn(() => ({
        generateAuthUrl: vi.fn(() => 'https://mock-auth-url.com'),
        getToken: vi.fn(() => Promise.resolve({
          tokens: {
            access_token: 'mock-access-token',
            refresh_token: 'mock-refresh-token',
            expiry_date: Date.now() + 3600000
          }
        })),
        setCredentials: vi.fn(),
        refreshAccessToken: vi.fn(() => Promise.resolve({
          credentials: {
            access_token: 'mock-refreshed-token',
            expiry_date: Date.now() + 3600000
          }
        }))
      }))
    }
  }
}));

describe('Gmail Auth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('generateAuthUrl', () => {
    it('should generate a valid authorization URL', () => {
      const url = generateAuthUrl();
      expect(url).toBe('https://mock-auth-url.com');
    });
  });

  describe('exchangeCodeForToken', () => {
    it('should exchange code for token and save to database', async () => {
      // Mock user
      (prisma.user.findUnique as any).mockResolvedValue({
        id: 'user-123'
      });
      
      // Mock token creation
      (prisma.gmailToken.create as any).mockResolvedValue({
        id: 'token-123',
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        expiryDate: new Date(Date.now() + 3600000)
      });
      
      const result = await exchangeCodeForToken('mock-auth-code', 'user-123');
      
      expect(result.success).toBe(true);
      expect(prisma.gmailToken.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId: 'user-123',
          accessToken: 'mock-access-token',
          refreshToken: 'mock-refresh-token'
        })
      });
    });
    
    it('should handle errors during token exchange', async () => {
      // Simulate error in getToken
      const googleAuthError = new Error('Invalid code');
      (google.auth.OAuth2 as any).mockReturnValueOnce({
        generateAuthUrl: vi.fn(),
        getToken: vi.fn(() => Promise.reject(googleAuthError))
      });
      
      const result = await exchangeCodeForToken('invalid-code', 'user-123');
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid code');
      expect(prisma.gmailToken.create).not.toHaveBeenCalled();
    });
  });

  describe('refreshAccessToken', () => {
    it('should refresh token and update database', async () => {
      // Mock existing token
      (prisma.gmailToken.findUnique as any).mockResolvedValue({
        id: 'token-123',
        accessToken: 'old-access-token',
        refreshToken: 'mock-refresh-token',
        expiryDate: new Date(Date.now() - 1000) // Expired token
      });
      
      // Mock token update
      (prisma.gmailToken.update as any).mockResolvedValue({
        id: 'token-123',
        accessToken: 'mock-refreshed-token',
        refreshToken: 'mock-refresh-token',
        expiryDate: new Date(Date.now() + 3600000)
      });
      
      const result = await refreshAccessToken('user-123');
      
      expect(result.success).toBe(true);
      expect(result.accessToken).toBe('mock-refreshed-token');
      expect(prisma.gmailToken.update).toHaveBeenCalledWith({
        where: { userId: 'user-123' },
        data: expect.objectContaining({
          accessToken: 'mock-refreshed-token'
        })
      });
    });
    
    it('should handle expired refresh tokens', async () => {
      // Mock token not found (requires re-authorization)
      (prisma.gmailToken.findUnique as any).mockResolvedValue(null);
      
      const result = await refreshAccessToken('user-123');
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('No token found');
      expect(result.requiresReauth).toBe(true);
    });
    
    it('should handle refresh errors', async () => {
      // Mock existing token
      (prisma.gmailToken.findUnique as any).mockResolvedValue({
        id: 'token-123',
        accessToken: 'old-access-token',
        refreshToken: 'invalid-refresh-token',
        expiryDate: new Date(Date.now() - 1000)
      });
      
      // Mock refresh error
      const refreshError = new Error('Invalid refresh token');
      (google.auth.OAuth2 as any).mockReturnValueOnce({
        setCredentials: vi.fn(),
        refreshAccessToken: vi.fn(() => Promise.reject(refreshError))
      });
      
      const result = await refreshAccessToken('user-123');
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid refresh token');
      expect(result.requiresReauth).toBe(true);
    });
  });
});
```

### Testing Email Processing Functions

```typescript
// __tests__/lib/email-processor.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { processMyntraEmail } from '@/lib/email-processor';
import { withRetry } from '@/lib/retry-utils';
import { EmailMessage } from '@/types/gmail';

// Mock retry utility
vi.mock('@/lib/retry-utils', () => ({
  withRetry: vi.fn((fn, options) => fn())  // Just execute the function directly for tests
}));

// Mock logger
vi.mock('@/lib/logger', () => ({
  log: vi.fn()
}));

describe('Email Processor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('processMyntraEmail', () => {
    it('should extract order info from HTML content', async () => {
      // Create mock email with HTML content
      const mockEmail: EmailMessage = {
        id: 'email-123',
        threadId: 'thread-123',
        from: 'orders@myntra.com',
        to: 'user@example.com',
        subject: 'Your Myntra Order #12345678 is confirmed',
        date: new Date('2023-04-01T12:00:00Z'),
        snippet: 'Order confirmation',
        htmlContent: `
          <div>
            <p>Order ID: 12345678</p>
            <p>Order Date: 1 Apr 2023</p>
            <p>Total Amount: Rs. 1999</p>
            <div class="product">
              <p>Cotton T-Shirt</p>
              <p>Quantity: 1</p>
              <p>Price: Rs. 999</p>
            </div>
            <div class="product">
              <p>Jeans</p>
              <p>Quantity: 1</p>
              <p>Price: Rs. 1000</p>
            </div>
          </div>
        `,
        textContent: 'Your order #12345678 is confirmed',
        attachments: []
      };
      
      const result = await processMyntraEmail(mockEmail);
      
      expect(result).not.toBeNull();
      expect(result?.orderId).toBe('12345678');
      expect(result?.totalAmount).toBe(1999);
      expect(result?.currency).toBe('INR');
      expect(result?.items.length).toBe(2);
      expect(result?.items[0].productName).toBe('Cotton T-Shirt');
      expect(result?.items[1].productName).toBe('Jeans');
    });
    
    it('should fall back to PDF extraction when HTML parsing fails', async () => {
      // Create mock email with PDF attachment but no useful HTML
      const mockEmail: EmailMessage = {
        id: 'email-123',
        threadId: 'thread-123',
        from: 'orders@myntra.com',
        to: 'user@example.com',
        subject: 'Your Myntra Order Confirmation',
        date: new Date('2023-04-01T12:00:00Z'),
        snippet: 'Order confirmation',
        htmlContent: '<div>Please see attached PDF</div>',
        textContent: 'Please see attached PDF',
        attachments: [
          {
            attachmentId: 'att-123',
            filename: 'order_confirmation.pdf',
            mimeType: 'application/pdf',
            size: 12345
          }
        ]
      };
      
      // Mock the extractMyntraInfoFromPdf function implementation for testing
      vi.spyOn(require('@/lib/email-processor'), 'extractMyntraInfoFromPdf')
        .mockResolvedValue({
          orderId: 'PDF-12345',
          orderDate: new Date('2023-04-01'),
          totalAmount: 2499,
          currency: 'INR',
          items: [
            {
              productName: 'Product from PDF',
              quantity: 1,
              price: 2499
            }
          ],
          orderStatus: 'Confirmed'
        });
      
      const result = await processMyntraEmail(mockEmail);
      
      expect(result).not.toBeNull();
      expect(result?.orderId).toBe('PDF-12345');
      expect(result?.totalAmount).toBe(2499);
      expect(result?.items[0].productName).toBe('Product from PDF');
      
      // Verify the retry mechanism was used
      expect(withRetry).toHaveBeenCalled();
    });
    
    it('should return null for non-Myntra emails', async () => {
      const nonMyntraEmail: EmailMessage = {
        id: 'email-123',
        threadId: 'thread-123',
        from: 'info@other-store.com',
        to: 'user@example.com',
        subject: 'Your Order Confirmation',
        date: new Date(),
        snippet: 'Order confirmation',
        htmlContent: '<div>Order details</div>',
        textContent: 'Order details',
        attachments: []
      };
      
      const result = await processMyntraEmail(nonMyntraEmail);
      
      expect(result).toBeNull();
    });
  });
  
  // Test other email processor functions...
});
```

## Integration Testing

### Testing the Process Emails API

```typescript
// __tests__/api/gmail/process-myntra-emails.test.ts
import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import { createMocks } from 'node-mocks-http';
import { handler as processEmailsHandler } from '@/app/api/gmail/process-myntra-emails/route';
import * as GmailService from '@/lib/gmail-service';
import * as EmailProcessor from '@/lib/email-processor';
import { prisma } from '@/lib/prisma';

// Mock Gmail Service and Email Processor
vi.mock('@/lib/gmail-service');
vi.mock('@/lib/email-processor');
vi.mock('@/lib/prisma', () => ({
  prisma: {
    order: {
      findUnique: vi.fn(),
      create: vi.fn()
    },
    processedEmail: {
      findUnique: vi.fn(),
      create: vi.fn()
    }
  }
}));

// Mock auth middleware
vi.mock('@/lib/auth', () => ({
  getUserIdFromRequest: vi.fn(() => 'test-user-id')
}));

describe('Process Myntra Emails API', () => {
  beforeAll(() => {
    // Mock implementations
    (GmailService.listEmails as any).mockResolvedValue([
      { id: 'email-1', from: 'orders@myntra.com', subject: 'Order 1' },
      { id: 'email-2', from: 'orders@myntra.com', subject: 'Order 2' }
    ]);
    
    (GmailService.getEmailById as any).mockImplementation((userId, emailId) => {
      if (emailId === 'email-1') {
        return Promise.resolve({
          id: 'email-1',
          from: 'orders@myntra.com',
          subject: 'Order #111',
          htmlContent: '<div>Order details</div>'
        });
      } else {
        return Promise.resolve({
          id: 'email-2',
          from: 'orders@myntra.com',
          subject: 'Order #222',
          htmlContent: '<div>Order details</div>'
        });
      }
    });
    
    (EmailProcessor.processMyntraEmail as any).mockImplementation((email) => {
      if (email.id === 'email-1') {
        return Promise.resolve({
          orderId: '111',
          totalAmount: 1999,
          items: [{ productName: 'T-Shirt' }]
        });
      } else if (email.id === 'email-2') {
        // Simulate processing failure for the second email
        return Promise.resolve(null);
      }
      return Promise.resolve(null);
    });
    
    (prisma.processedEmail.findUnique as any).mockResolvedValue(null); // No previously processed emails
    (prisma.processedEmail.create as any).mockResolvedValue({ id: 'processed-1' });
    
    (prisma.order.findUnique as any).mockResolvedValue(null); // No existing orders
    (prisma.order.create as any).mockResolvedValue({ id: 'order-111' });
    
    (GmailService.markEmailAsRead as any).mockResolvedValue(true);
  });
  
  afterAll(() => {
    vi.resetAllMocks();
  });
  
  it('should process emails and return results', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        maxEmails: 10,
        daysBack: 30,
        onlyUnread: true,
        markAsRead: true
      }
    });
    
    await processEmailsHandler(req, res);
    
    expect(res._getStatusCode()).toBe(200);
    
    const responseData = JSON.parse(res._getData());
    expect(responseData.success).toBe(true);
    expect(responseData.processedCount).toBe(2);
    expect(responseData.successfulOrders).toBe(1);
    expect(responseData.failedOrders).toBe(1);
    
    // Verify service calls
    expect(GmailService.listEmails).toHaveBeenCalledWith(
      'test-user-id',
      expect.objectContaining({ maxResults: 10 })
    );
    
    expect(EmailProcessor.processMyntraEmail).toHaveBeenCalledTimes(2);
    expect(prisma.order.create).toHaveBeenCalledTimes(1);
    expect(GmailService.markEmailAsRead).toHaveBeenCalledTimes(2);
  });
  
  it('should handle errors during processing', async () => {
    // Mock a service error
    (GmailService.listEmails as any).mockRejectedValueOnce(new Error('API error'));
    
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        maxEmails: 5
      }
    });
    
    await processEmailsHandler(req, res);
    
    expect(res._getStatusCode()).toBe(500);
    
    const responseData = JSON.parse(res._getData());
    expect(responseData.success).toBe(false);
    expect(responseData.error).toContain('API error');
  });
});
```

## Mock Implementations

### Gmail Service Mock

Create a mock implementation of the Gmail service for development and testing:

```typescript
// __mocks__/gmail-service-mock.ts
import { EmailMessage, GmailConnectionStatus } from '@/types/gmail';

// Sample email data
const mockEmails: Record<string, EmailMessage> = {
  'email-1': {
    id: 'email-1',
    threadId: 'thread-1',
    from: 'orders@myntra.com',
    to: 'user@example.com',
    subject: 'Your Myntra Order #M12345 is confirmed',
    date: new Date('2023-06-15T10:30:00Z'),
    snippet: 'Thank you for shopping with Myntra...',
    htmlContent: `
      <div>
        <h1>Order Confirmation</h1>
        <p>Order ID: M12345</p>
        <p>Order Date: 15 Jun 2023</p>
        <p>Total Amount: Rs. 2499</p>
        <div class="product">
          <h3>Blue Denim Jeans</h3>
          <p>Quantity: 1</p>
          <p>Price: Rs. 1799</p>
        </div>
        <div class="product">
          <h3>Cotton T-Shirt</h3>
          <p>Quantity: 1</p>
          <p>Price: Rs. 700</p>
        </div>
      </div>
    `,
    textContent: 'Thank you for shopping with Myntra. Your order #M12345 is confirmed.',
    attachments: []
  },
  'email-2': {
    id: 'email-2',
    threadId: 'thread-2',
    from: 'orders@myntra.com',
    to: 'user@example.com',
    subject: 'Your Myntra Order #M54321 is confirmed',
    date: new Date('2023-06-20T14:15:00Z'),
    snippet: 'Thank you for shopping with Myntra...',
    htmlContent: '<div>Please see the attached PDF for your order details</div>',
    textContent: 'Please see the attached PDF for your order details',
    attachments: [
      {
        attachmentId: 'att-1',
        filename: 'order_M54321.pdf',
        mimeType: 'application/pdf',
        size: 125000
      }
    ]
  },
  'email-3': {
    id: 'email-3',
    threadId: 'thread-3',
    from: 'no-reply@amazon.in',
    to: 'user@example.com',
    subject: 'Your Amazon.in order #403-1234567-1234567',
    date: new Date('2023-06-25T09:45:00Z'),
    snippet: 'Hello, Your Amazon.in order has been placed...',
    htmlContent: '<div>Amazon order details</div>',
    textContent: 'Amazon order details',
    attachments: []
  }
};

// Gmail Service Mock
export const initializeGmailClient = vi.fn(() => ({ success: true }));

export const getGmailTokenStatus = vi.fn(async (userId: string): Promise<GmailConnectionStatus> => {
  return {
    isConnected: true,
    tokenExpiry: new Date(Date.now() + 3600000),
    isTokenExpired: false,
    lastSynced: new Date(Date.now() - 86400000)
  };
});

export const listEmails = vi.fn(async (userId: string, options?: any): Promise<EmailMessage[]> => {
  // Filter by sender if specified in options.q
  let emails = Object.values(mockEmails);
  
  if (options?.q) {
    if (options.q.includes('from:orders@myntra.com')) {
      emails = emails.filter(email => email.from.includes('myntra.com'));
    }
  }
  
  // Apply date filters
  if (options?.afterDate) {
    const afterDate = new Date(options.afterDate);
    emails = emails.filter(email => email.date > afterDate);
  }
  
  if (options?.beforeDate) {
    const beforeDate = new Date(options.beforeDate);
    emails = emails.filter(email => email.date < beforeDate);
  }
  
  // Limit results
  const maxResults = options?.maxResults || 10;
  return emails.slice(0, maxResults);
});

export const getEmailById = vi.fn(async (userId: string, emailId: string): Promise<EmailMessage | null> => {
  return mockEmails[emailId] || null;
});

export const markEmailAsRead = vi.fn(async (userId: string, emailId: string): Promise<boolean> => {
  return true;
});

export const getAttachment = vi.fn(async (userId: string, emailId: string, attachmentId: string): Promise<Buffer | null> => {
  // Mock PDF data
  return Buffer.from('Mock PDF data');
});

export const generateMockToken = vi.fn((expired = false): GmailConnectionStatus => {
  const now = Date.now();
  return {
    isConnected: true,
    tokenExpiry: new Date(now + (expired ? -3600000 : 3600000)),
    isTokenExpired: expired,
    lastSynced: new Date(now - 86400000)
  };
});
```

## Test Data

### Sample Email Data

Create a test fixture with sample emails:

```typescript
// __fixtures__/sample-emails.ts
import { EmailMessage } from '@/types/gmail';

export const myntraOrderEmail: EmailMessage = {
  id: 'email-myntra-1',
  threadId: 'thread-myntra-1',
  from: 'orders@myntra.com',
  to: 'user@example.com',
  subject: 'Your Myntra Order #M98765 is confirmed',
  date: new Date('2023-07-10T11:22:33Z'),
  snippet: 'Thank you for shopping with Myntra...',
  htmlContent: `
    <div>
      <h1>Order Confirmation</h1>
      <p>Order ID: M98765</p>
      <p>Order Date: 10 Jul 2023</p>
      <p>Total Amount: Rs. 3499</p>
      <div class="product">
        <h3>Running Shoes</h3>
        <p>Quantity: 1</p>
        <p>Price: Rs. 2999</p>
      </div>
      <div class="product">
        <h3>Sports Socks Pack</h3>
        <p>Quantity: 1</p>
        <p>Price: Rs. 500</p>
      </div>
    </div>
  `,
  textContent: 'Thank you for shopping with Myntra. Your order #M98765 is confirmed.',
  attachments: []
};

export const myntraPdfEmail: EmailMessage = {
  id: 'email-myntra-pdf-1',
  threadId: 'thread-myntra-pdf-1',
  from: 'orders@myntra.com',
  to: 'user@example.com',
  subject: 'Your Myntra Order Confirmation',
  date: new Date('2023-07-15T14:00:00Z'),
  snippet: 'Please find your order details in the attached PDF...',
  htmlContent: '<div>Please find your order details in the attached PDF</div>',
  textContent: 'Please find your order details in the attached PDF',
  attachments: [
    {
      attachmentId: 'att-myntra-pdf-1',
      filename: 'myntra_order.pdf',
      mimeType: 'application/pdf',
      size: 145000
    }
  ]
};

export const nonOrderEmail: EmailMessage = {
  id: 'email-non-order',
  threadId: 'thread-non-order',
  from: 'newsletters@myntra.com',
  to: 'user@example.com',
  subject: 'Weekend Sale - Up to 70% Off!',
  date: new Date('2023-07-20T09:00:00Z'),
  snippet: 'Don\'t miss our biggest sale of the season...',
  htmlContent: '<div>Sale newsletter content</div>',
  textContent: 'Sale newsletter content',
  attachments: []
};

export const sampleEmails = [
  myntraOrderEmail,
  myntraPdfEmail,
  nonOrderEmail
];
```

## GitHub Actions Setup

Add a GitHub Actions workflow to run tests automatically:

```yaml
# .github/workflows/gmail-integration-tests.yml
name: Gmail Integration Tests

on:
  push:
    branches: [ main, develop ]
    paths:
      - 'src/lib/gmail-*.ts'
      - 'src/app/api/gmail/**'
      - 'src/components/Gmail*.tsx'
      - 'src/types/gmail.ts'
      - '__tests__/**'
  pull_request:
    branches: [ main, develop ]
    paths:
      - 'src/lib/gmail-*.ts'
      - 'src/app/api/gmail/**'
      - 'src/components/Gmail*.tsx'
      - 'src/types/gmail.ts'
      - '__tests__/**'

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
      
      - name: Lint
        run: npm run lint
      
      - name: Run tests
        run: npm test -- --coverage
        env:
          GMAIL_CLIENT_ID: ${{ secrets.GMAIL_CLIENT_ID }}
          GMAIL_CLIENT_SECRET: ${{ secrets.GMAIL_CLIENT_SECRET }}
          GMAIL_REDIRECT_URI: http://localhost:3000/api/auth/gmail/callback
          # Use mock implementations for tests
          TEST_MODE: true
      
      - name: Upload coverage reports
        uses: codecov/codecov-action@v3
        with:
          token: ${{ secrets.CODECOV_TOKEN }}
          directory: ./coverage
          flags: gmail-integration
          fail_ci_if_error: false
``` 