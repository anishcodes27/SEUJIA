'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/Button';

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order');

  return (
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
        <p className="text-gray-700 mb-8">
          You will receive an email confirmation shortly with your order details.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/shop">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
