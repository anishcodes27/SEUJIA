'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/Button';

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order');

  return (
    <div className="pt-24 sm:pt-28 md:pt-32 min-h-screen bg-honey-50">
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-6xl mb-6">✓</div>
          <h1 className="text-3xl font-bold text-green-600 mb-4">
            Order Placed Successfully!
          </h1>
          <p className="text-gray-600 mb-2">
            Thank you for your purchase. Your order has been received.
          </p>
          {orderId && (
            <p className="text-sm text-gray-500 mb-8">
              Order ID: <span className="font-mono">{orderId}</span>
            </p>
          )}
          <p className="text-gray-700 mb-4">
            You will receive an email confirmation shortly with your order details and tracking information.
          </p>
          
          {/* Tracking Information */}
          <div className="bg-honey-50 border-2 border-honey-200 rounded-lg p-6 mb-8">
            <div className="text-4xl mb-3">📦</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Track Your Order</h2>
            <p className="text-sm text-gray-600 mb-4">
              Once your order is shipped, you'll receive an email with tracking details. 
              You can also track your order anytime using the tracking page.
            </p>
            <Link href="/track-order">
              <Button variant="secondary" className="inline-flex items-center gap-2">
                <span>🔍</span>
                Track Order
              </Button>
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/orders">
              <Button variant="secondary">View My Orders</Button>
            </Link>
            <Link href="/shop">
              <Button>Continue Shopping</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
