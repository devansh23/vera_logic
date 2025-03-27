# API Error Handler for Vera

This utility provides standardized error handling for Vera's API routes. It helps maintain consistent error responses across the application and improves error logging and debugging.

## Features

- Standardized error response format
- Consistent HTTP status codes
- Comprehensive error logging
- Type-safe error handling
- Helper utilities for common errors

## Usage

### Basic Usage

Wrap your API route handler with `withErrorHandler`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { withErrorHandler } from '@/lib/api-error-handler';

async function myRouteHandler(request: NextRequest) {
  // Your route logic here
  return NextResponse.json({ success: true, data: 'some data' });
}

export const GET = withErrorHandler(myRouteHandler);
```

### Throwing Custom Errors

Use the `ApiError` class for custom errors:

```typescript
import { ApiError } from '@/lib/api-error-handler';

function someFunction() {
  // Logic that might fail
  if (errorCondition) {
    throw new ApiError('Descriptive error message', 400, { 
      additionalContext: 'Some context'
    });
  }
}
```

### Helper Functions

The library provides several helper functions for common error scenarios:

#### 1. `validateOrThrow`

Validates a condition and throws an error if it fails:

```typescript
import { validateOrThrow } from '@/lib/api-error-handler';

// Check if a required parameter exists
validateOrThrow(!!userId, 'User ID is required', 400);
```

#### 2. `throwNotFound`

Throws a 404 Not Found error:

```typescript
import { throwNotFound } from '@/lib/api-error-handler';

const user = await prisma.user.findUnique({ where: { id: userId } });
if (!user) {
  throwNotFound('User not found', { userId });
}
```

#### 3. `throwUnauthorized`

Throws a 401 Unauthorized error:

```typescript
import { throwUnauthorized } from '@/lib/api-error-handler';

if (!session?.user) {
  throwUnauthorized('User must be logged in');
}
```

#### 4. `throwForbidden`

Throws a 403 Forbidden error:

```typescript
import { throwForbidden } from '@/lib/api-error-handler';

if (!userHasPermission) {
  throwForbidden('User does not have permission', { requiredRole: 'admin' });
}
```

## Response Format

All error responses follow this format:

```json
{
  "success": false,
  "error": "Error message",
  "details": "Detailed error information (only in non-production)",
  "context": { "additional": "context" },
  "code": "ERROR_CODE"
}
```

## Testing

You can test the error handler by visiting:

`/api/test-error-handler?type=error-type`

Where `error-type` is one of:
- `none` - Success response
- `not-found` - 404 Not Found error
- `unauthorized` - 401 Unauthorized error
- `forbidden` - 403 Forbidden error
- `validation` - 400 Bad Request error
- `custom` - Custom error with status 422
- `prisma` - Simulated Prisma database error
- `standard` - Standard JavaScript error
- `promise` - Promise rejection error
- `timeout` - Request timeout error

## Implementation Details

The error handler wraps route handlers with a try/catch block and formats errors using `createErrorResponse`. Different error types are handled appropriately:

- `ApiError` - Uses the status and context from the error
- `Error` - Uses the message and stack, with a default 500 status
- Other - Converts to a string message with a default 500 status

In production, detailed error stacks are not included in responses to avoid leaking sensitive information. 

const searchQuery = retailer.toLowerCase() === 'myntra'
  ? 'from:myntra.com OR subject:myntra'
  : 'from:hm.com OR from:delivery.hm.com OR subject:H&M'; 