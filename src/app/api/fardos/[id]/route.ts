import { NextRequest, NextResponse } from 'next/server';
import { fardoRepository } from '@/lib/repositories/fardo-repository';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Identificador de fardo requerido.' },
        { status: 400 }
      );
    }

    const fardo = await fardoRepository.findById(id);

    if (!fardo) {
      return NextResponse.json(
        { success: false, error: `No se encontró ningún fardo con el identificador "${id}".` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: fardo,
    });
  } catch (error: any) {
    console.error('Error in GET /api/fardos/[id]:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Error al obtener la ficha técnica del fardo.',
      },
      { status: 500 }
    );
  }
}
