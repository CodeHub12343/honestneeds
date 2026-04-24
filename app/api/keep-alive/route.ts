import { NextRequest, NextResponse } from 'next/server';

/**
 * Keep-alive endpoint for Render.com free tier
 * Prevents instance spin-down after 15 minutes of inactivity
 * 
 * Usage: Ping this endpoint every 10-14 minutes from a cron service
 * Example cron job:
 *   curl https://your-app.onrender.com/api/keep-alive
 * 
 * Free cron services:
 *   - https://cron-job.org
 *   - https://www.easycron.com
 *   - https://cronhub.io (has free tier)
 */

export async function GET(request: NextRequest) {
  try {
    const timestamp = new Date().toISOString();
    
    return NextResponse.json(
      {
        status: 'alive',
        timestamp,
        message: 'Instance is active and responsive',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Keep-alive endpoint error:', error);
    
    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        message: 'Keep-alive check failed',
      },
      { status: 500 }
    );
  }
}

export async function HEAD(request: NextRequest) {
  // HEAD request for lightweight health checks
  return new NextResponse(null, { status: 200 });
}
