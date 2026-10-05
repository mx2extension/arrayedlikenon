import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data: order } = await supabase.from('orders').select('*').eq('tracking_id', id).single();
  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  const { data: items } = await supabase.from('order_items').select('*').eq('order_id', order.id);
  return NextResponse.json({ order, items: items || [] });
}