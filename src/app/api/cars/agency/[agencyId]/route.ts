import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: { agencyId: string } }
) {
    const { agencyId } = await params;
    const authHeader = request.headers.get('authorization');
    const backendResponse = await fetch(`http://localhost:7000/api/cars/agency/${agencyId}`, {
        method: 'GET',
        headers: {
            ...(authHeader ? { 'authorization': authHeader } : {}),
        },
    });
    const data = await backendResponse.json();
    return NextResponse.json(data, { status: backendResponse.status });
}