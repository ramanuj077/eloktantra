import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export const dynamic = 'force-dynamic';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backend-elokantra.onrender.com';

// GET /api/elections
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('active') === 'true'; // Change default to show all

    // Call the centralized backend election endpoint (using admin route for full view)
    const res = await axios.get(`${BACKEND_URL}/api/admin/election`, {
      headers: {
        'x-admin-key': process.env.ADMIN_API_KEY || 'eLoktantra-AdminPortal-SecretKey-2024'
      },
      timeout: 120000 // 120s timeout (Max for Render cold-starts)
    });

    const data = res.data;
    let elections = Array.isArray(data) ? data : (data.elections || data.data || []);

    // Filter logic using the backend 'status' field
    if (activeOnly) {
      elections = elections.filter((e: any) => e.status === 'ACTIVE');
    }

    // Normalize for frontend
    const normalized = elections.map((e: any) => ({ 
      ...e, 
      id: e.id || e._id?.toString(),
      title: e.title || e.name || 'Untitled',
      isActive: e.status === 'ACTIVE'
    }));

    return NextResponse.json({ success: true, count: normalized.length, elections: normalized });
  } catch (err: any) {
    console.error('Election proxy error:', err.message);
    return NextResponse.json({ success: false, error: 'Source of truth offline' }, { status: 502 });
  }
}
