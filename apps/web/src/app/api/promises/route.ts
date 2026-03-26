import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export const dynamic = 'force-dynamic';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backend-elokantra.onrender.com';

/**
 * GET /api/promises
 * Proxy to Render Backend for candidate manifestos/promises.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const res = await axios.get(`${BACKEND_URL}/api/admin/promise?${searchParams.toString()}`);
    return NextResponse.json(res.data);
  } catch (err: any) {
    console.error('Promises proxy error:', err.message);
    return NextResponse.json({ success: false, error: err.response?.data?.error || 'Promises retrieval failed' }, { status: 502 });
  }
}
