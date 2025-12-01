import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function POST(request: NextRequest) {
  try {
    const { couponCode, subtotal } = await request.json();

    if (!couponCode || !subtotal) {
      return NextResponse.json(
        { valid: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Fetch coupon from database
    const { data: coupon, error } = await supabaseAdmin
      .from('coupons')
      .select('*')
      .eq('code', couponCode.toUpperCase())
      .single();

    if (error || !coupon) {
      return NextResponse.json({
        valid: false,
        message: 'Invalid coupon code',
        discount: 0,
        newTotal: subtotal,
      });
    }

    // Validate coupon
    if (!coupon.is_active) {
      return NextResponse.json({
        valid: false,
        message: 'This coupon is no longer active',
        discount: 0,
        newTotal: subtotal,
      });
    }

    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
      return NextResponse.json({
        valid: false,
        message: 'This coupon has expired',
        discount: 0,
        newTotal: subtotal,
      });
    }

    if (coupon.max_uses && coupon.current_uses >= coupon.max_uses) {
      return NextResponse.json({
        valid: false,
        message: 'This coupon has reached its usage limit',
        discount: 0,
        newTotal: subtotal,
      });
    }

    if (subtotal < coupon.min_order_value) {
      return NextResponse.json({
        valid: false,
        message: `Minimum order value of ₹${coupon.min_order_value} required`,
        discount: 0,
        newTotal: subtotal,
      });
    }

    // Calculate discount
    let discount = 0;
    if (coupon.discount_type === 'percentage') {
      discount = (subtotal * coupon.discount_value) / 100;
    } else if (coupon.discount_type === 'fixed') {
      discount = coupon.discount_value;
    }

    // Ensure discount doesn't exceed subtotal
    discount = Math.min(discount, subtotal);

    const newTotal = subtotal - discount;

    return NextResponse.json({
      valid: true,
      discount: parseFloat(discount.toFixed(2)),
      newTotal: parseFloat(newTotal.toFixed(2)),
      message: 'Coupon applied successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      { valid: false, message: 'Error applying coupon', discount: 0 },
      { status: 500 }
    );
  }
}
