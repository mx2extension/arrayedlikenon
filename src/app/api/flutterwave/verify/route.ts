import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabase';

export async function GET(req: NextRequest) {
  if (!supabaseAdmin) return NextResponse.json({ error: 'Admin not configured' }, { status: 500 });
  
  try {
    const { searchParams } = new URL(req.url);
    const tx_ref = searchParams.get('tx_ref');
    const transaction_id = searchParams.get('transaction_id');

    if (!tx_ref || !transaction_id) {
      return NextResponse.json({ error: 'Missing required search params' }, { status: 400 });
    }

    const verifyRes = await fetch(`https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`, {
      headers: { 
        Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}` 
      },
    });

    const verifyData = await verifyRes.json();

    if (
      verifyData.status !== 'success' || 
      verifyData.data.status !== 'successful' || 
      verifyData.data.currency !== 'USD'
    ) {
      await supabaseAdmin
        .from('orders')
        .update({ status: 'failed', flutterwave_data: verifyData })
        .eq('payment_reference', tx_ref);

      return NextResponse.json({ error: 'Payment verification failed' }, { status: 400 });
    }

    const { data: order, error: updateError } = await supabaseAdmin
      .from('orders')
      .update({
        status: 'paid',
        flutterwave_transaction_id: transaction_id,
        flutterwave_data: verifyData,
      })
      .eq('payment_reference', tx_ref)
      .select('tracking_id')
      .single();

    if (updateError) throw updateError;

    return NextResponse.json({ tracking_id: order.tracking_id });
  } catch (err: any) {
    console.error('Verify error:', err);
    return NextResponse.json({ error: err.message || 'Verification failed' }, { status: 500 });
  }
}