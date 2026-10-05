import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabase';

export async function POST(req: NextRequest) {
  if (!supabaseAdmin) return NextResponse.json({ error: 'Admin not configured' }, { status: 500 });
  try {
    const body = await req.text();
    const secretHash = process.env.FLUTTERWAVE_WEBHOOK_SECRET_HASH;
    if (secretHash) {
      const signature = req.headers.get('verif-hash');
      if (!signature || signature !== secretHash) return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }
    const event = JSON.parse(body);
    if (event.event === 'charge.completed' && event.data.status === 'successful') {
      await supabaseAdmin.from('orders').update({
        status: 'paid', flutterwave_transaction_id: String(event.data.id), flutterwave_data: event,
      }).eq('payment_reference', event.data.tx_ref).eq('status', 'pending');
    }
    return NextResponse.json({ received: true });
  } catch { return NextResponse.json({ error: 'Webhook error' }, { status: 500 }); }
}