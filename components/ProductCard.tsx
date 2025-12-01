'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product, ProductVariant } from '@/types';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { cart, addToCart, updateQuantity, removeFromCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  
  // State for selected variant
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product.variants && product.variants.length > 0 ? product.variants[0] : undefined
  );

  // Get current price and stock based on variant or product
  const currentPrice = selectedVariant ? selectedVariant.price : product.price;
  const currentStock = selectedVariant ? selectedVariant.stock : product.stock;

  // Check if product is already in cart with same variant
  const cartItem = cart.find((item) => {
    if (selectedVariant) {
      return item.product.id === product.id && 
             item.selectedVariant?.size === selectedVariant.size;
    }
    return item.product.id === product.id;
  });
  const quantityInCart = cartItem ? cartItem.quantity : 0;

  const handleAddToCart = () => {
    addToCart(product, 1, selectedVariant);
  };

  const handleIncrease = () => {
    if (quantityInCart < currentStock) {
      updateQuantity(product.id, quantityInCart + 1, selectedVariant);
    }
  };

  const handleDecrease = () => {
    if (quantityInCart > 1) {
      updateQuantity(product.id, quantityInCart - 1, selectedVariant);
    } else {
      removeFromCart(product.id, selectedVariant);
    }
  };

  return (
    <div 
      className="group relative bg-white rounded-2xl shadow-honey overflow-hidden hover:shadow-honey-lg transition-all duration-500 transform hover:-translate-y-2 border border-honey-100"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Shimmer effect on hover */}
      <div className={`absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none z-10`} />
      
      {/* Stock badge */}
      {currentStock > 0 && currentStock <= 5 && (
        <div className="absolute top-4 right-4 z-20 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
          Only {currentStock} left!
        </div>
      )}

      {/* In cart badge */}
      {quantityInCart > 0 && (
        <div className="absolute top-4 left-4 z-20 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
          </svg>
          {quantityInCart} in cart
        </div>
      )}
      
      <Link href={`/product/${product.slug}`}>
        <div className="relative h-72 bg-gradient-to-br from-honey-50 to-amber-50 overflow-hidden">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-8xl animate-float drop-shadow-lg">🍯</span>
            </div>
          )}
          
          {/* Overlay gradient on hover */}
          <div className={`absolute inset-0 bg-gradient-to-t from-black/30 to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
        </div>
      </Link>
      
      <div className="p-6">
        <Link href={`/product/${product.slug}`}>
          <h3 className="text-xl font-bold text-gray-900 mb-3 hover:text-honey-600 transition-colors line-clamp-2 group-hover:gradient-text">
            {product.name}
          </h3>
        </Link>
        
        {/* Variant Selector */}
        {product.variants && product.variants.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Select Size</p>
            <div className="flex gap-2 flex-wrap">
              {product.variants.map((variant) => (
                <button
                  key={variant.size}
                  onClick={() => setSelectedVariant(variant)}
                  className={`relative px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 transform hover:scale-105 ${
                    selectedVariant?.size === variant.size
                      ? 'bg-gradient-to-r from-honey-500 to-amber-500 text-white shadow-glow'
                      : 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 hover:from-honey-50 hover:to-amber-50 border border-gray-200'
                  }`}
                >
                  {variant.size}
                  {selectedVariant?.size === variant.size && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Price */}
        <div className="flex items-baseline gap-2 mb-4">
          <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-honey-600 to-amber-600">
            {formatPrice(currentPrice)}
          </p>
          <span className="text-sm text-gray-500 font-medium">per unit</span>
        </div>
        
        {/* Action Buttons */}
        {currentStock > 0 ? (
          quantityInCart > 0 ? (
            // Quantity Controls
            <div className="flex items-center justify-between bg-gradient-to-r from-honey-50 to-amber-50 rounded-xl p-3 border-2 border-honey-400 shadow-soft">
              <button
                onClick={handleDecrease}
                className="w-11 h-11 flex items-center justify-center bg-gradient-to-r from-honey-500 to-amber-500 text-white rounded-lg hover:from-honey-600 hover:to-amber-600 transition-all duration-300 font-bold text-xl shadow-md hover:shadow-lg transform hover:scale-110 active:scale-95"
              >
                −
              </button>
              <div className="text-center">
                <span className="text-2xl font-black text-honey-800 px-4 block">
                  {quantityInCart}
                </span>
                <span className="text-xs text-honey-600 font-medium">in cart</span>
              </div>
              <button
                onClick={handleIncrease}
                disabled={quantityInCart >= currentStock}
                className={`w-11 h-11 flex items-center justify-center rounded-lg font-bold text-xl shadow-md transition-all duration-300 transform hover:scale-110 active:scale-95 ${
                  quantityInCart >= currentStock
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-honey-500 to-amber-500 text-white hover:from-honey-600 hover:to-amber-600 hover:shadow-lg'
                }`}
              >
                +
              </button>
            </div>
          ) : (
            // Add to Cart Button
            <button
              onClick={handleAddToCart}
              className="group/btn relative w-full bg-gradient-to-r from-honey-500 to-amber-500 text-white py-3.5 px-6 rounded-xl hover:from-honey-600 hover:to-amber-600 transition-all duration-300 font-bold text-base shadow-honey hover:shadow-honey-lg transform hover:scale-105 active:scale-95 overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <svg className="w-5 h-5 group-hover/btn:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Add to Cart
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-honey-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
            </button>
          )
        ) : (
          <button
            disabled
            className="w-full bg-gradient-to-r from-gray-300 to-gray-400 text-gray-600 py-3.5 px-6 rounded-xl cursor-not-allowed font-bold text-base shadow-soft opacity-60"
          >
            <span className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Out of Stock
            </span>
          </button>
        )}
        
        {/* Stock info */}
        {currentStock > 0 && (
          <div className="mt-3 flex items-center justify-center gap-2">
            <div className={`w-2 h-2 rounded-full ${currentStock <= 5 ? 'bg-orange-500 animate-pulse' : 'bg-green-500'}`} />
            <p className={`text-xs font-semibold ${currentStock <= 5 ? 'text-orange-600' : 'text-green-600'}`}>
              {currentStock <= 5 ? `Only ${currentStock} left` : `${currentStock} in stock`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
