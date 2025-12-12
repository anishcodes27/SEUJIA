import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { sendEmail } from '@/lib/email/send';

export async function POST(request: NextRequest) {
  try {
    const { orderId, orderStatus } = await request.json();

    if (!orderId || !orderStatus) {
      return NextResponse.json(
        { error: 'Order ID and status are required' },
        { status: 400 }
      );
    }

    // Update order status
    const { data: order, error } = await supabaseAdmin
      .from('orders')
      .update({ 
        order_status: orderStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)
      .select()
      .single();

    if (error) throw error;

    // Send email notification if order is marked as delivered
    if (orderStatus === 'delivered') {
      try {
        await sendEmail({
          to: order.customer_email,
          subject: `Your Order ${order.order_number} has been Delivered! 🎉`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #ef851f;">Order Delivered Successfully! 🎉</h2>
              <p>Dear ${order.customer_name},</p>
              <p>Great news! Your order <strong>${order.order_number}</strong> has been delivered.</p>
              <p>We hope you enjoy your Seujia Honey!</p>
              <div style="background-color: #f9f5f0; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p style="margin: 5px 0;"><strong>Order Number:</strong> ${order.order_number}</p>
                ${order.awb_code ? `<p style="margin: 5px 0;"><strong>AWB Code:</strong> ${order.awb_code}</p>` : ''}
              </div>
              <p>If you have any questions or concerns, please don't hesitate to contact us.</p>
              <p>Thank you for choosing Seujia!</p>
              <br>
              <p>Best regards,<br>The Seujia Team</p>
            </div>
          `,
          text: `Order Delivered! Your order ${order.order_number} has been delivered. Thank you for choosing Seujia!`,
        });
      } catch (emailError) {
        console.error('Error sending delivery email:', emailError);
        // Don't fail the status update if email fails
      }
    }

    return NextResponse.json({ 
      success: true, 
      order,
      message: orderStatus === 'delivered' ? 'Order marked as delivered and email sent!' : 'Order status updated successfully'
    });
  } catch (error: any) {
    console.error('Error updating order status:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update order status' },
      { status: 500 }
    );
  }
}
