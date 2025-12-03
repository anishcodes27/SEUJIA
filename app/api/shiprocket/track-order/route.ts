import { NextRequest, NextResponse } from 'next/server';
import { shiprocket } from '@/lib/shiprocket';

export async function POST(request: NextRequest) {
  try {
    const { order_number } = await request.json();

    if (!order_number) {
      return NextResponse.json(
        { error: 'Missing order_number' },
        { status: 400 }
      );
    }

    // In a production app, you'd fetch the shipment_id from your database
    // For now, we'll accept it directly or track by AWB
    const { shipment_id, awb_code } = await request.json();

    let trackingData;

    if (shipment_id) {
      trackingData = await shiprocket.trackShipment(shipment_id);
    } else if (awb_code) {
      trackingData = await shiprocket.trackByAWB(awb_code);
    } else {
      return NextResponse.json(
        { error: 'Either shipment_id or awb_code is required' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: trackingData,
    });

  } catch (error: any) {
    console.error('Shiprocket tracking error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to track shipment' },
      { status: 500 }
    );
  }
}
