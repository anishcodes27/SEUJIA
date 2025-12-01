import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

// GET - Fetch all products
export async function GET() {
  try {
    const { data: products, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ products });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST - Add new product
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const { name, description, price, stock, slug, image_url, category } = body;

    // Validate required fields
    if (!name || !price || !slug) {
      return NextResponse.json(
        { error: 'Name, price, and slug are required' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const { data: existingProduct } = await supabaseAdmin
      .from('products')
      .select('id')
      .eq('slug', slug)
      .single();

    if (existingProduct) {
      return NextResponse.json(
        { error: 'Product with this slug already exists' },
        { status: 400 }
      );
    }

    // Insert new product
    const { data: product, error } = await supabaseAdmin
      .from('products')
      .insert([
        {
          name,
          description: description || '',
          price: parseFloat(price),
          stock: parseInt(stock) || 0,
          slug,
          image_url: image_url || null,
          category: category || 'honey',
          is_active: true,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ product, message: 'Product added successfully' });
  } catch (error) {
    console.error('Error adding product:', error);
    return NextResponse.json(
      { error: 'Failed to add product' },
      { status: 500 }
    );
  }
}

// PUT - Update product
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    
    const { id, name, description, price, stock, slug, image_url, category } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Update product
    const { data: product, error } = await supabaseAdmin
      .from('products')
      .update({
        name,
        description,
        price: parseFloat(price),
        stock: parseInt(stock),
        slug,
        image_url,
        category,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ product, message: 'Product updated successfully' });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

// DELETE - Delete product
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
