import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('x-razorpay-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing signature' },
      { status: 400 }
    );
  }

  try {
    // Verify Razorpay signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(body)
      .digest('hex');

    if (signature !== expectedSignature) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    const event = JSON.parse(body);

    // Handle payment authorized/captured event
    if (event.event === 'payment.captured' || event.event === 'payment.authorized') {
      const payment = event.payload.payment.entity;
      const orderNumber = payment.notes?.order_number;

      if (!orderNumber) {
        return NextResponse.json(
          { error: 'Order number not found' },
          { status: 400 }
        );
      }

      // Find order by order number
      const { data: order, error: orderError } = await supabaseAdmin
        .from('orders')
        .select('*')
        .eq('order_number', orderNumber)
        .single();

      if (orderError || !order) {
        return NextResponse.json(
          { error: 'Order not found' },
          { status: 404 }
        );
      }

      // Update order status
      await supabaseAdmin
        .from('orders')
        .update({ payment_status: 'paid', order_status: 'processing' })
        .eq('id', order.id);

      // Get order items
      const { data: orderItems } = await supabaseAdmin
        .from('order_items')
        .select('*')
        .eq('order_id', order.id);

      // Decrement product inventory
      if (orderItems) {
        for (const item of orderItems) {
          const { data: product } = await supabaseAdmin
            .from('products')
            .select('stock')
            .eq('id', item.product_id)
            .single();

          if (product) {
            await supabaseAdmin
              .from('products')
              .update({ stock: product.stock - item.quantity })
              .eq('id', item.product_id);
          }
        }
      }

      console.log(`Order ${order.order_number} marked as paid via Razorpay`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Razorpay webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
