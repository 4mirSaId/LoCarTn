import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ agencyId: string }> }
) {
    const { agencyId } = await params;
    const authHeader = request.headers.get('authorization');
    const backendResponse = await fetch(`https://locartn.onrender.com/api/cars/agency/${agencyId}`, {
        method: 'GET',
        headers: {
            ...(authHeader ? { 'authorization': authHeader } : {}),
        },
    });
    const data = await backendResponse.json();
    return NextResponse.json(data, { status: backendResponse.status });
}