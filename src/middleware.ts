import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This middleware runs on all requests
export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Log API requests for debugging purposes
  if (path.startsWith('/api/')) {
    console.log(`Middleware intercepted API request to: ${path}`);
  }
  
  // Continue with the request normally
  return NextResponse.next();
}

// Specify which paths this middleware should run on
export const config = {
  matcher: [
    // Match API routes
    '/api/:path*',
  ],
}; 