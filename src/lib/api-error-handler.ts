import { NextRequest, NextResponse } from 'next/server';
import { log } from './logger';

// Custom API error class that includes status code and optional context
export class ApiError extends Error {
  status: number;
  context?: Record<string, unknown>;

  constructor(message: string, status: number = 500, context?: Record<string, unknown>) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.context = context;
  }
}

// Standard error response format
interface ErrorResponse {
  success: false;
  error: string;
  details?: string;
  context?: Record<string, unknown>;
  code?: string;
}

/**
 * Creates a standardized error response
 */
export function createErrorResponse(
  error: Error | ApiError | unknown,
  status: number = 500,
  includeDetails: boolean = process.env.NODE_ENV !== 'production'
): NextResponse<ErrorResponse> {
  // Default error message for production to avoid leaking sensitive information
  let errorMessage = 'An unexpected error occurred';
  let errorStatus = status;
  let errorDetails: string | undefined = undefined;
  let errorContext: Record<string, unknown> | undefined = undefined;
  let errorCode: string | undefined = undefined;

  // Handle different error types
  if (error instanceof ApiError) {
    errorMessage = error.message;
    errorStatus = error.status;
    errorContext = error.context;
  } else if (error instanceof Error) {
    errorMessage = error.message;
    errorDetails = error.stack;
    // Extract error code if present (e.g., ECONNREFUSED, PRISMA_ERROR, etc.)
    errorCode = (error as unknown as Record<string, unknown>).code as string;
  } else if (typeof error === 'string') {
    errorMessage = error;
  }

  // Log the error
  log('API Error', {
    message: errorMessage,
    status: errorStatus,
    details: errorDetails,
    context: errorContext,
    code: errorCode,
  });

  // Create the response object
  const response: ErrorResponse = {
    success: false,
    error: errorMessage,
  };

  // Only include these fields if they exist and details are allowed
  if (includeDetails && errorDetails) {
    response.details = errorDetails;
  }

  if (errorContext) {
    response.context = errorContext;
  }

  if (errorCode) {
    response.code = errorCode;
  }

  return NextResponse.json(response, { status: errorStatus });
}

/**
 * API route handler wrapper to standardize error handling
 * @param handler The API route handler function to wrap
 * @returns A wrapped handler with standardized error handling
 */
export function withErrorHandler(
  handler: (req: NextRequest, params?: Record<string, unknown>) => Promise<NextResponse>
) {
  return async (req: NextRequest, params?: Record<string, unknown>): Promise<NextResponse> => {
    try {
      return await handler(req, params);
    } catch (error) {
      return createErrorResponse(error);
    }
  };
}

/**
 * Validates a condition and throws an ApiError if false
 */
export function validateOrThrow(
  condition: boolean,
  message: string,
  status: number = 400,
  context?: Record<string, unknown>
): void {
  if (!condition) {
    throw new ApiError(message, status, context);
  }
}

/**
 * Throws a 404 Not Found error
 */
export function throwNotFound(message: string = 'Resource not found', context?: Record<string, unknown>): never {
  throw new ApiError(message, 404, context);
}

/**
 * Throws a 401 Unauthorized error
 */
export function throwUnauthorized(message: string = 'Unauthorized', context?: Record<string, unknown>): never {
  throw new ApiError(message, 401, context);
}

/**
 * Throws a 403 Forbidden error
 */
export function throwForbidden(message: string = 'Forbidden', context?: Record<string, unknown>): never {
  throw new ApiError(message, 403, context);
} 