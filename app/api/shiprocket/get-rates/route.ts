import { NextRequest, NextResponse } from 'next/server';
import { shiprocket, getPickupPincode } from '@/lib/shiprocket';

export async function POST(request: NextRequest) {
  try {
    const { delivery_pincode, weight, cod } = await request.json();

    if (!delivery_pincode || !weight) {
      return NextResponse.json(
        { error: 'Missing required fields: delivery_pincode, weight' },
        { status: 400 }
      );
    }

    // Get shipping rates
    const rates = await shiprocket.getCheapestRate({
      pickup_postcode: getPickupPincode(),
      delivery_postcode: delivery_pincode,
      weight: weight,
      cod: cod || false,
    });

    return NextResponse.json({
      success: true,
      data: rates,
    });

  } catch (error: any) {
    console.error('Shiprocket rate calculation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to calculate shipping rates' },
      { status: 500 }
    );
  }
}
