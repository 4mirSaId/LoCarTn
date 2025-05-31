import { NextRequest, NextResponse } from 'next/server';
import axios from '@/../axios';

export async function GET(req: NextRequest) {
  try {
    // Forward the Authorization header or fallback to token cookie
    const authHeader = req.headers.get('authorization');
    let token = authHeader?.replace('Bearer ', '');
    if (!token) {
      const cookie = req.cookies.get('token');
      token = cookie?.value;
    }
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const backendRes = await axios.get(
      `${process.env.BACKEND_URL || 'http://localhost:7000'}/api/admin/reservations`,
      {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      }
    );
    return NextResponse.json(backendRes.data);
  } catch (error) {
    const err = error as { response?: { status?: number; data?: { message?: string } }; message?: string };
    const status = err.response?.status || 500;
    const message = err.response?.data?.message || err.message || 'Error fetching reservations';
    return NextResponse.json({ message }, { status });
  }
}
