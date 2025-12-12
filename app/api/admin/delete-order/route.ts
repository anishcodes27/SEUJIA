import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('id');

    console.log('Attempting to delete order:', orderId);

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Get order items first
    const { data: orderItems, error: itemsFetchError } = await supabaseAdmin
      .from('order_items')
      .select('*')
      .eq('order_id', orderId);
    
    if (itemsFetchError) {
      console.error('Error fetching order items:', itemsFetchError);
      throw itemsFetchError;
    }

    console.log('Found order items:', orderItems?.length || 0);

    // Restore stock for each product in the order
    if (orderItems && orderItems.length > 0) {
      for (const item of orderItems) {
        console.log('Restoring stock for product:', item.product_id);
        
        try {
          // Get current product
          const { data: products, error: productError } = await supabaseAdmin
            .from('products')
            .select('stock, variants')
            .eq('id', item.product_id);

          if (productError) {
            console.error('Error fetching product:', productError);
            continue; // Skip this item if product fetch fails
          }

          if (products && products.length > 0) {
            const product = products[0];
            
            // Check if item has variant_size stored
            if (item.variant_size) {
              // Restore variant stock
              const updatedVariants = product.variants.map((v: any) => {
                if (v.size === item.variant_size) {
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
              
              console.log('Restored variant stock for:', item.variant_size, 'Quantity restored:', item.quantity);
            } else {
              // Restore base product stock
              const newStock = product.stock + item.quantity;
              await supabaseAdmin
                .from('products')
                .update({ stock: newStock })
                .eq('id', item.product_id);
              
              console.log('Restored product stock to:', newStock, 'Quantity restored:', item.quantity);
            }
          }
        } catch (error) {
          console.error('Error restoring stock for item:', error);
          // Continue with deletion even if stock restoration fails
        }
      }
    }

    // Delete order items first (due to foreign key constraint)
    console.log('Deleting order items...');
    const { error: itemsError } = await supabaseAdmin
      .from('order_items')
      .delete()
      .eq('order_id', orderId);

    if (itemsError) {
      console.error('Error deleting order items:', itemsError);
      throw itemsError;
    }

    // Delete the order
    console.log('Deleting order...');
    const { error: deleteError } = await supabaseAdmin
      .from('orders')
      .delete()
      .eq('id', orderId);

    if (deleteError) {
      console.error('Error deleting order:', deleteError);
      throw deleteError;
    }

    console.log('Order deleted successfully');
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
