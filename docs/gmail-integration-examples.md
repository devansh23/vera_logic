# Gmail Integration Examples

This document provides code examples for common tasks using the Gmail integration in the Vera application.

## Table of Contents

- [Authentication Examples](#authentication-examples)
- [Email Processing Examples](#email-processing-examples)
- [Error Handling Examples](#error-handling-examples)
- [Custom Parsing Examples](#custom-parsing-examples)
- [Advanced Usage](#advanced-usage)

## Authentication Examples

### Initiating OAuth Flow

```tsx
// Component for initiating Gmail connection
import { useState } from 'react';

export default function ConnectGmailButton() {
  const [isConnecting, setIsConnecting] = useState(false);
  
  const handleConnect = async () => {
    try {
      setIsConnecting(true);
      
      // Get the authorization URL
      const response = await fetch('/api/auth/gmail/url');
      const data = await response.json();
      
      if (data.url) {
        // Redirect to Google's OAuth page
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Failed to initiate Gmail connection', error);
    } finally {
      setIsConnecting(false);
    }
  };
  
  return (
    <button 
      onClick={handleConnect}
      disabled={isConnecting}
      className="btn btn-primary"
    >
      {isConnecting ? 'Connecting...' : 'Connect Gmail'}
    </button>
  );
}
```

### Checking Connection Status

```tsx
// Hook for checking Gmail connection status
import { useState, useEffect } from 'react';

export function useGmailStatus() {
  const [status, setStatus] = useState({
    isConnected: false,
    lastSynced: null,
    isLoading: true,
    error: null
  });
  
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch('/api/auth/gmail/status');
        const data = await response.json();
        
        setStatus({
          isConnected: data.connected,
          lastSynced: data.lastSynced ? new Date(data.lastSynced) : null,
          isLoading: false,
          error: null
        });
      } catch (error) {
        setStatus(prev => ({
          ...prev,
          isLoading: false,
          error: 'Failed to check Gmail connection status'
        }));
      }
    };
    
    checkStatus();
  }, []);
  
  return status;
}
```

### Disconnecting Gmail

```tsx
// Function to disconnect Gmail
async function disconnectGmail() {
  try {
    const response = await fetch('/api/auth/gmail/disconnect', {
      method: 'POST'
    });
    
    if (!response.ok) {
      throw new Error('Failed to disconnect Gmail');
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error disconnecting Gmail:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}
```

## Email Processing Examples

### Processing Emails Manually

```tsx
// Component for manual email processing
import { useState } from 'react';

export default function ProcessEmailsButton() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  
  const processEmails = async () => {
    try {
      setIsProcessing(true);
      setResult(null);
      
      const response = await fetch('/api/gmail/process-myntra-emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          maxEmails: 10,
          daysBack: 30,
          onlyUnread: true,
          markAsRead: true
        })
      });
      
      const data = await response.json();
      setResult(data);
      
    } catch (error) {
      console.error('Error processing emails', error);
      setResult({ error: 'Failed to process emails' });
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <div>
      <button 
        onClick={processEmails}
        disabled={isProcessing}
        className="btn btn-primary"
      >
        {isProcessing ? 'Processing...' : 'Process Emails'}
      </button>
      
      {result && (
        <div className="mt-4">
          <h3>Processing Results</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
```

### Viewing Processing History

```tsx
// Hook for fetching processing history
import { useState, useEffect } from 'react';

export function useProcessingHistory() {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const fetchHistory = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/gmail/sync-history');
      const data = await response.json();
      
      if (data.success) {
        setHistory(data.history);
      } else {
        throw new Error(data.error || 'Failed to fetch history');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchHistory();
  }, []);
  
  return { history, isLoading, error, refreshHistory: fetchHistory };
}
```

## Error Handling Examples

### Using the Retry Mechanism

```typescript
// Using the retry utility in custom code
import { withRetry, MAX_RETRIES } from '@/lib/retry-utils';

async function fetchDataWithRetry() {
  try {
    const result = await withRetry(
      async () => {
        // Your async operation that might fail
        const response = await fetch('https://api.example.com/data');
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        return await response.json();
      },
      {
        maxRetries: 3, // Override default if needed
        baseDelay: 1000, // Milliseconds
        context: { operation: 'fetchData' }, // For logging
        onRetry: (error, attempt, delay) => {
          console.log(`Retry attempt ${attempt} after ${delay}ms`, error);
        }
      }
    );
    
    return result;
  } catch (error) {
    console.error('All retry attempts failed', error);
    throw error;
  }
}
```

### Testing the Retry Mechanism

```typescript
// Function to test different retry scenarios
async function testRetryScenario(scenario) {
  try {
    const response = await fetch(`/api/test-retry?scenario=${scenario}`);
    const result = await response.json();
    
    console.log(`Retry test result for ${scenario}:`, result);
    return result;
  } catch (error) {
    console.error(`Error testing retry scenario ${scenario}:`, error);
    return { error: error.message };
  }
}

// Example usage:
async function runRetryTests() {
  const scenarios = [
    'success',       // No failures, succeeds immediately
    'fail-once',     // Fails first attempt, succeeds on retry
    'fail-twice',    // Fails first two attempts, succeeds on third
    'timeout',       // Simulates a timeout, then succeeds
    'network-error', // Simulates network error, then succeeds
    'rate-limit',    // Simulates rate limiting (status 429)
    'permanent-failure', // Non-retryable error (fails immediately)
    'retry-exhaustion' // Retryable error that exceeds max retries
  ];
  
  for (const scenario of scenarios) {
    console.log(`Testing scenario: ${scenario}`);
    await testRetryScenario(scenario);
  }
}
```

## Custom Parsing Examples

### Creating a Custom Retailer Parser

```typescript
// Example of extending the system for a new retailer
import { EmailMessage } from '@/types/gmail';
import { log } from '@/lib/logger';

// Interface for Amazon order information
interface AmazonOrderInfo {
  orderId: string;
  orderDate?: Date;
  totalAmount?: number;
  currency?: string;
  items: AmazonOrderItem[];
  // Other Amazon-specific fields
  isPrime?: boolean;
  estimatedDelivery?: Date;
}

interface AmazonOrderItem {
  productName: string;
  asin?: string;
  price?: number;
  quantity?: number;
  // Other Amazon-specific fields
}

// Check if an email is from Amazon
export function isAmazonEmail(email: EmailMessage): boolean {
  // Logic to detect Amazon emails
  const fromEmail = email.from?.toLowerCase() || '';
  return fromEmail.includes('@amazon.com') || 
         fromEmail.includes('ship-confirm@amazon') ||
         (email.subject || '').toLowerCase().includes('amazon order');
}

// Process Amazon emails
export async function processAmazonEmail(email: EmailMessage): Promise<AmazonOrderInfo | null> {
  if (!isAmazonEmail(email)) {
    return null;
  }
  
  try {
    // Extract order ID
    const orderId = extractAmazonOrderId(email);
    if (!orderId) {
      log('Failed to extract Amazon order ID', { emailId: email.id });
      return null;
    }
    
    // Extract other order information
    // ... implementation details ...
    
    return {
      orderId,
      orderDate: extractOrderDate(email),
      totalAmount: extractTotalAmount(email),
      currency: 'USD', // Or extract from email
      items: extractOrderItems(email),
      isPrime: checkIsPrimeOrder(email),
      estimatedDelivery: extractEstimatedDelivery(email)
    };
  } catch (error) {
    log('Error processing Amazon email', { 
      error: error instanceof Error ? error.message : 'Unknown error',
      emailId: email.id 
    });
    return null;
  }
}

// Implementation of extraction functions...
function extractAmazonOrderId(email: EmailMessage): string | null {
  // Implementation...
  return null;
}

// Other extraction functions...
```

## Advanced Usage

### Force Token Refresh

```typescript
// Function to force token refresh for debugging
async function forceTokenRefresh() {
  try {
    const response = await fetch('/api/gmail/token-status', {
      method: 'POST'
    });
    
    const data = await response.json();
    
    console.log('Token refresh result:', {
      success: data.success,
      message: data.message,
      before: {
        expired: data.before.isTokenExpired,
        expiry: new Date(data.before.tokenExpiry)
      },
      after: {
        expired: data.after.isTokenExpired,
        expiry: new Date(data.after.tokenExpiry)
      }
    });
    
    return data;
  } catch (error) {
    console.error('Error forcing token refresh:', error);
    return { success: false, error: error.message };
  }
}
```

### Custom Email Query

```typescript
// Function to fetch emails with custom query
async function fetchEmails(query, options = {}) {
  try {
    const response = await fetch('/api/gmail/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        q: query,
        maxResults: options.maxResults || 10,
        onlyUnread: options.onlyUnread !== undefined ? options.onlyUnread : false,
        afterDate: options.afterDate ? options.afterDate.toISOString() : undefined,
        beforeDate: options.beforeDate ? options.beforeDate.toISOString() : undefined
      })
    });
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching emails:', error);
    throw error;
  }
}

// Example usage
async function findOrderEmails() {
  // Find order confirmation emails in the last 90 days
  const today = new Date();
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(today.getDate() - 90);
  
  const results = await fetchEmails(
    'subject:(order confirmation OR purchase OR receipt) -unsubscribe',
    {
      maxResults: 20,
      afterDate: ninetyDaysAgo,
      beforeDate: today
    }
  );
  
  console.log(`Found ${results.messages.length} order emails`);
  return results;
}
``` 