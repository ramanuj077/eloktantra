import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export const dynamic = 'force-dynamic';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backend-elokantra.onrender.com';

/**
 * GET /api/election/active
 * Used by the Dashboard to show the current election context.
 */
export async function GET() {
  try {
    const res = await axios.get(`${BACKEND_URL}/api/elections/active`);
    return NextResponse.json(res.data);
  } catch (err: any) {
    return NextResponse.json({ 
        success: false, 
        error: err.response?.data?.error || err.message || 'No active election found' 
    }, { status: 502 });
  }
}
