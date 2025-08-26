import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const testUsers = {
  'admin@test.com': {
    id: '1',
    email: 'admin@test.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin'
  },
  'user@test.com': {
    id: '2',
    email: 'user@test.com',
    password: 'user123',
    name: 'Regular User',
    role: 'user'
  }
};

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    const user = testUsers[email as keyof typeof testUsers];
    
    if (!user || user.password !== password) {
      return NextResponse.json(
        { message: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role 
      },
      process.env.NEXTAUTH_SECRET || 'default-secret',
      { expiresIn: '7d' }
    );

    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/'
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}