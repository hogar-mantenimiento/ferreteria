import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

function verifyAuth(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  
  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET || 'default-secret') as any;
    return decoded;
  } catch (error) {
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = verifyAuth(request);
    if (!auth) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { items } = await request.json();
    
    if (!items || items.length === 0) {
      return NextResponse.json(
        { message: 'No items in cart' },
        { status: 400 }
      );
    }

    // Calculate total
    const total = items.reduce((sum: number, item: any) => 
      sum + (item.price * item.quantity), 0
    );

    // Mock MercadoPago integration
    // In production, you would use the actual MercadoPago SDK
    const preference = {
      items: items.map((item: any) => ({
        id: item.id,
        title: `Producto ${item.id}`,
        unit_price: item.price,
        quantity: item.quantity,
        currency_id: 'ARS'
      })),
      payer: {
        email: auth.email
      },
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_APP_URL}/success`,
        failure: `${process.env.NEXT_PUBLIC_APP_URL}/failure`,
        pending: `${process.env.NEXT_PUBLIC_APP_URL}/pending`
      },
      auto_return: 'approved'
    };

    // Mock preference creation
    const mockPreferenceId = `MP-${Date.now()}`;
    const mockPreferenceUrl = `https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=${mockPreferenceId}`;

    // In production, you would save this order to database
    console.log('Order created:', {
      userId: auth.userId,
      items,
      total,
      preferenceId: mockPreferenceId,
      createdAt: new Date()
    });

    return NextResponse.json({
      preferenceId: mockPreferenceId,
      preferenceUrl: mockPreferenceUrl,
      total
    });
  } catch (error) {
    console.error('Error creating checkout:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}