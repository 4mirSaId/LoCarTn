// src/app/api/auth/register/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { name, email, password, role, agencyName, licenseNumber, phone } = await request.json();

  
  if (!email || !password || !name || !phone) {
    return NextResponse.json(
      { message: 'Missing required fields' },
      { status: 400 }
    );
  }

  
  const userExists = false;

  if (userExists) {
    return NextResponse.json(
      { message: 'User already exists with this email' },
      { status: 400 }
    );
  }

  // For agency registration
  if (role === 'AGENCY' && (!agencyName || !licenseNumber)) {
    return NextResponse.json(
      { message: 'Agency name and license number are required' },
      { status: 400 }
    );
  }



  return NextResponse.json(
    { success: true, message: 'Registration successful' },
    { status: 201 }
  );
}