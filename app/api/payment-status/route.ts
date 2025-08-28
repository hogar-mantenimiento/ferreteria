import { NextRequest, NextResponse } from 'next/server';
import mercadopago from 'mercadopago';

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

    if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
      return NextResponse.json(
        { message: 'MercadoPago access token not configured' },
        { status: 500 }
      );
    }

    mercadopago.configure({
      access_token: process.env.MERCADOPAGO_ACCESS_TOKEN,
    });

    const payment = await mercadopago.payment.findById(Number(paymentId));

    return NextResponse.json(payment.body);
  } catch (error) {
    console.error('Error fetching payment status:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}