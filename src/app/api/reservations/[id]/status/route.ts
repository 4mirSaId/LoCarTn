import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  console.log('PATCH proxy hit for reservationId:', params);
  const { id } = await params;
  const authHeader = request.headers.get('authorization');
  const body = await request.json();
  const backendResponse = await fetch(`${process.env.BACKEND_URL || 'https://locartn.onrender.com'}/api/reservations/${id}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...(authHeader ? { authorization: authHeader } : {}),
    },
    body: JSON.stringify(body),
  });
  const data = await backendResponse.json();
  return NextResponse.json(data, { status: backendResponse.status });
}
