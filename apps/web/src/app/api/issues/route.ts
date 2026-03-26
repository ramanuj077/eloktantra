import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export const dynamic = 'force-dynamic';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backend-elokantra.onrender.com';

// GET /api/issues -> Fetch from Render
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const electionId = searchParams.get('electionId');
    const constituencyId = searchParams.get('constituencyId');

    const res = await axios.get(`${BACKEND_URL}/api/admin/issue`, {
        params: { electionId, constituencyId },
        headers: {
            'x-admin-key': process.env.ADMIN_API_KEY || 'eLoktantra-AdminPortal-SecretKey-2024'
        }
    });

    const data = res.data;
    const list = Array.isArray(data) ? data : (data.issues || data.data || []);
    
    return NextResponse.json({ 
      success: true, 
      count: list.length, 
      issues: list.map((i: any) => ({ ...i, id: i.id || i._id?.toString() })) 
    });
  } catch (err: any) {
    console.error('Issue proxy GET error:', err.message);
    return NextResponse.json({ success: false, error: 'Source of truth offline' }, { status: 502 });
  }
}

// POST /api/issues -> Create in Render
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const res = await axios.post(`${BACKEND_URL}/api/admin/issue`, body, {
        headers: {
            'x-admin-key': process.env.ADMIN_API_KEY || 'eLoktantra-AdminPortal-SecretKey-2024'
        }
    });

    return NextResponse.json(res.data, { status: 201 });
  } catch (err: any) {
    console.error('Issue proxy POST error:', err.message);
    return NextResponse.json({ success: false, error: 'Failed to record grievance' }, { status: 502 });
  }
}
