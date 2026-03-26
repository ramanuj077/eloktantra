import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export const dynamic = 'force-dynamic';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backend-elokantra.onrender.com';

// GET /api/constituencies?electionId=
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const electionId = searchParams.get('electionId');

    // Proxy to backend
    const res = await axios.get(`${BACKEND_URL}/api/admin/constituency`, {
      params: electionId ? { electionId } : {},
      headers: {
        'x-admin-key': process.env.ADMIN_API_KEY || 'eLoktantra-AdminPortal-SecretKey-2024'
      }
    });

    const data = res.data;
    const list = Array.isArray(data) ? data : (data.constituencies || data.data || []);
    
    return NextResponse.json({ 
      success: true, 
      count: list.length, 
      constituencies: list.map((c: any) => ({ ...c, id: c.id || c._id?.toString() })) 
    });
  } catch (err: any) {
    console.error('Constituency proxy error:', err.message);
    return NextResponse.json({ success: false, error: 'Source of truth offline' }, { status: 502 });
  }
}
