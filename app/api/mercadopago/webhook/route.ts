import { NextRequest, NextResponse } from 'next/server';
import mercadopago from 'mercadopago';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('MercadoPago webhook received:', body);

    if (body.type === 'payment' && body.data?.id) {
      if (process.env.MERCADOPAGO_ACCESS_TOKEN) {
        mercadopago.configure({ access_token: process.env.MERCADOPAGO_ACCESS_TOKEN });
        const payment = await mercadopago.payment.findById(body.data.id);
        console.log('Payment status:', payment.body.status);
      } else {
        console.warn('MERCADOPAGO_ACCESS_TOKEN not configured');
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || searchParams.get('topic');
    const id = searchParams.get('data.id') || searchParams.get('id');

    if (type === 'payment' && id && process.env.MERCADOPAGO_ACCESS_TOKEN) {
      mercadopago.configure({ access_token: process.env.MERCADOPAGO_ACCESS_TOKEN });
      const payment = await mercadopago.payment.findById(Number(id));
      console.log('Payment status (GET):', payment.body.status);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
