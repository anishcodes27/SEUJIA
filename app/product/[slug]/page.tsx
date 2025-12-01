'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Product, ProductVariant } from '@/types';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import Button from '@/components/Button';
import ProductReviews from '@/components/ProductReviews';

export default function ProductPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>();
  const { addToCart } = useCart();

  // Get current price and stock based on variant or product
  const currentPrice = selectedVariant ? selectedVariant.price : product?.price || 0;
  const currentStock = selectedVariant ? selectedVariant.stock : product?.stock || 0;

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await fetch(`/api/product/${slug}`);
        if (response.ok) {
          const data = await response.json();
          setProduct(data);
          // Set default variant if variants exist
          if (data.variants && data.variants.length > 0) {
            setSelectedVariant(data.variants[0]);
          }
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [slug]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity, selectedVariant);
      alert('Added to cart!');
    }
  };

  if (loading) {
    return (
      <div className="pt-24 sm:pt-28 md:pt-32 min-h-screen bg-honey-50">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-honey-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-24 sm:pt-28 md:pt-32 min-h-screen bg-honey-50">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h1>
            <a href="/shop" className="text-honey-600 hover:text-honey-700">
              Back to shop
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 sm:pt-28 md:pt-32 min-h-screen bg-honey-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="relative bg-honey-50 rounded-lg overflow-hidden" style={{ aspectRatio: '1/1' }}>
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-honey-300">
              <span className="text-9xl">🍯</span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
          
          {/* Variant Selector */}
          {product.variants && product.variants.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Size
              </label>
              <div className="flex gap-3">
                {product.variants.map((variant) => (
                  <button
                    key={variant.size}
                    onClick={() => setSelectedVariant(variant)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedVariant?.size === variant.size
                        ? 'bg-honey-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {variant.size}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <p className="text-3xl font-bold text-honey-600 mb-6">
            {formatPrice(currentPrice)}
          </p>

          <div className="prose prose-lg mb-8">
            <p className="text-gray-700">{product.description}</p>
          </div>

          {/* Stock Status */}
          {currentStock > 0 ? (
            <p className="text-green-600 font-medium mb-6">
              ✓ In Stock ({currentStock} available)
            </p>
          ) : (
            <p className="text-red-600 font-medium mb-6">
              ✗ Out of Stock
            </p>
          )}

          {/* Quantity Selector */}
          {currentStock > 0 && (
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded border border-gray-300 hover:bg-gray-100 text-lg font-medium"
                >
                  −
                </button>
                <span className="text-xl font-medium w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                  className="w-10 h-10 rounded border border-gray-300 hover:bg-gray-100 text-lg font-medium"
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* Add to Cart Button */}
          <Button
            onClick={handleAddToCart}
            disabled={currentStock === 0}
            className="w-full md:w-auto"
          >
            Add to Cart
          </Button>
        </div>
      </div>

      {/* Product Reviews Section */}
      <div className="mt-16 border-t border-honey-200 pt-12">
        <ProductReviews productId={product.id} productName={product.name} />
      </div>
    </div>
    </div>
  );
}
