import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import mercadopago from 'mercadopago';
import { z } from 'zod';

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

    const body = await request.json();

    const itemSchema = z.object({
      id: z.string(),
      title: z.string(),
      quantity: z.number().int().positive(),
      price: z.number().positive(),
    });

    const checkoutSchema = z.object({
      items: z.array(itemSchema).min(1, 'No items in cart'),
    });

    const { items } = checkoutSchema.parse(body);

    if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
      return NextResponse.json(
        { message: 'MercadoPago access token not configured' },
        { status: 500 }
      );
    }

    mercadopago.configure({
      access_token: process.env.MERCADOPAGO_ACCESS_TOKEN,
    });

    const total = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const preference = {
      items: items.map(item => ({
        id: item.id,
        title: item.title,
        unit_price: item.price,
        quantity: item.quantity,
        currency_id: 'ARS',
      })),
      payer: {
        email: auth.email,
      },
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_APP_URL}/success`,
        failure: `${process.env.NEXT_PUBLIC_APP_URL}/failure`,
        pending: `${process.env.NEXT_PUBLIC_APP_URL}/pending`,
      },
      notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/mercadopago/webhook`,
      auto_return: 'approved',
    };

    const preferenceResponse = await mercadopago.preferences.create(preference);

    return NextResponse.json({
      preferenceId: preferenceResponse.body.id,
      preferenceUrl:
        preferenceResponse.body.init_point ||
        preferenceResponse.body.sandbox_init_point,
      total,
    });
  } catch (error) {
    console.error('Error creating checkout:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Invalid request', errors: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}