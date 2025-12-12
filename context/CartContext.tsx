'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { CartItem, Product, ProductVariant } from '@/types';
import { useAuth } from './AuthContext';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, variant?: ProductVariant) => void;
  removeFromCart: (productId: string, variant?: ProductVariant) => void;
  updateQuantity: (productId: string, quantity: number, variant?: ProductVariant) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  showToast: (message: string, type?: 'success' | 'error') => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const { user } = useAuth();

  // Load cart from localStorage on mount or when user changes
  useEffect(() => {
    const cartKey = user ? `seujia_cart_${user.id}` : 'seujia_cart_guest';
    const savedCart = localStorage.getItem(cartKey);
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart:', error);
      }
    } else {
      setCart([]);
    }
    setIsLoaded(true);
  }, [user]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      const cartKey = user ? `seujia_cart_${user.id}` : 'seujia_cart_guest';
      localStorage.setItem(cartKey, JSON.stringify(cart));
    }
  }, [cart, isLoaded, user]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    console.log('Toast triggered:', message, type);
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const addToCart = (product: Product, quantity: number = 1, variant?: ProductVariant) => {
    const existingItem = cart.find((item) => {
      if (variant) {
        return item.product.id === product.id && item.selectedVariant?.size === variant.size;
      }
      return item.product.id === product.id;
    });
    
    const displayName = variant ? `${product.name} (${variant.size})` : product.name;
    
    if (existingItem) {
      setCart((prevCart) =>
        prevCart.map((item) => {
          if (variant) {
            return item.product.id === product.id && item.selectedVariant?.size === variant.size
              ? { ...item, quantity: item.quantity + quantity }
              : item;
          }
          return item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item;
        })
      );
      showToast(`Updated ${displayName} quantity in cart!`, 'success');
    } else {
      setCart((prevCart) => [...prevCart, { product, quantity, selectedVariant: variant }]);
      showToast(`${displayName} added to cart!`, 'success');
    }
  };

  const removeFromCart = (productId: string, variant?: ProductVariant) => {
    setCart((prevCart) => prevCart.filter((item) => {
      if (variant) {
        return !(item.product.id === productId && item.selectedVariant?.size === variant.size);
      }
      return item.product.id !== productId;
    }));
  };

  const updateQuantity = (productId: string, quantity: number, variant?: ProductVariant) => {
    if (quantity <= 0) {
      removeFromCart(productId, variant);
      return;
    }
    
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (variant) {
          if (item.product.id === productId && item.selectedVariant?.size === variant.size) {
            // Check stock limit for variant
            const maxStock = variant.stock;
            const limitedQuantity = Math.min(quantity, maxStock);
            return { ...item, quantity: limitedQuantity };
          }
          return item;
        }
        if (item.product.id === productId) {
          // Check stock limit for base product
          const maxStock = item.product.stock;
          const limitedQuantity = Math.min(quantity, maxStock);
          return { ...item, quantity: limitedQuantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const price = item.selectedVariant ? item.selectedVariant.price : item.product.price;
      return total + price * item.quantity;
    }, 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
        showToast,
      }}
    >
      {children}
      {/* Toast Notification */}
      {toast && (
        <div
          style={{ bottom: '24px', left: '24px', top: 'auto' }}
          className={`fixed px-8 py-4 rounded-lg shadow-2xl z-[9999] animate-slide-up ${
            toast.type === 'success' 
              ? 'bg-white border-2 border-green-600' 
              : 'bg-white border-2 border-red-600'
          } font-bold text-lg`}
        >
          <div className="flex items-center gap-3">
            {toast.type === 'success' && (
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
            <span className={toast.type === 'success' ? 'text-green-600' : 'text-red-600'}>
              {toast.message}
            </span>
          </div>
        </div>
      )}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
