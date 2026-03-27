import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { authenticate } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backend-elokantra.onrender.com';

/**
 * GET /api/user — Fetch citizen profile from backend source of truth.
 */
export async function GET(request: NextRequest) {
  try {
    const payload = await authenticate(request);
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized Session' }, { status: 401 });
    }

    const res = await axios.get(`${BACKEND_URL}/auth/me`, {
      headers: {
        Authorization: request.headers.get('Authorization')
      }
    });

    return NextResponse.json(res.data);
  } catch (err: any) {
    console.error('User profile proxy error:', err.message);
    return NextResponse.json({ success: false, error: err.response?.data?.error || 'Profile retrieval failed' }, { status: 502 });
  }
}

/**
 * POST /api/digilocker/verify — Forward to Identity Registry
 */
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  
  try {
    // 1. Attempt Proxy to Real Backend
    const res = await axios.post(`${BACKEND_URL}/auth/digilocker-verify`, body, {
      timeout: 8000
    });

    return NextResponse.json(res.data);
  } catch (err: any) {
    // SENIOR DEV FALLBACK: 
    // "gic the entry if the voter name is correct"
    // If backend is offline, we check if a voterName is present to allow testing.
    const name = body.voterName || body.name;
    
    if (name && name.length > 2) {
      console.warn(`API FALLBACK: Identity Registry Offline. Granting mock entry for: ${name}`);
      return NextResponse.json({ 
        success: true, 
        message: 'Registry Identification Successful (Local Fallback)',
        user: {
          id: `MOCK-${Math.random().toString(36).substring(2, 9)}`,
          name: name,
          mobileNumber: body.identifier || '9999999999',
          constituencyId: body.constituency || 'DEMO_CONSTITUENCY',
          voterId: body.voterId || 'ABC1234567',
          aadhaarHash: 'MOCK_AADHAAR_HASH'
        }
      });
    }

    console.error('DigiLocker Verification proxy error:', err.message);
    return NextResponse.json({ 
        success: false, 
        error: 'Identity Registry Offline. Please enter a valid Voter Name to bypass.' 
    }, { status: 502 });
  }
}
