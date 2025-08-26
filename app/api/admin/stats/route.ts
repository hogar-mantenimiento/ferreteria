import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

function verifyAdminAuth(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  
  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET || 'default-secret') as any;
    return decoded.role === 'admin' ? decoded : null;
  } catch (error) {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const auth = verifyAdminAuth(request);
    if (!auth) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Mock stats data - In production, this would come from database queries
    const stats = {
      totalProducts: 48,
      totalUsers: 156,
      totalOrders: 23,
      revenue: 2450000
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}