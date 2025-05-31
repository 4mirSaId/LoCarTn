import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const backendResponse = await fetch('https://locartn.onrender.com/api/admin/agencies', {
    method: 'GET',
    headers: {
      ...(authHeader ? { 'authorization': authHeader } : {}),
    },
  });
  const contentType = backendResponse.headers.get('content-type');
  let data;
  if (contentType && contentType.includes('application/json')) {
    data = await backendResponse.json();
  } else {
    data = { error: await backendResponse.text() };
  }
  // Debug log for backend response
  console.log('[API ROUTE] GET /api/admin/agencies status:', backendResponse.status, 'data:', data);
  return NextResponse.json(data, { status: backendResponse.status });
}
