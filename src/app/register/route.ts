// src/app/api/auth/register/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { name, email, password, role, agencyName, licenseNumber } = await request.json();

  // Replace with your actual registration logic and database insertion
  if (!email || !password || !name) {
    return NextResponse.json(
      { message: 'Missing required fields' },
      { status: 400 }
    );
  }

  // Check if user already exists (in a real app, query your database)
  const userExists = false; // Replace with actual check

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