import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function GET(request: NextRequest) {
  try {
    // Get user email from query params or auth
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    console.log('Fetching orders for email:', email);

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Fetch orders for the user
    const { data: orders, error } = await supabaseAdmin
      .from('orders')
      .select(`
        *,
        order_items (
          id,
          product_name,
          product_price,
          quantity,
          subtotal
        )
      `)
      .eq('customer_email', email)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    console.log('Found orders:', orders?.length || 0);

    return NextResponse.json({
      success: true,
      orders: orders || [],
    });

  } catch (error: any) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
