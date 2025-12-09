import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { generateOrderNumber } from '@/lib/utils';
import Razorpay from 'razorpay';
import { sendEmail } from '@/lib/email/send';
import { getOrderConfirmationEmailHtml, getOrderConfirmationEmailText } from '@/lib/email/templates/order-confirmation';

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: NextRequest) {
  try {
    const { cart, shipping, couponCode, paymentMethod, deliveryCharges } = await request.json();

    // Validate input
    if (!cart || cart.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      );
    }

    if (!shipping || !shipping.name || !shipping.email || !shipping.address || !shipping.pincode || !shipping.state || !shipping.district) {
      return NextResponse.json(
        { error: 'Missing shipping information' },
        { status: 400 }
      );
    }

    // Calculate totals
    let subtotal = 0;
    for (const item of cart) {
      subtotal += item.product.price * item.quantity;
    }

    let discount = 0;
    let validatedCoupon = null;

    // Validate coupon if provided
    if (couponCode) {
      const { data: coupon } = await supabaseAdmin
        .from('coupons')
        .select('*')
        .eq('code', couponCode.toUpperCase())
        .eq('is_active', true)
        .single();

      if (coupon) {
        if (coupon.discount_type === 'percentage') {
          discount = (subtotal * coupon.discount_value) / 100;
        } else {
          discount = coupon.discount_value;
        }
        discount = Math.min(discount, subtotal);
        validatedCoupon = coupon;
      }
    }

    const total = subtotal - discount;
    const finalTotal = total + (deliveryCharges || 0);
    const orderNumber = generateOrderNumber();

    // Create full shipping address string
    const fullAddress = `${shipping.address}, ${shipping.district}, ${shipping.state} - ${shipping.pincode}`;

    // Create order in database
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        order_number: orderNumber,
        customer_name: shipping.name,
        customer_email: shipping.email,
        customer_phone: shipping.phone || null,
        shipping_address: fullAddress,
        subtotal: subtotal,
        discount_amount: discount,
        total: finalTotal,
        coupon_code: validatedCoupon ? validatedCoupon.code : null,
        payment_provider: paymentMethod,
        payment_status: paymentMethod === 'cod' ? 'pending' : 'pending',
        order_status: 'pending',
      })
      .select()
      .single();

    if (orderError) {
      console.error('Order creation error:', orderError);
      throw orderError;
    }

    console.log('Order created successfully:', {
      order_id: order.id,
      order_number: orderNumber,
      customer_email: shipping.email,
    });

    // Create order items
    const orderItems = cart.map((item: any) => ({
      order_id: order.id,
      product_id: item.product.id,
      product_name: item.product.name,
      product_price: item.product.price,
      quantity: item.quantity,
      subtotal: item.product.price * item.quantity,
    }));

    const { error: itemsError } = await supabaseAdmin
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    // Reduce stock for each product/variant
    for (const item of cart) {
      if (item.selectedVariant) {
        // Update variant stock
        const { data: product } = await supabaseAdmin
          .from('products')
          .select('variants')
          .eq('id', item.product.id)
          .single();

        if (product && product.variants) {
          const updatedVariants = product.variants.map((v: any) => {
            if (v.size === item.selectedVariant.size) {
              return {
                ...v,
                stock: Math.max(0, v.stock - item.quantity)
              };
            }
            return v;
          });

          await supabaseAdmin
            .from('products')
            .update({ variants: updatedVariants })
            .eq('id', item.product.id);
        }
      } else {
        // Update base product stock
        const { data: product } = await supabaseAdmin
          .from('products')
          .select('stock')
          .eq('id', item.product.id)
          .single();

        if (product) {
          await supabaseAdmin
            .from('products')
            .update({ stock: Math.max(0, product.stock - item.quantity) })
            .eq('id', item.product.id);
        }
      }
    }

    // Increment coupon usage
    if (validatedCoupon) {
      await supabaseAdmin
        .from('coupons')
        .update({ current_uses: validatedCoupon.current_uses + 1 })
        .eq('id', validatedCoupon.id);
    }

    // Send order confirmation email
    try {
      const emailResult = await sendEmail({
        to: shipping.email,
        subject: `Order Confirmed - ${orderNumber} 🍯`,
        html: getOrderConfirmationEmailHtml({
          customerName: shipping.name,
          orderNumber: orderNumber,
          orderItems: cart.map((item: any) => ({
            name: item.product.name,
            quantity: item.quantity,
            price: item.product.price,
          })),
          subtotal: subtotal,
          discount: discount,
          total: finalTotal,
          shippingAddress: fullAddress,
          paymentMethod: paymentMethod,
        }),
        text: getOrderConfirmationEmailText({
          customerName: shipping.name,
          orderNumber: orderNumber,
          orderItems: cart.map((item: any) => ({
            name: item.product.name,
            quantity: item.quantity,
            price: item.product.price,
          })),
          subtotal: subtotal,
          discount: discount,
          total: finalTotal,
          shippingAddress: fullAddress,
          paymentMethod: paymentMethod,
        }),
      });

      if (emailResult.success) {
        console.log('✅ Order confirmation email sent to:', shipping.email);
      } else {
        console.error('Failed to send order confirmation email:', emailResult.error);
      }
    } catch (emailError) {
      console.error('Error sending order confirmation email:', emailError);
      // Don't fail the order if email fails
    }

    // Create payment based on provider
    if (paymentMethod === 'cod') {
      // Cash on Delivery - no payment gateway needed
      return NextResponse.json({
        orderId: order.id,
        orderNumber: orderNumber,
        paymentMethod: 'cod',
        message: 'Order placed successfully! Pay when you receive the product.',
      });
    } else if (paymentMethod === 'razorpay') {
      // Razorpay integration
      const razorpayOrder = await razorpay.orders.create({
        amount: Math.round(finalTotal * 100), // Razorpay uses paise (1 INR = 100 paise)
        currency: 'INR',
        receipt: orderNumber,
      });

      await supabaseAdmin
        .from('orders')
        .update({ payment_intent_id: razorpayOrder.id })
        .eq('id', order.id);

      return NextResponse.json({
        orderId: order.id,
        orderNumber: orderNumber,
        razorpayOrderId: razorpayOrder.id,
        amount: Math.round(finalTotal * 100),
      });
    }

    return NextResponse.json(
      { error: 'Invalid payment provider' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: error.message || 'Checkout failed' },
      { status: 500 }
    );
  }
}
