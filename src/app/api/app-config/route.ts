import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET() {
  const raw = process.env.ONBOARDING_THRESHOLD;
  let onboardingThreshold = 10;
  if (raw) {
    const parsed = parseInt(raw, 10);
    if (!Number.isNaN(parsed) && parsed > 0) onboardingThreshold = parsed;
  }
  return NextResponse.json({ onboardingThreshold });
} 