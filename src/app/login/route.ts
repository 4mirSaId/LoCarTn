// src/app/api/auth/login/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { email, password } = await request.json();

  // Replace with your actual authentication logic and database queries
  const users = [
    {
      id: '1',
      name: 'Admin User',
      email: 'admin@locartn.com',
      password: 'admin123', // In real app, use hashed passwords
      role: 'ADMIN',
    },
    {
      id: '2',
      name: 'Car Agency',
      email: 'agency@locartn.com',
      password: 'agency123',
      role: 'AGENCY',
      agencyId: 'agency1',
    },
    {
      id: '3',
      name: 'Regular Client',
      email: 'client@locartn.com',
      password: 'client123',
      role: 'CLIENT',
    },
  ];

  const user = users.find(
    (u) => u.email === email && u.password === password
  );

  if (user) {
    
    const { ...userData } = user;
    return NextResponse.json({
      user: userData,
      token: '<JWT_TOKEN>', 
    });
  }

  return NextResponse.json(
    { message: 'Invalid email or password' },
    { status: 401 }
  );
}