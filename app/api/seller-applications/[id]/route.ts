import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// Mock storage - In production, this would be a database
let sellerApplications: any[] = [];

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

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = verifyAdminAuth(request);
    if (!auth) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { status } = await request.json();
    const applicationIndex = sellerApplications.findIndex(app => app.id === params.id);
    
    if (applicationIndex === -1) {
      return NextResponse.json(
        { message: 'Application not found' },
        { status: 404 }
      );
    }

    sellerApplications[applicationIndex] = {
      ...sellerApplications[applicationIndex],
      status,
      updatedAt: new Date()
    };

    return NextResponse.json({
      message: 'Application updated successfully',
      application: sellerApplications[applicationIndex]
    });
  } catch (error) {
    console.error('Error updating application:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}