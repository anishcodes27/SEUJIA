import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('id');

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Get order details before deletion to restore stock
    const { data: orders, error: fetchError } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('id', orderId);

    if (fetchError) throw fetchError;
    
    if (!orders || orders.length === 0) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }
    
    const order = orders[0];
    
    // Get order items separately
    const { data: orderItems, error: itemsFetchError } = await supabaseAdmin
      .from('order_items')
      .select('*')
      .eq('order_id', orderId);
    
    if (itemsFetchError) throw itemsFetchError;

    // Restore stock for each product in the order
    if (orderItems && orderItems.length > 0) {
      for (const item of orderItems) {
        // Get current product
        const { data: products } = await supabaseAdmin
          .from('products')
          .select('stock, variants')
          .eq('id', item.product_id);

        if (products && products.length > 0) {
          const product = products[0];
          // Check if this item has a variant (check if product_name includes size info)
          // This is a simplification - ideally we'd store variant info in order_items
          const hasVariants = product.variants && product.variants.length > 0;
          
          if (hasVariants) {
            // Try to match variant by name pattern
            const sizeMatch = item.product_name.match(/\((\d+(?:\.\d+)?(?:kg|g))\)/i);
            if (sizeMatch) {
              const size = sizeMatch[1];
              const updatedVariants = product.variants.map((v: any) => {
                if (v.size === size) {
                  return {
                    ...v,
                    stock: v.stock + item.quantity
                  };
                }
                return v;
              });

              await supabaseAdmin
                .from('products')
                .update({ variants: updatedVariants })
                .eq('id', item.product_id);
            }
          } else {
            // Restore base product stock
            await supabaseAdmin
              .from('products')
              .update({ stock: product.stock + item.quantity })
              .eq('id', item.product_id);
          }
        }
      }
    }

    // Delete order items first (due to foreign key constraint)
    const { error: itemsError } = await supabaseAdmin
      .from('order_items')
      .delete()
      .eq('order_id', orderId);

    if (itemsError) throw itemsError;

    // Delete the order
    const { error: deleteError } = await supabaseAdmin
      .from('orders')
      .delete()
      .eq('id', orderId);

    if (deleteError) throw deleteError;

    return NextResponse.json({ 
      success: true,
      message: 'Order deleted successfully and stock restored'
    });
  } catch (error: any) {
    console.error('Error deleting order:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete order' },
      { status: 500 }
    );
  }
}
