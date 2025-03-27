import { NextRequest, NextResponse } from 'next/server';
import { 
  withErrorHandler, 
  ApiError, 
  throwUnauthorized, 
  throwNotFound, 
  throwForbidden, 
  validateOrThrow 
} from '@/lib/api-error-handler';
import { log } from '@/lib/logger';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

/**
 * Error testing handler implementation
 * This route is used to test different types of errors and how they're handled
 */
async function testErrorHandler(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const errorType = searchParams.get('type') || 'none';
  
  // Log the request
  log('Testing error handler', { errorType });
  
  // Handle different error types for testing
  switch (errorType) {
    case 'none':
      // No error, return success
      return NextResponse.json({ 
        success: true, 
        message: 'No error occurred', 
        errorType 
      });
      
    case 'not-found':
      // 404 Not Found error
      throwNotFound('Resource not found', { resourceType: 'test-resource' });
      
    case 'unauthorized':
      // 401 Unauthorized error
      throwUnauthorized('Authentication required to access this resource');
      
    case 'forbidden':
      // 403 Forbidden error
      throwForbidden('You do not have permission to access this resource');
      
    case 'validation':
      // 400 Bad Request error
      validateOrThrow(false, 'Validation failed: Missing required fields', 400, { 
        fields: ['name', 'email']
      });
      
    case 'custom':
      // Custom API error with specific status code
      throw new ApiError('Custom error message', 422, { 
        reason: 'Custom error for testing',
        documentation: 'https://example.com/errors/custom'
      });
      
    case 'prisma':
      // Simulate a Prisma error
      throw new PrismaClientKnownRequestError(
        'Record not found',
        {
          code: 'P2025',
          clientVersion: '5.0.0',
        }
      );
      
    case 'standard':
      // Standard JavaScript error
      throw new Error('Standard JavaScript error');
      
    case 'promise':
      // Promise rejection
      await Promise.reject(new Error('Promise was rejected'));
      return NextResponse.json({}); // Never reached
      
    case 'timeout':
      // Simulate a timeout error
      throw new Error('Request timeout');
      
    default:
      // Unknown error type
      throw new ApiError(`Unknown error type: ${errorType}`, 400, { 
        validTypes: [
          'none', 'not-found', 'unauthorized', 'forbidden',
          'validation', 'custom', 'prisma', 'standard', 
          'promise', 'timeout'
        ]
      });
  }
}

export const GET = withErrorHandler(testErrorHandler); 