import { log } from './logger';
import { ApiError } from './api-error-handler';

// Maximum number of retry attempts
export const MAX_RETRIES = 3;

// Base delay in milliseconds between retries (will be multiplied by 2^attempt for exponential backoff)
export const BASE_DELAY = 1000;

// List of error status codes or messages that should not be retried
// For example, authentication errors, permission errors, or validation errors
export const NON_RETRYABLE_ERRORS = [
  401, // Unauthorized
  403, // Forbidden
  404, // Not found
  422, // Unprocessable entity
  'Invalid credentials',
  'Invalid token',
  'Permission denied',
  'User not found',
  'Resource not found',
  'Validation failed',
  'Quota exceeded', // Don't retry quota exceeded to avoid making things worse
];

/**
 * Check if an error is retryable based on its type and content
 */
export function isRetryableError(error: unknown): boolean {
  // If it's an API error, check its status code
  if (error instanceof ApiError) {
    // Don't retry if status code is in non-retryable list
    if (NON_RETRYABLE_ERRORS.includes(error.status)) {
      return false;
    }
    
    // Don't retry if error message contains any non-retryable phrases
    for (const phrase of NON_RETRYABLE_ERRORS) {
      if (typeof phrase === 'string' && error.message.includes(phrase)) {
        return false;
      }
    }
    
    // Otherwise, retry server errors (5xx) and some client errors that might be transient
    return error.status >= 500 || [408, 429].includes(error.status);
  }
  
  // For standard errors, check if they're network related or timeouts
  if (error instanceof Error) {
    const errorMsg = error.message.toLowerCase();
    
    // Don't retry if error message contains any non-retryable phrases
    for (const phrase of NON_RETRYABLE_ERRORS) {
      if (typeof phrase === 'string' && errorMsg.includes(phrase.toLowerCase())) {
        return false;
      }
    }
    
    // Retry network errors, timeouts, or rate limits
    return (
      errorMsg.includes('network') ||
      errorMsg.includes('timeout') ||
      errorMsg.includes('econnreset') ||
      errorMsg.includes('econnrefused') ||
      errorMsg.includes('rate limit') ||
      errorMsg.includes('too many requests')
    );
  }
  
  // By default, retry unknown errors (might be transient)
  return true;
}

/**
 * Calculate the delay for the next retry attempt using exponential backoff
 * with a small amount of random jitter to avoid thundering herd problem
 */
export function calculateBackoff(attempt: number, baseDelay: number = BASE_DELAY): number {
  // Exponential backoff: baseDelay * 2^attempt
  const exponentialDelay = baseDelay * Math.pow(2, attempt);
  
  // Add a small amount of random jitter (±10%)
  const jitter = exponentialDelay * 0.1 * (Math.random() * 2 - 1);
  
  return Math.floor(exponentialDelay + jitter);
}

/**
 * Retry a function with exponential backoff
 * 
 * @param fn The function to retry
 * @param options Retry options
 * @returns The result of the function
 * @throws The last error encountered if all retries fail
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number;
    baseDelay?: number;
    retryCondition?: (error: unknown) => boolean;
    onRetry?: (error: unknown, attempt: number, delay: number) => void;
    context?: Record<string, any>;
  } = {}
): Promise<T> {
  const maxRetries = options.maxRetries ?? MAX_RETRIES;
  const baseDelay = options.baseDelay ?? BASE_DELAY;
  const retryCondition = options.retryCondition ?? isRetryableError;
  const context = options.context ?? {};
  
  let lastError: unknown;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // Don't retry if we've reached max attempts or the error isn't retryable
      if (attempt >= maxRetries || !retryCondition(error)) {
        log('Retry failed permanently', { 
          error, 
          attempt, 
          maxRetries, 
          retryable: attempt < maxRetries ? !retryCondition(error) : false,
          context 
        });
        throw error;
      }
      
      // Calculate backoff delay with exponential backoff
      const delay = calculateBackoff(attempt, baseDelay);
      
      // Log retry attempt
      log('Retrying operation after error', { 
        error, 
        attempt: attempt + 1, 
        maxRetries, 
        delay,
        context 
      });
      
      // Call onRetry callback if provided
      if (options.onRetry) {
        options.onRetry(error, attempt + 1, delay);
      }
      
      // Wait for the backoff delay
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  // This should not be reached due to the throw in the loop,
  // but TypeScript needs it for type safety
  throw lastError;
} 