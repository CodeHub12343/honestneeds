import { NextResponse } from 'next/server';

/**
 * Ultra-minimal keep-alive endpoint for Render.com free tier
 * Prevents instance spin-down after 15 minutes of inactivity
 */

export const GET = () => {
  return NextResponse.json(
    { ok: true, timestamp: new Date().toISOString() },
    { status: 200 }
  );
};

export const HEAD = () => {
  return new NextResponse(null, { status: 200 });
};
