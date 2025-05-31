import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(req: NextRequest) {
  const backendUrl = process.env.BACKEND_URL || 'https://locartn.onrender.com';
  const url = new URL(req.url);
  const agencyId = url.pathname.split('/').pop();
  // Prefer Authorization header, fallback to cookie
  const authHeader = req.headers.get('authorization');
  const token = req.cookies.get('token')?.value;
  const headers: Record<string, string> = {};
  if (authHeader) {
    headers['Authorization'] = authHeader;
  } else if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(`${backendUrl}/api/admin/agencies/${agencyId}`, {
    method: 'DELETE',
    headers,
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
