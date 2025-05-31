import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest, context: { params: Promise<{ carId: string }> }) {
    const { carId } = await context.params;
    const authHeader = request.headers.get('authorization');
    const contentType = request.headers.get('content-type') || '';

    let body: string | FormData;
    const headers: Record<string, string> = {
        ...(authHeader ? { 'authorization': authHeader } : {}),
    };

    if (contentType.includes('application/json')) {
        body = await request.text();
        headers['content-type'] = 'application/json';
    } else if (contentType.includes('multipart/form-data') || contentType.includes('application/x-www-form-urlencoded')) {
        body = await request.formData();
        // fetch will handle content-type for formData
    } else {
        return NextResponse.json({ error: 'Unsupported Content-Type' }, { status: 400 });
    }

    const backendResponse = await fetch(`http://localhost:7000/api/cars/${carId}/price`, {
        method: 'PATCH',
        body,
        headers,
    });
    const data = await backendResponse.json();
    return NextResponse.json(data, { status: backendResponse.status });
}
