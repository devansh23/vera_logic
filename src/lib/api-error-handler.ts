import { NextRequest, NextResponse } from 'next/server';
import { log } from './logger';

// Custom API error class that includes status code and optional context
export class ApiError extends Error {
  status: number;
  context?: Record<string, any>;

  constructor(message: string, status: number = 500, context?: Record<string, any>) {
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
  context?: Record<string, any>;
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
  let errorContext: Record<string, any> | undefined = undefined;
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
    errorCode = (error as any).code;
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
  handler: (req: NextRequest, params?: any) => Promise<NextResponse>
) {
  return async (req: NextRequest, params?: any): Promise<NextResponse> => {
    try {
      return await handler(req, params);
    } catch (error) {
      return createErrorResponse(error);
    }
  };
}

/**
 * Helper function to handle common validation errors
 * @param condition Condition to validate
 * @param message Error message if validation fails
 * @param status HTTP status code to return
 * @param context Additional context to include in the error
 * @throws ApiError if validation fails
 */
export function validateOrThrow(
  condition: boolean,
  message: string,
  status: number = 400,
  context?: Record<string, any>
): void {
  if (!condition) {
    throw new ApiError(message, status, context);
  }
}

/**
 * Helper function to handle not found errors
 * @param message Error message
 * @param context Additional context to include in the error
 * @throws ApiError with 404 status
 */
export function throwNotFound(message: string = 'Resource not found', context?: Record<string, any>): never {
  throw new ApiError(message, 404, context);
}

/**
 * Helper function to handle unauthorized errors
 * @param message Error message
 * @param context Additional context to include in the error
 * @throws ApiError with 401 status
 */
export function throwUnauthorized(message: string = 'Unauthorized', context?: Record<string, any>): never {
  throw new ApiError(message, 401, context);
}

/**
 * Helper function to handle forbidden errors
 * @param message Error message
 * @param context Additional context to include in the error
 * @throws ApiError with 403 status
 */
export function throwForbidden(message: string = 'Forbidden', context?: Record<string, any>): never {
  throw new ApiError(message, 403, context);
} 