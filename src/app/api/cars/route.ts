import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {
    const formData = await request.formData();
    const authHeader = request.headers.get('authorization');
    const backendResponse = await fetch(`https://locartn.onrender.com/api/cars`, {
        method: 'POST',
        body: formData,
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

export async function GET() {
    const backendResponse = await fetch(`https://locartn.onrender.com/api/cars`, {
        method: 'GET',
    });
    const data = await backendResponse.json();
    return new Response(JSON.stringify(data), {
        status: backendResponse.status,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}
