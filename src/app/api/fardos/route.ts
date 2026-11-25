import { NextRequest, NextResponse, connection } from 'next/server';
import { fardoRepository } from '@/lib/repositories/fardo-repository';
import { FardoQueryParams } from '@/types';

export async function GET(request: NextRequest) {
  await connection();
  try {
    const searchParams = request.nextUrl.searchParams;

    const category = searchParams.get('categoria') || searchParams.get('category') || undefined;
    const quality = searchParams.get('calidad') || searchParams.get('quality') || undefined;
    const dropId = searchParams.get('dropId') || undefined;
    const search = searchParams.get('q') || searchParams.get('search') || undefined;
    const sortBy = (searchParams.get('orden') || searchParams.get('sortBy') || undefined) as
      | FardoQueryParams['sortBy']
      | undefined;

    const limitParam = searchParams.get('limit');
    const offsetParam = searchParams.get('offset');

    const limit = limitParam ? parseInt(limitParam, 10) : undefined;
    const offset = offsetParam ? parseInt(offsetParam, 10) : undefined;

    const { items, total } = await fardoRepository.findMany({
      category,
      quality,
      dropId,
      search,
      sortBy,
      limit,
      offset,
    });

    return NextResponse.json({
      success: true,
      data: items,
      meta: {
        total,
        count: items.length,
        limit: limit || items.length,
        offset: offset || 0,
      },
    });
  } catch (error: any) {
    console.error('Error in GET /api/fardos:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Error interno al consultar el catálogo de fardos.',
      },
      { status: 500 }
    );
  }
}
