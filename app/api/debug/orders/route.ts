import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function GET(request: NextRequest) {
  try {
    // Fetch ALL orders (for debugging)
    const { data: orders, error } = await supabaseAdmin
      .from('orders')
      .select('id, order_number, customer_email, customer_name, created_at')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Debug orders error:', error);
      throw error;
    }

    return NextResponse.json({
      success: true,
      total_orders: orders?.length || 0,
      orders: orders || [],
    });

  } catch (error: any) {
    console.error('Error fetching debug orders:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
