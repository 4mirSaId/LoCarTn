import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { agencyId: string } }) {
  const { agencyId } = params;
  const authHeader = request.headers.get('authorization');
  const backendResponse = await fetch(`http://localhost:7000/api/admin/agencies/${agencyId}/cars`, {
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
  return NextResponse.json(data, { status: backendResponse.status });
}
