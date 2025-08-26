import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const paymentId = searchParams.get('payment_id');

    if (!paymentId) {
      return NextResponse.json(
        { message: 'Payment ID is required' },
        { status: 400 }
      );
    }

    // Mock payment status - In production, you would fetch from MercadoPago API
    const mockPaymentData = {
      id: paymentId,
      status: 'approved',
      transaction_amount: 85000,
      currency_id: 'ARS',
      payment_method_id: 'visa',
      payer: {
        email: 'customer@example.com'
      },
      date_created: new Date().toISOString(),
      date_approved: new Date().toISOString()
    };

    return NextResponse.json(mockPaymentData);
  } catch (error) {
    console.error('Error fetching payment status:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}