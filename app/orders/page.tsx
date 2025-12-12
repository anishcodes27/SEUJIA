'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';
import Button from '@/components/Button';

interface OrderItem {
  id: string;
  product_name: string;
  product_price: number;
  quantity: number;
  subtotal: number;
}

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  shipping_address: string;
  subtotal: number;
  discount_amount: number;
  delivery_charges?: number;
  total: number;
  coupon_code?: string;
  payment_provider: string;
  payment_status: string;
  order_status: string;
  awb_code?: string;
  courier_name?: string;
  shipment_status?: string;
  created_at: string;
  order_items: OrderItem[];
}

export default function OrdersPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [showEmailForm, setShowEmailForm] = useState(false);

  useEffect(() => {
    if (user) {
      // Auto-load orders for logged-in users
      fetchOrders();
      setShowEmailForm(false);
    } else {
      // Show email form for guest users
      setShowEmailForm(true);
      setLoading(false);
    }
  }, [user]);

  const fetchOrders = async (email?: string) => {
    const emailToUse = email || user?.email;
    
    if (!emailToUse) return;
    
    setLoading(true);
    setError('');
    
    console.log('Fetching orders for email:', emailToUse);
    
    try {
      const response = await fetch(`/api/user/orders?email=${encodeURIComponent(emailToUse)}`);
      const data = await response.json();

      console.log('Orders API response:', data);

      if (response.ok) {
        setOrders(data.orders || []);
        console.log('Orders set:', data.orders?.length || 0);
        if (email) {
          setShowEmailForm(false);
        }
      } else {
        setError(data.error || 'Failed to fetch orders');
      }
    } catch (err) {
      setError('Failed to load orders');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGuestEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (guestEmail.trim()) {
      fetchOrders(guestEmail.trim());
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return '✅';
      case 'shipped':
        return '🚚';
      case 'processing':
        return '📦';
      case 'pending':
        return '⏳';
      case 'cancelled':
        return '❌';
      default:
        return '📋';
    }
  };

  if (loading) {
    return (
      <div className="pt-24 sm:pt-28 md:pt-32 min-h-screen bg-honey-50">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-honey-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-24 sm:pt-28 md:pt-32 min-h-screen bg-honey-50">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 sm:pt-28 md:pt-32 min-h-screen bg-honey-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <Link href="/shop">
            <Button variant="secondary">Continue Shopping</Button>
          </Link>
        </div>

        {/* Email Form for Guest Users */}
        {showEmailForm && (
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <div className="max-w-md mx-auto text-center">
              <div className="text-5xl mb-4">📧</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                View Your Orders
              </h2>
              <p className="text-gray-600 mb-6">
                Enter the email address you used during checkout to view your orders
              </p>
              <form onSubmit={handleGuestEmailSubmit} className="space-y-4">
                <input
                  type="email"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  placeholder="your-email@example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-honey-500"
                  required
                />
                <Button type="submit" className="w-full" isLoading={loading}>
                  View My Orders
                </Button>
              </form>
              <p className="text-sm text-gray-500 mt-4">
                Or <Link href="/login" className="text-honey-600 hover:underline">login</Link> to see all your orders
              </p>
            </div>
          </div>
        )}

        {!showEmailForm && orders.length === 0 && !loading ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Orders Yet</h2>
            <p className="text-gray-600 mb-6">
              You haven't placed any orders yet. Start shopping to see your orders here!
            </p>
            <div className="space-y-4">
              <Link href="/shop">
                <Button>Start Shopping</Button>
              </Link>
              <div className="text-sm text-gray-500">
                <p>Debugging info:</p>
                <p>Email being searched: {user?.email || guestEmail || 'none'}</p>
                <button 
                  onClick={async () => {
                    const res = await fetch('/api/debug/orders');
                    const data = await res.json();
                    console.log('All orders in database:', data);
                    alert(`Total orders in database: ${data.total_orders}. Check console for details.`);
                  }}
                  className="text-honey-600 hover:underline mt-2"
                >
                  Check all orders (debug)
                </button>
              </div>
            </div>
          </div>
        ) : !showEmailForm && orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Order Header */}
                <div className="bg-gradient-to-r from-honey-100 to-honey-50 px-6 py-4 border-b">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Order Number</p>
                      <p className="font-bold text-lg text-gray-900 font-mono">{order.order_number}</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.order_status)}`}>
                        {getStatusIcon(order.order_status)} {order.order_status.toUpperCase()}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPaymentStatusColor(order.payment_status)}`}>
                        💳 {order.payment_status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-600">
                    <span>📅 {new Date(order.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}</span>
                    <span>💰 Payment: {order.payment_provider.toUpperCase()}</span>
                    {order.courier_name && (
                      <span>🚚 {order.courier_name}</span>
                    )}
                  </div>
                </div>

                {/* Order Items */}
                <div className="px-6 py-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Order Items</h3>
                  <div className="space-y-3">
                    {order.order_items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{item.product_name}</p>
                          <p className="text-sm text-gray-600">
                            Quantity: {item.quantity} × {formatPrice(item.product_price)}
                          </p>
                        </div>
                        <p className="font-semibold text-gray-900">{formatPrice(item.subtotal)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="bg-gray-50 px-6 py-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900">{formatPrice(order.subtotal)}</span>
                  </div>
                  {order.discount_amount > 0 && (
                    <div className="flex justify-between items-center mb-2 text-green-600">
                      <span>Discount {order.coupon_code && `(${order.coupon_code})`}</span>
                      <span>-{formatPrice(order.discount_amount)}</span>
                    </div>
                  )}
                  {order.delivery_charges && order.delivery_charges > 0 && (
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">
                        Delivery Charges {order.payment_provider === 'cod' && '(COD)'}
                      </span>
                      <span className="text-gray-900">{formatPrice(order.delivery_charges)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                    <span className="font-bold text-lg text-gray-900">Total</span>
                    <span className="font-bold text-lg text-honey-600">{formatPrice(order.total)}</span>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="px-6 py-4 border-t">
                  <p className="text-sm font-semibold text-gray-700 mb-1">Shipping Address</p>
                  <p className="text-sm text-gray-600">{order.shipping_address}</p>
                </div>

                {/* Action Buttons */}
                <div className="px-6 py-4 bg-gray-50 border-t flex flex-wrap gap-3">
                  {order.awb_code && (
                    <Link href={`/track-order?awb=${order.awb_code}`}>
                      <Button variant="secondary" className="text-sm">
                        🔍 Track Order
                      </Button>
                    </Link>
                  )}
                  {order.order_status === 'delivered' && (
                    <Button variant="secondary" className="text-sm" onClick={() => {
                      // Navigate to product page for review
                      alert('Review feature - Navigate to product page');
                    }}>
                      ⭐ Write Review
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
