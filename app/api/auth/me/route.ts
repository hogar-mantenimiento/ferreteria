import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { message: 'No token provided' },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET || 'default-secret') as any;
    
    const user = {
      id: decoded.userId,
      email: decoded.email,
      name: decoded.email === 'admin@test.com' ? 'Admin User' : 'Regular User',
      role: decoded.role
    };

    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json(
      { message: 'Token inválido' },
      { status: 401 }
    );
  }
}