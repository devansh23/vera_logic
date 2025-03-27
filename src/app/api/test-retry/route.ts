import { NextRequest, NextResponse } from 'next/server';
import { withErrorHandler, ApiError } from '@/lib/api-error-handler';
import { withRetry, MAX_RETRIES } from '@/lib/retry-utils';
import { log } from '@/lib/logger';

// Counter to track the number of calls made to the endpoint
let callCounter = 0;

// Counter to track the number of retries for each request (mapped by requestId)
const retryCounters: Record<string, number> = {};

/**
 * Simulate a flaky API call with different failure scenarios
 * This is useful for testing our retry mechanism
 */
async function testRetryHandler(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const scenarioParam = searchParams.get('scenario') || 'success';
  const requestId = searchParams.get('id') || Date.now().toString();
  
  // Initialize or increment retry counter for this request
  if (!retryCounters[requestId]) {
    retryCounters[requestId] = 0;
  } else {
    retryCounters[requestId]++;
  }
  
  // Increment the global call counter
  callCounter++;
  
  // Get current retry count for this request
  const retryCount = retryCounters[requestId];
  
  // Log the attempt
  log('Test retry handler called', {
    scenario: scenarioParam,
    requestId,
    retryCount,
    globalCallCount: callCounter
  });
  
  // Handle different scenarios
  try {
    const result = await withRetry(
      async () => {
        // Simulate different failure scenarios
        switch (scenarioParam) {
          case 'success':
            // Always succeed
            return { success: true, message: 'Operation successful' };
            
          case 'fail-once':
            // Fail on the first attempt, succeed on retry
            if (retryCount === 0) {
              throw new Error('Simulated failure (will succeed on retry)');
            }
            return { 
              success: true, 
              message: 'Operation successful after retry',
              retryCount 
            };
            
          case 'fail-twice':
            // Fail on the first two attempts, succeed on third
            if (retryCount < 2) {
              throw new Error(`Simulated failure ${retryCount + 1} (will succeed after 2 retries)`);
            }
            return { 
              success: true, 
              message: 'Operation successful after 2 retries',
              retryCount 
            };
            
          case 'timeout':
            // Simulate a timeout
            await new Promise(resolve => setTimeout(resolve, 200));
            if (retryCount < 1) {
              throw new Error('Request timeout');
            }
            return { 
              success: true, 
              message: 'Operation successful after timeout',
              retryCount 
            };
            
          case 'network-error':
            // Simulate a network error
            if (retryCount < 1) {
              const networkError = new Error('Network error: connection reset');
              (networkError as any).code = 'ECONNRESET';
              throw networkError;
            }
            return { 
              success: true, 
              message: 'Operation successful after network error',
              retryCount 
            };
            
          case 'rate-limit':
            // Simulate rate limiting
            if (retryCount < 2) {
              const rateLimitError = new Error('Rate limit exceeded');
              (rateLimitError as any).status = 429;
              throw rateLimitError;
            }
            return { 
              success: true, 
              message: 'Operation successful after rate limit',
              retryCount 
            };
            
          case 'permanent-failure':
            // Always fail with a non-retryable error
            throw new ApiError('Permanent failure', 400, { nonRetryable: true });
            
          case 'retry-exhaustion':
            // Always fail, but with a retryable error
            throw new Error(`Failure attempt ${retryCount + 1}`);
            
          default:
            return { 
              success: true, 
              message: 'Unknown scenario, defaulting to success',
              scenario: scenarioParam 
            };
        }
      },
      {
        maxRetries: MAX_RETRIES,
        context: { scenario: scenarioParam, requestId },
        onRetry: (error, attempt, delay) => {
          log('Retry in test scenario', {
            attempt,
            delay,
            error: error instanceof Error ? error.message : 'Unknown error',
            scenario: scenarioParam,
            requestId
          });
        }
      }
    );
    
    // If we get here, the operation succeeded (possibly after retries)
    return NextResponse.json({
      success: true,
      scenario: scenarioParam,
      requestId,
      result,
      retryCount,
      totalCalls: callCounter
    });
  } catch (error) {
    // If we get here, all retries failed or the error was non-retryable
    log('All retries failed or non-retryable error', {
      error,
      scenario: scenarioParam,
      requestId,
      retryCount
    });
    
    // Clean up the retry counter for this request
    delete retryCounters[requestId];
    
    if (error instanceof ApiError) {
      throw error;
    }
    
    throw new ApiError(
      `Retry test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      500,
      { scenario: scenarioParam, requestId, retryCount }
    );
  }
}

// Configure for Node.js runtime
export const runtime = 'nodejs';

// GET /api/test-retry - Test the retry mechanism
export const GET = withErrorHandler(testRetryHandler); 