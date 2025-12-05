'use client';

import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useCart();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white z-50 shadow-2xl overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Your Cart</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          {cart.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">Your cart is empty</p>
              <Link
                href="/shop"
                onClick={onClose}
                className="text-honey-600 hover:text-honey-700 font-medium"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {cart.map((item, index) => {
                  const displayPrice = item.selectedVariant ? item.selectedVariant.price : item.product.price;
                  const cartKey = item.selectedVariant 
                    ? `${item.product.id}-${item.selectedVariant.size}` 
                    : item.product.id;
                  
                  return (
                    <div
                      key={cartKey}
                      className="flex gap-4 border-b pb-4"
                    >
                      <div className="relative w-20 h-20 bg-honey-50 rounded flex-shrink-0">
                        {item.product.image_url ? (
                          <Image
                            src={item.product.image_url}
                            alt={item.product.name}
                            fill
                            className="object-cover rounded"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-honey-300">
                            🍯
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">
                          {item.product.name}
                        </h3>
                        {item.selectedVariant && (
                          <p className="text-sm text-gray-500">
                            Size: {item.selectedVariant.size}
                          </p>
                        )}
                        <p className="text-honey-600 font-semibold">
                          {formatPrice(displayPrice)}
                        </p>

                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity - 1, item.selectedVariant)
                            }
                            className="w-8 h-8 rounded border border-gray-300 hover:bg-gray-100"
                          >
                            −
                          </button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity + 1, item.selectedVariant)
                            }
                            className="w-8 h-8 rounded border border-gray-300 hover:bg-gray-100"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.product.id, item.selectedVariant)}
                          className="ml-auto text-red-500 hover:text-red-700 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total and Checkout */}
              <div className="border-t pt-4">
                <div className="flex justify-between mb-4">
                  <span className="text-lg font-semibold">Total:</span>
                  <span className="text-2xl font-bold text-honey-600">
                    {formatPrice(getCartTotal())}
                  </span>
                </div>

                <Link
                  href="/cart"
                  onClick={onClose}
                  className="block w-full bg-honey-600 text-white text-center py-3 rounded-lg hover:bg-honey-700 transition-colors font-medium mb-2"
                >
                  View Cart
                </Link>

                <Link
                  href="/checkout"
                  onClick={onClose}
                  className="block w-full bg-honey-800 text-white text-center py-3 rounded-lg hover:bg-honey-900 transition-colors font-medium"
                >
                  Proceed to Checkout
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
