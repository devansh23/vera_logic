import { NextRequest, NextResponse } from 'next/server';

// This middleware forwards requests to the appropriate API routes
export async function GET(req: NextRequest) {
  // Extract the path from the request
  const path = req.nextUrl.pathname;
  
  // Forward to appropriate endpoints based on the path
  if (path === '/api/wardrobe') {
    const wardrobe = await import('./wardrobe/route');
    return wardrobe.GET(req);
  }

  // Default 404 response
  return NextResponse.json({ error: 'API endpoint not found' }, { status: 404 });
}

// Handle POST requests similarly
export async function POST(req: NextRequest) {
  const path = req.nextUrl.pathname;
  
  if (path === '/api/wardrobe') {
    const wardrobe = await import('./wardrobe/route');
    return wardrobe.POST(req);
  }
  
  return NextResponse.json({ error: 'API endpoint not found' }, { status: 404 });
}

// Handle DELETE requests similarly
export async function DELETE(req: NextRequest) {
  const path = req.nextUrl.pathname;
  
  if (path === '/api/wardrobe') {
    const wardrobe = await import('./wardrobe/route');
    return wardrobe.DELETE(req);
  }
  
  return NextResponse.json({ error: 'API endpoint not found' }, { status: 404 });
} 