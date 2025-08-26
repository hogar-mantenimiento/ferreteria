import { NextRequest, NextResponse } from 'next/server';
import { SellerApplication } from '@/types';

// Mock storage for seller applications - In production, this would be a database
let sellerApplications: SellerApplication[] = [];

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    const application: SellerApplication = {
      id: Date.now().toString(),
      personalInfo: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        dni: data.dni,
        birthDate: data.birthDate,
      },
      businessInfo: {
        businessName: data.businessName,
        businessType: data.businessType,
        cuit: data.cuit,
        address: data.address,
        city: data.city,
        province: data.province,
        postalCode: data.postalCode,
      },
      experience: {
        hasExperience: data.hasExperience,
        yearsExperience: data.yearsExperience,
        previousWork: data.previousWork,
        specialties: data.specialties,
      },
      motivation: data.motivation,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    sellerApplications.push(application);

    // In production, you would:
    // 1. Save to database
    // 2. Send confirmation email
    // 3. Notify admin team
    console.log('New seller application received:', application);

    return NextResponse.json({
      message: 'Application submitted successfully',
      applicationId: application.id
    });
  } catch (error) {
    console.error('Error processing seller application:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // This would be admin-only in production
    return NextResponse.json({
      applications: sellerApplications,
      total: sellerApplications.length
    });
  } catch (error) {
    console.error('Error fetching seller applications:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}