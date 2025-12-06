'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button';
import { Product, Coupon, Order } from '@/types';
import { formatPrice } from '@/lib/utils';

export default function AdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'products' | 'coupons' | 'orders'>('orders');
  
  // Products state
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    stock: '',
    image_url: '',
  });
  
  // Coupons state
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [couponForm, setCouponForm] = useState({
    code: '',
    discount_type: 'percentage' as 'percentage' | 'fixed',
    discount_value: '',
    min_order_value: '',
    max_uses: '',
  });

  // Orders state
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [trackingForm, setTrackingForm] = useState({
    awbCode: '',
    courierName: '',
    trackingUrl: '',
    shipmentStatus: 'shipped',
    estimatedDelivery: '',
  });

  useEffect(() => {
    const auth = localStorage.getItem('admin_authenticated');
    if (auth === 'true') {
      setIsAuthenticated(true);
      loadData();
    }
  }, [activeTab]);

  const handleLogin = () => {
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD || password === 'admin123') {
      localStorage.setItem('admin_authenticated', 'true');
      setIsAuthenticated(true);
      loadData();
    } else {
      alert('Invalid password');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated');
    setIsAuthenticated(false);
    router.push('/');
  };

  const loadData = async () => {
    if (activeTab === 'products') {
      const response = await fetch('/api/admin/products');
      const { products: data } = await response.json();
      if (data) setProducts(data);
    } else if (activeTab === 'coupons') {
      const response = await fetch('/api/admin/coupons');
      const { coupons: data } = await response.json();
      if (data) setCoupons(data);
    } else if (activeTab === 'orders') {
      const response = await fetch('/api/admin/orders');
      const { orders: data } = await response.json();
      if (data) setOrders(data);
    }
  };

  const handleSaveProduct = async () => {
    const productData = {
      name: productForm.name,
      slug: productForm.slug || productForm.name.toLowerCase().replace(/\s+/g, '-'),
      description: productForm.description,
      price: parseFloat(productForm.price),
      stock: parseInt(productForm.stock),
      image_url: productForm.image_url,
      category: 'honey',
    };

    const method = editingProduct ? 'PUT' : 'POST';
    const body = editingProduct ? { ...productData, id: editingProduct.id } : productData;

    await fetch('/api/admin/products', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    setProductForm({ name: '', slug: '', description: '', price: '', stock: '', image_url: '' });
    setEditingProduct(null);
    loadData();
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' });
      loadData();
    }
  };

  const handleSaveCoupon = async () => {
    const couponData = {
      code: couponForm.code.toUpperCase(),
      discount_type: couponForm.discount_type,
      discount_value: parseFloat(couponForm.discount_value),
      min_order_value: parseFloat(couponForm.min_order_value) || 0,
      max_uses: couponForm.max_uses ? parseInt(couponForm.max_uses) : null,
    };

    const method = editingCoupon ? 'PUT' : 'POST';
    const body = editingCoupon ? { ...couponData, id: editingCoupon.id } : couponData;

    await fetch('/api/admin/coupons', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    setCouponForm({ code: '', discount_type: 'percentage', discount_value: '', min_order_value: '', max_uses: '' });
    setEditingCoupon(null);
    loadData();
  };

  const handleDeleteCoupon = async (id: string) => {
    if (confirm('Are you sure you want to delete this coupon?')) {
      await fetch(`/api/admin/coupons?id=${id}`, { method: 'DELETE' });
      loadData();
    }
  };

  const handleUpdateTracking = async () => {
    if (!selectedOrder) return;

    if (!trackingForm.awbCode || !trackingForm.courierName) {
      alert('AWB Code and Courier Name are required');
      return;
    }

    try {
      const response = await fetch('/api/admin/update-tracking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: selectedOrder.id,
          awbCode: trackingForm.awbCode,
          courierName: trackingForm.courierName,
          trackingUrl: trackingForm.trackingUrl,
          shipmentStatus: trackingForm.shipmentStatus,
          estimatedDelivery: trackingForm.estimatedDelivery,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Tracking information updated successfully! Email sent to customer.');
        setSelectedOrder(null);
        setTrackingForm({
          awbCode: '',
          courierName: '',
          trackingUrl: '',
          shipmentStatus: 'shipped',
          estimatedDelivery: '',
        });
        loadData();
      } else {
        alert(data.error || 'Failed to update tracking information');
      }
    } catch (error) {
      console.error('Error updating tracking:', error);
      alert('Failed to update tracking information');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // For now, we'll just use a placeholder or require URL input
    // You can implement image upload to Supabase storage or use a service like Cloudinary
    alert('Please use the Image URL field to add product images');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-honey-50">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Admin Login</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            placeholder="Enter admin password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-honey-500"
          />
          <Button onClick={handleLogin} className="w-full">
            Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-honey-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <div className="flex gap-4">
            <Button onClick={() => router.push('/admin/products')} variant="secondary">
              Product Manager
            </Button>
            <Button onClick={handleLogout} variant="secondary">
              Logout
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b">
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-2 px-4 ${activeTab === 'orders' ? 'border-b-2 border-honey-600 text-honey-600 font-medium' : 'text-gray-600'}`}
          >
            Orders & Tracking
          </button>
          <button
            onClick={() => setActiveTab('coupons')}
            className={`pb-2 px-4 ${activeTab === 'coupons' ? 'border-b-2 border-honey-600 text-honey-600 font-medium' : 'text-gray-600'}`}
          >
            Coupons
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`pb-2 px-4 ${activeTab === 'products' ? 'border-b-2 border-honey-600 text-honey-600 font-medium' : 'text-gray-600'}`}
          >
            Products (Old)
          </button>
        </div>

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">{editingProduct ? 'Edit' : 'Add'} Product</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Product Name"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="px-4 py-2 border rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Slug (auto-generated if empty)"
                  value={productForm.slug}
                  onChange={(e) => setProductForm({ ...productForm, slug: e.target.value })}
                  className="px-4 py-2 border rounded-lg"
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={productForm.price}
                  onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                  className="px-4 py-2 border rounded-lg"
                />
                <input
                  type="number"
                  placeholder="Stock"
                  value={productForm.stock}
                  onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                  className="px-4 py-2 border rounded-lg"
                />
                <textarea
                  placeholder="Description"
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="px-4 py-2 border rounded-lg md:col-span-2"
                  rows={3}
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="px-4 py-2 border rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Image URL"
                  value={productForm.image_url}
                  onChange={(e) => setProductForm({ ...productForm, image_url: e.target.value })}
                  className="px-4 py-2 border rounded-lg"
                />
              </div>
              <div className="flex gap-2 mt-4">
                <Button onClick={handleSaveProduct}>Save Product</Button>
                {editingProduct && (
                  <Button onClick={() => { setEditingProduct(null); setProductForm({ name: '', slug: '', description: '', price: '', stock: '', image_url: '' }); }} variant="secondary">
                    Cancel
                  </Button>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500">{product.slug}</div>
                      </td>
                      <td className="px-6 py-4">{formatPrice(product.price)}</td>
                      <td className="px-6 py-4">{product.stock}</td>
                      <td className="px-6 py-4 space-x-2">
                        <button
                          onClick={() => {
                            setEditingProduct(product);
                            setProductForm({
                              name: product.name,
                              slug: product.slug,
                              description: product.description || '',
                              price: product.price.toString(),
                              stock: product.stock.toString(),
                              image_url: product.image_url || '',
                            });
                          }}
                          className="text-honey-600 hover:text-honey-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Coupons Tab */}
        {activeTab === 'coupons' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">{editingCoupon ? 'Edit' : 'Add'} Coupon</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Coupon Code"
                  value={couponForm.code}
                  onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })}
                  className="px-4 py-2 border rounded-lg"
                />
                <select
                  value={couponForm.discount_type}
                  onChange={(e) => setCouponForm({ ...couponForm, discount_type: e.target.value as 'percentage' | 'fixed' })}
                  className="px-4 py-2 border rounded-lg"
                >
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed Amount</option>
                </select>
                <input
                  type="number"
                  placeholder="Discount Value"
                  value={couponForm.discount_value}
                  onChange={(e) => setCouponForm({ ...couponForm, discount_value: e.target.value })}
                  className="px-4 py-2 border rounded-lg"
                />
                <input
                  type="number"
                  placeholder="Min Order Value (optional)"
                  value={couponForm.min_order_value}
                  onChange={(e) => setCouponForm({ ...couponForm, min_order_value: e.target.value })}
                  className="px-4 py-2 border rounded-lg"
                />
                <input
                  type="number"
                  placeholder="Max Uses (optional)"
                  value={couponForm.max_uses}
                  onChange={(e) => setCouponForm({ ...couponForm, max_uses: e.target.value })}
                  className="px-4 py-2 border rounded-lg"
                />
              </div>
              <div className="flex gap-2 mt-4">
                <Button onClick={handleSaveCoupon}>Save Coupon</Button>
                {editingCoupon && (
                  <Button onClick={() => { setEditingCoupon(null); setCouponForm({ code: '', discount_type: 'percentage', discount_value: '', min_order_value: '', max_uses: '' }); }} variant="secondary">
                    Cancel
                  </Button>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Discount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Uses</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {coupons.map((coupon) => (
                    <tr key={coupon.id}>
                      <td className="px-6 py-4 font-mono">{coupon.code}</td>
                      <td className="px-6 py-4">
                        {coupon.discount_type === 'percentage' ? `${coupon.discount_value}%` : formatPrice(coupon.discount_value)}
                      </td>
                      <td className="px-6 py-4">{coupon.current_uses} / {coupon.max_uses || '∞'}</td>
                      <td className="px-6 py-4 space-x-2">
                        <button
                          onClick={() => {
                            setEditingCoupon(coupon);
                            setCouponForm({
                              code: coupon.code,
                              discount_type: coupon.discount_type,
                              discount_value: coupon.discount_value.toString(),
                              min_order_value: coupon.min_order_value.toString(),
                              max_uses: coupon.max_uses?.toString() || '',
                            });
                          }}
                          className="text-honey-600 hover:text-honey-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteCoupon(coupon.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {/* Add Tracking Form */}
            {selectedOrder && (
              <div className="bg-white p-6 rounded-lg shadow-md border-2 border-honey-200">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Add Tracking Info - Order #{selectedOrder.order_number}</h2>
                  <button
                    onClick={() => {
                      setSelectedOrder(null);
                      setTrackingForm({
                        awbCode: '',
                        courierName: '',
                        trackingUrl: '',
                        shipmentStatus: 'shipped',
                        estimatedDelivery: '',
                      });
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕ Close
                  </button>
                </div>
                
                <div className="bg-honey-50 p-4 rounded-lg mb-4">
                  <p className="text-sm text-gray-700"><strong>Customer:</strong> {selectedOrder.customer_name}</p>
                  <p className="text-sm text-gray-700"><strong>Email:</strong> {selectedOrder.customer_email}</p>
                  <p className="text-sm text-gray-700"><strong>Address:</strong> {selectedOrder.shipping_address}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      AWB Code / Tracking Number *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., ABC123456789"
                      value={trackingForm.awbCode}
                      onChange={(e) => setTrackingForm({ ...trackingForm, awbCode: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-honey-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Courier Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Delhivery, Blue Dart"
                      value={trackingForm.courierName}
                      onChange={(e) => setTrackingForm({ ...trackingForm, courierName: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-honey-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Shipment Status
                    </label>
                    <select
                      value={trackingForm.shipmentStatus}
                      onChange={(e) => setTrackingForm({ ...trackingForm, shipmentStatus: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-honey-500"
                    >
                      <option value="shipped">Shipped</option>
                      <option value="in_transit">In Transit</option>
                      <option value="out_for_delivery">Out for Delivery</option>
                      <option value="delivered">Delivered</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estimated Delivery
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., 3-5 days, Dec 10"
                      value={trackingForm.estimatedDelivery}
                      onChange={(e) => setTrackingForm({ ...trackingForm, estimatedDelivery: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-honey-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tracking URL (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., https://track.delhivery.com/..."
                      value={trackingForm.trackingUrl}
                      onChange={(e) => setTrackingForm({ ...trackingForm, trackingUrl: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-honey-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Leave empty to use default tracking page</p>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button onClick={handleUpdateTracking}>
                    📧 Save & Send Email to Customer
                  </Button>
                  <Button 
                    onClick={() => {
                      setSelectedOrder(null);
                      setTrackingForm({
                        awbCode: '',
                        courierName: '',
                        trackingUrl: '',
                        shipmentStatus: 'shipped',
                        estimatedDelivery: '',
                      });
                    }} 
                    variant="secondary"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {/* Orders Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order #</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order.id} className={order.awb_code ? 'bg-green-50' : ''}>
                      <td className="px-6 py-4 font-mono text-sm">{order.order_number}</td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium">{order.customer_name}</div>
                        <div className="text-sm text-gray-500">{order.customer_email}</div>
                        {order.awb_code && (
                          <div className="text-xs text-green-700 mt-1">
                            📦 {order.courier_name} - {order.awb_code}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 font-semibold">{formatPrice(order.total)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          order.payment_status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.payment_status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                          {order.order_status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            if (order.awb_code) {
                              setTrackingForm({
                                awbCode: order.awb_code || '',
                                courierName: order.courier_name || '',
                                trackingUrl: order.tracking_url || '',
                                shipmentStatus: order.shipment_status || 'shipped',
                                estimatedDelivery: order.estimated_delivery_date || '',
                              });
                            }
                          }}
                          className="text-honey-600 hover:text-honey-700 font-medium"
                        >
                          {order.awb_code ? '✏️ Edit' : '📦 Add'} Tracking
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
