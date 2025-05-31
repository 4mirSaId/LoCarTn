import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const backendResponse = await fetch(`${process.env.BACKEND_URL || 'https://locartn.onrender.com'}/api/reservations/client`, {
    method: 'GET',
    headers: {
      ...(authHeader ? { authorization: authHeader } : {}),
    },
  });
  const data = await backendResponse.json();
  return NextResponse.json(data, { status: backendResponse.status });
}
