import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabase';
import { generateTrackingId } from '../../../../lib/utils';

export async function POST(req: NextRequest) {
  if (!supabaseAdmin) return NextResponse.json({ error: 'Admin not configured' }, { status: 500 });
  
  try {
    const body = await req.json();
    const { customer, items, total_amount, currency } = body;

    if (!customer?.email || !customer?.name || !customer?.phone || !customer?.address || !items?.length) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const tx_ref = `ALN-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    const tracking_id = generateTrackingId();

    const { error: orderError } = await supabaseAdmin.from('orders').insert({
      tracking_id,
      customer_name: customer.name,
      customer_email: customer.email,
      customer_phone: customer.phone,
      customer_address: customer.address,
      city: customer.city || null,
      state: customer.state || null,
      country: customer.country || 'International',
      total_amount,
      currency: currency || 'USD',
      status: 'pending',
      payment_reference: tx_ref,
    });

    if (orderError) throw orderError;

    const { data: order } = await supabaseAdmin
      .from('orders')
      .select('id')
      .eq('tracking_id', tracking_id)
      .single();

    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.productId || item.id || null,
      product_title: item.title || item.name,
      product_number: item.number || null,
      color: item.color || null,
      size: item.size || null,
      price: item.price,
      quantity: item.quantity || 1,
    }));

    const { error: itemsError } = await supabaseAdmin.from('order_items').insert(orderItems);
    if (itemsError) throw itemsError;

    return NextResponse.json({ tx_ref, tracking_id });
  } catch (err: any) {
    console.error('Initiate error:', err);
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 });
  }
}