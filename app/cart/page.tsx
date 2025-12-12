'use client';

import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import Button from '@/components/Button';
import { useState } from 'react';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState('');
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  const subtotal = getCartTotal();
  const total = subtotal - discount;

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;

    setApplyingCoupon(true);
    setCouponMessage('');

    try {
      const response = await fetch('/api/apply-coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ couponCode, subtotal }),
      });

      const data = await response.json();

      if (data.valid) {
        setDiscount(data.discount);
        setCouponMessage(`Coupon applied! You saved ${formatPrice(data.discount)}`);
      } else {
        setDiscount(0);
        setCouponMessage(data.message || 'Invalid coupon code');
      }
    } catch (error) {
      setCouponMessage('Error applying coupon');
    } finally {
      setApplyingCoupon(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="pt-24 sm:pt-28 md:pt-32 min-h-screen bg-honey-50">
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-8">Add some delicious honey to your cart!</p>
          <Link href="/shop">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 sm:pt-28 md:pt-32 min-h-screen bg-honey-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div
              key={item.product.id}
              className="bg-white p-6 rounded-lg shadow-md flex gap-6"
            >
              <div className="relative w-24 h-24 bg-honey-50 rounded flex-shrink-0">
                {item.product.image_url ? (
                  <Image
                    src={item.product.image_url}
                    alt={item.product.name}
                    fill
                    className="object-cover rounded"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-honey-300 text-4xl">
                    🍯
                  </div>
                )}
              </div>

              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {item.product.name}
                </h3>
                <p className="text-honey-600 font-bold mb-4">
                  {formatPrice(item.product.price)}
                </p>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="w-8 h-8 rounded border border-gray-300 hover:bg-gray-100"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      min="1"
                      max={item.product.stock}
                      value={item.quantity}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 1;
                        const maxStock = item.product.stock;
                        updateQuantity(item.product.id, Math.max(1, Math.min(maxStock, value)));
                      }}
                      className="w-16 text-center border border-gray-300 rounded py-1 focus:outline-none focus:ring-2 focus:ring-honey-500"
                    />
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="w-8 h-8 rounded border border-gray-300 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-red-500 hover:text-red-700 text-sm font-medium"
                  >
                    Remove
                  </button>

                  <span className="ml-auto text-lg font-semibold text-gray-900">
                    {formatPrice(item.product.price * item.quantity)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md sticky top-20">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>

            {/* Coupon Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Coupon Code
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Enter code"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-honey-500"
                />
                <Button
                  onClick={handleApplyCoupon}
                  isLoading={applyingCoupon}
                  variant="secondary"
                  className="px-4"
                >
                  Apply
                </Button>
              </div>
              {couponMessage && (
                <p className={`text-sm mt-2 ${discount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {couponMessage}
                </p>
              )}
            </div>

            {/* Pricing */}
            <div className="space-y-2 mb-4 pb-4 border-b">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
            </div>

            <div className="flex justify-between mb-6">
              <span className="text-lg font-bold">Total</span>
              <span className="text-2xl font-bold text-honey-600">
                {formatPrice(total)}
              </span>
            </div>

            <Link 
              href="/checkout" 
              className="block"
              onClick={() => {
                if (discount > 0 && couponCode) {
                  localStorage.setItem('appliedCoupon', JSON.stringify({
                    code: couponCode,
                    discount: discount
                  }));
                } else {
                  localStorage.removeItem('appliedCoupon');
                }
              }}
            >
              <Button className="w-full">Proceed to Checkout</Button>
            </Link>

            <Link href="/shop" className="block text-center mt-4 text-honey-600 hover:text-honey-700">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
