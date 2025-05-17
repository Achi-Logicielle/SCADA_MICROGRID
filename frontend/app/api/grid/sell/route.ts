import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, price } = body;
    const cookieStore = cookies();
    const token = "your_jwt_secret"

    // Call the backend API
    const response = await fetch('http://localhost:3001/grid/sell', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ amount, price }),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to process sell request' },
      { status: 500 }
    );
  }
} 