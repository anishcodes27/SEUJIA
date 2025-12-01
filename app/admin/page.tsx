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
  const [activeTab, setActiveTab] = useState<'products' | 'coupons' | 'orders'>('products');
  
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
          <Button onClick={handleLogout} variant="secondary">
            Logout
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b">
          <button
            onClick={() => setActiveTab('products')}
            className={`pb-2 px-4 ${activeTab === 'products' ? 'border-b-2 border-honey-600 text-honey-600 font-medium' : 'text-gray-600'}`}
          >
            Products
          </button>
          <button
            onClick={() => setActiveTab('coupons')}
            className={`pb-2 px-4 ${activeTab === 'coupons' ? 'border-b-2 border-honey-600 text-honey-600 font-medium' : 'text-gray-600'}`}
          >
            Coupons
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-2 px-4 ${activeTab === 'orders' ? 'border-b-2 border-honey-600 text-honey-600 font-medium' : 'text-gray-600'}`}
          >
            Orders
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
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 font-mono text-sm">{order.order_number}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium">{order.customer_name}</div>
                      <div className="text-sm text-gray-500">{order.customer_email}</div>
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
