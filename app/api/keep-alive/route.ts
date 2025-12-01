import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Simple query to keep the database active
    const { data, error } = await supabase
      .from('products')
      .select('id')
      .limit(1);

    if (error) {
      console.error('Keep-alive ping failed:', error);
      return NextResponse.json(
        { success: false, error: error.message, timestamp: new Date().toISOString() },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Database is active',
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Keep-alive error:', error);
    return NextResponse.json(
      { success: false, error: error.message, timestamp: new Date().toISOString() },
      { status: 500 }
    );
  }
}
