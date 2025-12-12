'use client';

import { useEffect, useState } from 'react';
import ProductCard from '@/components/ProductCard';
import ComingSoonCard from '@/components/ComingSoonCard';
import { Product } from '@/types';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Add cache busting parameter
        const timestamp = new Date().getTime();
        const res = await fetch(`/api/products?limit=4&_=${timestamp}`, {
          cache: 'no-store',
        });
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        console.log('Fetched products:', data);
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Full-Screen Hero Section with Background Image - Extended to cover navbar */}
      <section className="relative min-h-screen w-full overflow-hidden -mt-20 pt-20">
        {/* Background Image Layer - Extended to top */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/hero-bg.jpg" 
            alt="Honey Background" 
            fill 
            className="object-cover" 
            priority
          />
          {/* Overlay for better text readability - Increased opacity */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/40"></div>
        </div>

        {/* Content Layer - Adjusted padding for navbar */}
        <div className="relative z-10 min-h-screen flex items-center pt-24 sm:pt-28 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            {/* Text Content and Shop Button - All on Left */}
            <div className="max-w-3xl">
              <div className="text-white space-y-6 sm:space-y-8">
                {/* Company Motto */}
                <div className="inline-block">
                  <div className="bg-gradient-to-r from-yellow-400/20 to-honey-400/20 backdrop-blur-md px-6 py-3 rounded-full border-2 border-yellow-400/50 shadow-xl">
                    <p className="text-yellow-300 font-bold text-lg sm:text-xl tracking-wide" style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)' }}>
                      Nature's Trust, Seujia's Promise
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-tight">
                    <span className="block text-white" style={{ textShadow: '0 4px 12px rgba(0, 0, 0, 0.8), 0 2px 4px rgba(0, 0, 0, 0.9)' }}>
                      Pure
                    </span>
                    <span className="block text-white" style={{ textShadow: '0 4px 12px rgba(0, 0, 0, 0.8), 0 2px 4px rgba(0, 0, 0, 0.9)' }}>Natural</span>
                    <span className="block text-yellow-300" style={{ textShadow: '0 4px 12px rgba(0, 0, 0, 0.9), 0 2px 4px rgba(0, 0, 0, 1)' }}>Honey</span>
                  </h1>
                  <div className="h-1 w-24 sm:w-32 bg-gradient-to-r from-yellow-400 to-honey-400 rounded-full shadow-lg"></div>
                </div>
                
                <p className="text-lg sm:text-xl md:text-2xl text-white font-medium leading-relaxed" style={{ textShadow: '0 3px 8px rgba(0, 0, 0, 0.8), 0 1px 3px rgba(0, 0, 0, 1)' }}>
                  Where nature's trust meets our promise. Straight from the hive to your table, 
                  our premium honey brings you authentic taste and uncompromising quality.
                </p>

                <div className="flex flex-wrap gap-3 sm:gap-4">
                  <div className="bg-white/20 backdrop-blur-md px-4 sm:px-6 py-2 sm:py-3 rounded-full border border-white/30 shadow-lg">
                    <span className="text-white font-semibold text-sm sm:text-base" style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.6)' }}>🌿 100% Natural</span>
                  </div>
                  <div className="bg-white/20 backdrop-blur-md px-4 sm:px-6 py-2 sm:py-3 rounded-full border border-white/30 shadow-lg">
                    <span className="text-white font-semibold text-sm sm:text-base" style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.6)' }}>🐝 Raw & Unfiltered</span>
                  </div>
                  <div className="bg-white/20 backdrop-blur-md px-4 sm:px-6 py-2 sm:py-3 rounded-full border border-white/30 shadow-lg">
                    <span className="text-white font-semibold text-sm sm:text-base" style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.6)' }}>✨ Premium Quality</span>
                  </div>
                </div>

                {/* Shop All Button - Below Text */}
                <div className="pt-4">
                  <Link
                    href="/shop"
                    className="group relative inline-block"
                  >
                    <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-honey-400 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-500 group-hover:duration-200 animate-pulse"></div>
                    <button className="relative px-8 sm:px-12 py-4 sm:py-6 bg-white rounded-2xl leading-none flex items-center space-x-4 sm:space-x-6 shadow-2xl hover:shadow-yellow-500/50 transition-all duration-300 transform group-hover:scale-105">
                      <span className="text-honey-700 font-bold text-xl sm:text-2xl md:text-3xl">Shop All</span>
                      <svg 
                        className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-honey-600 group-hover:translate-x-2 transition-transform duration-300" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
          <button
            onClick={() => {
              document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="text-white/80 hover:text-white transition-colors"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-gradient-to-b from-white to-honey-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block mb-6">
              <span className="text-honey-600 font-bold text-xl mb-2 block">Nature's Trust, Seujia's Promise</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-honey-800 mb-4">Our Commitment to You</h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto mb-6">
              We honor nature's gift with unwavering dedication to purity, authenticity, and sustainability
            </p>
            <div className="h-1 w-24 bg-gradient-to-r from-honey-400 to-honey-600 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="group text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-t-4 border-honey-400">
              <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300">🌿</div>
              <h3 className="text-2xl font-bold mb-3 text-honey-800">Nature's Trust</h3>
              <p className="text-gray-600 leading-relaxed">We respect and preserve the natural ecosystem, ensuring our honey is 100% pure, raw, and unprocessed</p>
            </div>
            
            <div className="group text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-t-4 border-honey-500">
              <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300">🤝</div>
              <h3 className="text-2xl font-bold mb-3 text-honey-800">Seujia's Promise</h3>
              <p className="text-gray-600 leading-relaxed">Our commitment to delivering premium quality, authentic honey you can trust—every single time</p>
            </div>
            
            <div className="group text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-t-4 border-honey-600">
              <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300">❤️</div>
              <h3 className="text-2xl font-bold mb-3 text-honey-800">Community Care</h3>
              <p className="text-gray-600 leading-relaxed">Supporting local beekeepers and sustainable practices that benefit both people and planet</p>
            </div>
          </div>

          {/* Seasonal Flavor Notice */}
          <div className="max-w-4xl mx-auto mt-12">
            <div className="bg-gradient-to-r from-amber-50 to-honey-100 border-l-4 border-honey-500 rounded-lg p-6 shadow-md">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-honey-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-semibold text-honey-900 mb-2">🍯 Natural Flavor Variations</h3>
                  <p className="text-honey-800 leading-relaxed">
                    Please note that the flavor, color, and aroma of our honey may vary according to the season and the flowers available during harvest. 
                    This is a natural characteristic of pure, raw honey and a testament to its authenticity. Each batch is unique and captures the essence of nature at that particular time.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section id="shop-preview" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-honey-800 mb-6">Featured Products</h2>
            <p className="text-gray-600 text-xl max-w-2xl mx-auto">Discover our most popular honey selections, handpicked for their exceptional quality and flavor</p>
            <div className="h-1 w-24 bg-gradient-to-r from-honey-400 to-honey-600 mx-auto rounded-full mt-6"></div>
          </div>

          {loading ? (
            <div className="flex flex-col justify-center items-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-honey-600 mb-4"></div>
              <p className="text-honey-700 font-medium">Loading our finest honey...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
                {/* Show Coming Soon card on homepage too */}
                {products.length >= 3 && <ComingSoonCard />}
              </div>

              <div className="text-center">
                <Link
                  href="/shop"
                  className="group inline-flex items-center space-x-3 bg-gradient-to-r from-honey-600 to-honey-700 text-white px-10 py-4 rounded-xl font-bold text-lg hover:from-honey-700 hover:to-honey-800 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
                >
                  <span>View All Products</span>
                  <svg 
                    className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
