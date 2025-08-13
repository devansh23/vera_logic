import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * POST /api/user/update-existing-users - Update existing users' onboarding status
 * This is a temporary endpoint to fix existing users
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Only allow admin users (you can modify this check)
    if (!session?.user?.email || !session.user.email.includes('dev.devanshchaudhary@gmail.com')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Update all existing users to have onboarding completed
    const result = await prisma.user.updateMany({
      where: {
        onboardingCompleted: false,
      },
      data: {
        onboardingCompleted: true,
      },
    });
    
    return NextResponse.json({
      success: true,
      message: `Updated ${result.count} users`,
      count: result.count,
    });
  } catch (error) {
    console.error('Error updating existing users:', error);
    return NextResponse.json(
      { error: 'Failed to update existing users' },
      { status: 500 }
    );
  }
} 