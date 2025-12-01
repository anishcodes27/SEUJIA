import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

// GET - Fetch all coupons
export async function GET() {
  try {
    const { data: coupons, error } = await supabaseAdmin
      .from('coupons')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ coupons });
  } catch (error) {
    console.error('Error fetching coupons:', error);
    return NextResponse.json(
      { error: 'Failed to fetch coupons' },
      { status: 500 }
    );
  }
}

// POST - Add new coupon
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const { code, discount_type, discount_value, min_order_value, max_uses } = body;

    const { data: coupon, error } = await supabaseAdmin
      .from('coupons')
      .insert([
        {
          code: code.toUpperCase(),
          discount_type,
          discount_value: parseFloat(discount_value),
          min_order_value: parseFloat(min_order_value) || 0,
          max_uses: max_uses ? parseInt(max_uses) : null,
          is_active: true,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ coupon, message: 'Coupon added successfully' });
  } catch (error) {
    console.error('Error adding coupon:', error);
    return NextResponse.json(
      { error: 'Failed to add coupon' },
      { status: 500 }
    );
  }
}

// PUT - Update coupon
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    
    const { id, code, discount_type, discount_value, min_order_value, max_uses } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Coupon ID is required' },
        { status: 400 }
      );
    }

    const { data: coupon, error } = await supabaseAdmin
      .from('coupons')
      .update({
        code: code.toUpperCase(),
        discount_type,
        discount_value: parseFloat(discount_value),
        min_order_value: parseFloat(min_order_value) || 0,
        max_uses: max_uses ? parseInt(max_uses) : null,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ coupon, message: 'Coupon updated successfully' });
  } catch (error) {
    console.error('Error updating coupon:', error);
    return NextResponse.json(
      { error: 'Failed to update coupon' },
      { status: 500 }
    );
  }
}

// DELETE - Delete coupon
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Coupon ID is required' },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from('coupons')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ message: 'Coupon deleted successfully' });
  } catch (error) {
    console.error('Error deleting coupon:', error);
    return NextResponse.json(
      { error: 'Failed to delete coupon' },
      { status: 500 }
    );
  }
}
