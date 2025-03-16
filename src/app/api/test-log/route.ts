import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { log } from '@/lib/logger';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
  log('Test log - Starting database test');
  
  try {
    // Test database connection
    const userCount = await prisma.user.count();
    log('Database test - User count', { count: userCount });
    
    // Test session
    const session = await getServerSession(authOptions);
    log('Test session', { session });
    
    return NextResponse.json({ 
      message: 'Test completed', 
      userCount,
      hasSession: !!session
    });
  } catch (error) {
    log('Test error', { error });
    return NextResponse.json({ error: 'Test failed' }, { status: 500 });
  }
} 