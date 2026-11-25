import { NextRequest, NextResponse } from 'next/server';
import { fardoRepository } from '@/lib/repositories/fardo-repository';
import { getUserFromRequest } from '@/lib/auth';
import { CreateOrderDto } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body: CreateOrderDto = await request.json();

    if (!body || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'El cuerpo de la solicitud debe incluir un array "items" no vacío.',
        },
        { status: 400 }
      );
    }

    const user = await getUserFromRequest(request).catch(() => null);

    const quote = await fardoRepository.createQuote({
      ...body,
      userId: user?.id ?? null,
      customerName: body.customerName || user?.fullName || undefined,
      customerPhone: body.customerPhone || user?.phone || undefined,
      shippingCity: body.shippingCity || user?.shippingCity || undefined,
    });

    return NextResponse.json(
      {
        success: true,
        data: quote,
        message: 'Cotización mayorista calculada y registrada correctamente.',
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error in POST /api/orders:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Error al procesar la cotización del pedido.',
      },
      { status: 400 }
    );
  }
}
