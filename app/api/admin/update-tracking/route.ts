import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { sendEmail } from '@/lib/email/send';
import { getShipmentEmailHtml, getShipmentEmailText } from '@/lib/email/templates/shipment';

export async function POST(request: NextRequest) {
  try {
    const { orderId, awbCode, courierName, trackingUrl, shipmentStatus, estimatedDelivery } = await request.json();

    if (!orderId || !awbCode || !courierName) {
      return NextResponse.json(
        { error: 'Order ID, AWB code, and courier name are required' },
        { status: 400 }
      );
    }

    // Get order details first
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Update order with tracking information
    const { data: updatedOrder, error: updateError } = await supabaseAdmin
      .from('orders')
      .update({
        awb_code: awbCode.trim(),
        courier_name: courierName.trim(),
        tracking_url: trackingUrl?.trim() || null,
        shipment_status: shipmentStatus || 'shipped',
        estimated_delivery_date: estimatedDelivery || null,
        order_status: 'processing', // Update order status to processing when shipped
      })
      .eq('id', orderId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating order:', updateError);
      return NextResponse.json(
        { error: 'Failed to update tracking information' },
        { status: 500 }
      );
    }

    // Send shipment notification email to customer
    try {
      const emailResult = await sendEmail({
        to: order.customer_email,
        subject: `🚚 Your Order ${order.order_number} Has Been Shipped!`,
        html: getShipmentEmailHtml({
          customerName: order.customer_name,
          orderNumber: order.order_number,
          awbCode: awbCode.trim(),
          courierName: courierName.trim(),
          trackingUrl: trackingUrl?.trim() || `${process.env.NEXT_PUBLIC_APP_URL}/track-order?awb=${awbCode.trim()}`,
          estimatedDelivery: estimatedDelivery || 'Will be updated soon',
        }),
        text: getShipmentEmailText({
          customerName: order.customer_name,
          orderNumber: order.order_number,
          awbCode: awbCode.trim(),
          courierName: courierName.trim(),
          trackingUrl: trackingUrl?.trim() || `${process.env.NEXT_PUBLIC_APP_URL}/track-order?awb=${awbCode.trim()}`,
          estimatedDelivery: estimatedDelivery || 'Will be updated soon',
        }),
      });

      if (!emailResult.success) {
        console.error('Failed to send shipment email:', emailResult.error);
        // Don't fail the request, just log the error
      } else {
        console.log('✅ Shipment notification email sent to:', order.customer_email);
      }
    } catch (emailError) {
      console.error('Error sending shipment email:', emailError);
      // Continue even if email fails
    }

    return NextResponse.json({
      success: true,
      message: 'Tracking information updated successfully',
      order: updatedOrder,
    });
  } catch (error: any) {
    console.error('Update tracking error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update tracking information' },
      { status: 500 }
    );
  }
}
