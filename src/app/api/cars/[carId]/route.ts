import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest, { params }: { params: { carId: string } }) {
    const { carId } = params;
    const authHeader = request.headers.get('authorization');
    const backendResponse = await fetch(`http://localhost:7000/api/cars/${carId}`, {
        method: 'DELETE',
        headers: {
            ...(authHeader ? { 'authorization': authHeader } : {}),
        },
    });
    const data = await backendResponse.json();
    return NextResponse.json(data, { status: backendResponse.status });
}
