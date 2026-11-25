import { NextResponse, connection } from 'next/server';
import { fardoRepository } from '@/lib/repositories/fardo-repository';

export async function GET() {
  await connection();
  try {
    const categories = await fardoRepository.findCategories();

    return NextResponse.json({
      success: true,
      data: categories,
      meta: {
        total: categories.length,
      },
    });
  } catch (error: any) {
    console.error('Error in GET /api/categories:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Error al listar las categorías mayoristas.',
      },
      { status: 500 }
    );
  }
}
