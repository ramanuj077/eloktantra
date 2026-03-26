import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export const dynamic = 'force-dynamic';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backend-elokantra.onrender.com';

// GET /api/manifestos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const electionId = searchParams.get('electionId');
    const constituencyId = searchParams.get('constituencyId');
    const candidateId = searchParams.get('candidateId');
    
    // Manual mapping for hierarchy consistency in frontend
    const res = await axios.get(`${BACKEND_URL}/api/admin/manifesto`, {
      params: { electionId, constituencyId, candidateId },
      headers: {
        'x-admin-key': process.env.ADMIN_API_KEY || 'eLoktantra-AdminPortal-SecretKey-2024'
      }
    });

    const data = res.data;
    const list = Array.isArray(data) ? data : (data.manifestos || data.data || []);
    
    return NextResponse.json({ 
      success: true, 
      count: list.length, 
      manifestos: list.map((m: any) => ({ ...m, id: m.id || m._id?.toString() })) 
    });
  } catch (err: any) {
    console.error('Manifesto proxy error:', err.message);
    return NextResponse.json({ success: false, error: 'Source of truth offline' }, { status: 502 });
  }
}
