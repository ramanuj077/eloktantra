import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export const dynamic = 'force-dynamic';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backend-elokantra.onrender.com';

/**
 * GET /api/dashboard — aggregated stats for the dashboard from Render backend.
 */
export async function GET() {
  try {
    const res = await axios.get(`${BACKEND_URL}/api/dashboard`, {
        timeout: 90000 // 90s timeout (Extreme for Render cold-starts)
    });
    return NextResponse.json(res.data);
  } catch (err: any) {
    console.error('Dashboard proxy error:', err.message);
    return NextResponse.json({ success: false, error: err.response?.data?.error || 'Dashboard stats failed' }, { status: 502 });
  }
}
