import { NextRequest, NextResponse, connection } from 'next/server';
import { getUserFromRequest, listUserOrders } from '@/lib/auth';

export async function GET(request: NextRequest) {
  await connection();
  const user = await getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ success: false, error: 'No autenticado.' }, { status: 401 });
  }

  try {
    const orders = await listUserOrders(user.id);
    return NextResponse.json({ success: true, data: orders });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error al consultar tus pedidos.';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
