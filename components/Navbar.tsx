'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const { getCartCount } = useCart();
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const cartCount = getCartCount();
  const isHomePage = pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Determine if navbar should have background
  const shouldShowBackground = !isHomePage || scrolled;

  return (
    <nav 
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        shouldShowBackground
          ? 'bg-gradient-to-r from-honey-800/95 via-honey-700/95 to-honey-800/95 backdrop-blur-lg shadow-2xl' 
          : 'bg-transparent shadow-none'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex justify-between items-center transition-all duration-300 ${
          scrolled ? 'h-20' : 'h-20'
        }`}>
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            {/* Honeycomb Logo */}
            <div className={`relative transform group-hover:scale-105 transition-all duration-300 w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20`}>
              <Image 
                src="/honeycomb-logo.png" 
                alt="Seujia Honey Logo" 
                fill 
                className="object-contain drop-shadow-2xl" 
                priority
              />
            </div>
            {/* Seujia Text Logo */}
            <div className={`relative transform group-hover:scale-105 transition-all duration-300 w-20 h-14 sm:w-24 sm:h-16 md:w-32 md:h-20`}>
              <Image 
                src="/logo.png" 
                alt="Seujia Honey" 
                fill 
                className="object-contain drop-shadow-2xl" 
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-3">
            <Link 
              href="/" 
              className="px-4 py-2 rounded-lg hover:bg-white hover:bg-opacity-20 transition-all duration-200 font-semibold text-white text-sm lg:text-base tracking-wide uppercase"
            >
              Home
            </Link>
            <Link 
              href="/shop" 
              className="px-4 py-2 rounded-lg hover:bg-white hover:bg-opacity-20 transition-all duration-200 font-semibold text-white text-sm lg:text-base tracking-wide uppercase"
            >
              Shop
            </Link>
            <Link 
              href="/orders" 
              className="px-4 py-2 rounded-lg hover:bg-white hover:bg-opacity-20 transition-all duration-200 font-semibold text-white text-sm lg:text-base tracking-wide uppercase"
            >
              Orders
            </Link>
            <Link 
              href="/track-order" 
              className="px-4 py-2 rounded-lg hover:bg-white hover:bg-opacity-20 transition-all duration-200 font-semibold text-white text-sm lg:text-base tracking-wide uppercase"
            >
              Track
            </Link>
            <Link 
              href="/cart" 
              className="relative px-4 py-2 rounded-lg hover:bg-white hover:bg-opacity-20 transition-all duration-200 font-semibold text-white text-sm lg:text-base tracking-wide uppercase ml-2"
            >
              <div className="flex items-center space-x-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>Cart</span>
              </div>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center shadow-lg animate-pulse">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Auth Section */}
            {user ? (
              <div className="relative ml-4">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-white hover:bg-opacity-20 transition-all duration-200 font-semibold text-white text-sm lg:text-base"
                >
                  <div className="w-8 h-8 bg-honey-500 rounded-full flex items-center justify-center text-white font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden lg:inline">{user.name.split(' ')[0]}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-600 truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        logout();
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2 ml-4">
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-lg hover:bg-white hover:bg-opacity-20 transition-all duration-200 font-semibold text-white text-sm lg:text-base"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 rounded-lg bg-white text-honey-700 hover:bg-honey-50 transition-all duration-200 font-semibold text-sm lg:text-base"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-white hover:bg-opacity-20 transition-colors text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className={`transition-all duration-300 ${scrolled ? 'h-7 w-7' : 'h-8 w-8'}`}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {mobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className={`md:hidden pb-4 pt-2 border-t transition-all duration-500 ${
            shouldShowBackground 
              ? 'border-white/20 bg-gradient-to-r from-honey-800/95 via-honey-700/95 to-honey-800/95 backdrop-blur-lg' 
              : 'border-white/30 bg-black/60 backdrop-blur-xl'
          }`}>
            <Link
              href="/"
              className="block py-3 px-4 rounded-lg hover:bg-white hover:bg-opacity-20 transition-all duration-200 font-semibold text-white uppercase tracking-wide"
              onClick={() => setMobileMenuOpen(false)}
            >
              🏠 Home
            </Link>
            <Link
              href="/shop"
              className="block py-3 px-4 rounded-lg hover:bg-white hover:bg-opacity-20 transition-all duration-200 font-semibold text-white uppercase tracking-wide"
              onClick={() => setMobileMenuOpen(false)}
            >
              🛍️ Shop
            </Link>
            <Link
              href="/orders"
              className="block py-3 px-4 rounded-lg hover:bg-white hover:bg-opacity-20 transition-all duration-200 font-semibold text-white uppercase tracking-wide"
              onClick={() => setMobileMenuOpen(false)}
            >
              📦 Orders
            </Link>
            <Link
              href="/track-order"
              className="block py-3 px-4 rounded-lg hover:bg-white hover:bg-opacity-20 transition-all duration-200 font-semibold text-white uppercase tracking-wide"
              onClick={() => setMobileMenuOpen(false)}
            >
              🔍 Track
            </Link>
            <Link
              href="/cart"
              className="block py-3 px-4 rounded-lg hover:bg-white hover:bg-opacity-20 transition-all duration-200 font-semibold text-white uppercase tracking-wide"
              onClick={() => setMobileMenuOpen(false)}
            >
              🛒 Cart {cartCount > 0 && <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">{cartCount}</span>}
            </Link>
            
            {/* Mobile Auth Section */}
            <div className="mt-2 pt-2 border-t border-white/20">
              {user ? (
                <>
                  <div className="px-4 py-2 text-white">
                    <p className="text-sm font-semibold">👤 {user.name}</p>
                    <p className="text-xs text-honey-200">{user.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left py-3 px-4 rounded-lg hover:bg-white hover:bg-opacity-20 transition-all duration-200 font-semibold text-white"
                  >
                    🚪 Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="block py-3 px-4 rounded-lg hover:bg-white hover:bg-opacity-20 transition-all duration-200 font-semibold text-white"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    🔑 Login
                  </Link>
                  <Link
                    href="/signup"
                    className="block py-3 px-4 mt-2 mx-4 rounded-lg bg-white text-honey-700 hover:bg-honey-50 transition-all duration-200 font-semibold text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    ✨ Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
