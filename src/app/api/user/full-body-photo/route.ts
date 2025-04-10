import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const photo = formData.get('photo') as File | null;

    if (!photo) {
      return NextResponse.json(
        { error: 'No photo provided' },
        { status: 400 }
      );
    }

    // Convert the photo to base64
    const buffer = await photo.arrayBuffer();
    const base64Photo = `data:${photo.type};base64,${Buffer.from(buffer).toString('base64')}`;

    // Update the user's full body photo
    await prisma.user.update({
      where: { id: session.user.id },
      data: { fullBodyPhoto: base64Photo }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error uploading full body photo:', error);
    return NextResponse.json(
      { error: 'Failed to upload photo' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { fullBodyPhoto: true }
    });

    return NextResponse.json({ fullBodyPhoto: user?.fullBodyPhoto });
  } catch (error) {
    console.error('Error fetching full body photo:', error);
    return NextResponse.json(
      { error: 'Failed to fetch photo' },
      { status: 500 }
    );
  }
} 