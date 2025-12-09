'use client';

import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { formatPrice, validateEmail, validatePhone } from '@/lib/utils';
import { calculatePackageWeight } from '@/lib/shiprocket';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    pincode: '',
    state: '',
    district: '',
  });
  
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [deliveryCharges, setDeliveryCharges] = useState(0);
  const [shippingInfo, setShippingInfo] = useState({
    courier_name: '',
    etd: '',
    freight_charge: 0,
    cod_charges: 0,
  });
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod'>('razorpay');
  const [loading, setLoading] = useState(false);
  const [fetchingLocation, setFetchingLocation] = useState(false);

  // Auto-fill user info if logged in
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
      }));
    }
  }, [user]);
  const [fetchingShipping, setFetchingShipping] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const subtotal = getCartTotal();
  const total = subtotal - discount + deliveryCharges;

  // Fetch shipping rates from Shiprocket when pincode and payment method changes
  const fetchShippingRates = async (pincode: string, isCOD: boolean) => {
    if (pincode.length !== 6) return;
    
    setFetchingShipping(true);
    try {
      const packageWeight = calculatePackageWeight(cart);
      
      console.log('🔍 Fetching shipping rates:');
      console.log('  Cart items:', cart.length);
      console.log('  Total quantity:', cart.reduce((sum, item) => sum + item.quantity, 0));
      console.log('  Calculated weight:', packageWeight, 'kg');
      console.log('  Is COD:', isCOD);
      console.log('  Pincode:', pincode);
      
      // Try Shiprocket first
      const response = await fetch('/api/shiprocket/get-rates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          delivery_pincode: pincode,
          weight: packageWeight,
          cod: isCOD,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const rates = data.data;
        setShippingInfo({
          courier_name: rates.courier_name,
          etd: rates.etd,
          freight_charge: rates.freight_charge,
          cod_charges: rates.cod_charges,
        });
        setDeliveryCharges(rates.total_charge);
      } else {
        // Fallback to fixed charges if Shiprocket fails
        console.log('Shiprocket unavailable, using fixed charges');
        const fixedFreight = 50;
        const fixedCOD = isCOD ? 30 : 0;
        setShippingInfo({
          courier_name: 'Standard Delivery',
          etd: '5-7 days',
          freight_charge: fixedFreight,
          cod_charges: fixedCOD,
        });
        setDeliveryCharges(fixedFreight + fixedCOD);
      }
    } catch (error) {
      // Fallback to fixed charges on error
      console.log('Error fetching rates, using fixed charges');
      const fixedFreight = 50;
      const fixedCOD = isCOD ? 30 : 0;
      setShippingInfo({
        courier_name: 'Standard Delivery',
        etd: '5-7 days',
        freight_charge: fixedFreight,
        cod_charges: fixedCOD,
      });
      setDeliveryCharges(fixedFreight + fixedCOD);
      setErrors(prev => ({ 
        ...prev, 
        shipping: 'Failed to calculate shipping charges' 
      }));
      setDeliveryCharges(0);
    } finally {
      setFetchingShipping(false);
    }
  };

  // Calculate shipping charges when pincode or payment method changes
  useEffect(() => {
    if (formData.pincode.length === 6 && !errors.pincode) {
      fetchShippingRates(formData.pincode, paymentMethod === 'cod');
    } else {
      setDeliveryCharges(0);
      setShippingInfo({
        courier_name: '',
        etd: '',
        freight_charge: 0,
        cod_charges: 0,
      });
    }
  }, [formData.pincode, paymentMethod, cart]);

  // Fetch location details from pincode
  const fetchLocationFromPincode = async (pincode: string) => {
    if (pincode.length !== 6) return;
    
    setFetchingLocation(true);
    try {
      const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = await response.json();
      
      if (data[0]?.Status === 'Success' && data[0]?.PostOffice?.length > 0) {
        const postOffice = data[0].PostOffice[0];
        setFormData(prev => ({
          ...prev,
          state: postOffice.State || '',
          district: postOffice.District || '',
        }));
        setErrors(prev => ({ ...prev, pincode: '' }));
      } else {
        setErrors(prev => ({ ...prev, pincode: 'Invalid pincode' }));
        setFormData(prev => ({ ...prev, state: '', district: '' }));
      }
    } catch (error) {
      console.error('Error fetching location:', error);
      setErrors(prev => ({ ...prev, pincode: 'Failed to fetch location' }));
    } finally {
      setFetchingLocation(false);
    }
  };

  // Handle pincode change
  const handlePincodeChange = (value: string) => {
    const pincode = value.replace(/\D/g, '').slice(0, 6);
    setFormData(prev => ({ ...prev, pincode }));
    
    if (pincode.length === 6) {
      fetchLocationFromPincode(pincode);
    } else {
      setFormData(prev => ({ ...prev, state: '', district: '' }));
    }
  };

  // Update delivery charges based on payment method
  const handlePaymentMethodChange = (method: 'razorpay' | 'cod') => {
    setPaymentMethod(method);
    
    // Refetch shipping rates with new payment method
    if (formData.pincode.length === 6 && !errors.pincode) {
      fetchShippingRates(formData.pincode, method === 'cod');
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Phone number must be exactly 10 digits';
    }
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.pincode.trim()) {
      newErrors.pincode = 'Pincode is required';
    } else if (formData.pincode.length !== 6) {
      newErrors.pincode = 'Pincode must be 6 digits';
    }
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.district.trim()) newErrors.district = 'District is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;
    if (cart.length === 0) {
      alert('Your cart is empty');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cart,
          shipping: formData,
          couponCode: couponCode || undefined,
          paymentMethod,
          deliveryCharges,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Checkout failed');
      }

      // Handle Cash on Delivery
      if (paymentMethod === 'cod') {
        clearCart();
        router.push(`/order-success?order=${data.orderId}`);
        return;
      }

      // Handle Razorpay payment
      if (paymentMethod === 'razorpay') {
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: data.amount,
          currency: 'INR',
          name: 'Seujia Honey',
          description: 'Order Payment',
          order_id: data.razorpayOrderId,
          handler: function (response: any) {
            clearCart();
            router.push(`/order-success?order=${data.orderId}`);
          },
          prefill: {
            name: formData.name,
            email: formData.email,
            contact: formData.phone,
          },
          theme: {
            color: '#ef851f',
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    } catch (error: any) {
      alert(error.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="pt-24 sm:pt-28 md:pt-32 min-h-screen bg-honey-50">
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-8">Add some products to checkout</p>
          <Button onClick={() => router.push('/shop')}>Go to Shop</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 sm:pt-28 md:pt-32 min-h-screen bg-honey-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Shipping Information</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-honey-500 ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-honey-500 ${
                    user ? 'bg-gray-100 cursor-not-allowed' : ''
                  } ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                  readOnly={!!user}
                  disabled={!!user}
                />
                {user && (
                  <p className="text-sm text-gray-500 mt-1">
                    🔒 Using your account email
                  </p>
                )}
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                    setFormData({ ...formData, phone: value });
                  }}
                  maxLength={10}
                  placeholder="10-digit mobile number"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-honey-500 ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Shipping Address *
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  rows={3}
                  placeholder="House No., Building Name, Street, Area"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-honey-500 ${
                    errors.address ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    value={formData.pincode}
                    onChange={(e) => handlePincodeChange(e.target.value)}
                    placeholder="Enter 6-digit pincode"
                    maxLength={6}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-honey-500 ${
                      errors.pincode ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {fetchingLocation && (
                    <p className="text-honey-600 text-sm mt-1">Fetching location...</p>
                  )}
                  {errors.pincode && <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State *
                  </label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    placeholder="State (auto-filled)"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-honey-500 bg-gray-50 ${
                      errors.state ? 'border-red-500' : 'border-gray-300'
                    }`}
                    readOnly
                  />
                  {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  District *
                </label>
                <input
                  type="text"
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  placeholder="District (auto-filled)"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-honey-500 bg-gray-50 ${
                    errors.district ? 'border-red-500' : 'border-gray-300'
                  }`}
                  readOnly
                />
                {errors.district && <p className="text-red-500 text-sm mt-1">{errors.district}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Payment Method *
                </label>
                <div className="space-y-3">
                  <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-honey-500 hover:bg-honey-50">
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => handlePaymentMethodChange('cod')}
                      className="w-4 h-4 text-honey-600 focus:ring-honey-500"
                    />
                    <div className="ml-3 flex-1">
                      <span className="font-semibold text-gray-900">Cash on Delivery (COD)</span>
                      <p className="text-sm text-gray-600 mt-1">Pay when you receive the product</p>
                      {paymentMethod === 'cod' && shippingInfo.cod_charges > 0 && (
                        <p className="text-sm text-honey-600 mt-1">
                          Additional COD charges: ₹{shippingInfo.cod_charges}
                        </p>
                      )}
                    </div>
                    <span className="text-2xl">💵</span>
                  </label>

                  <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-honey-500 hover:bg-honey-50">
                    <input
                      type="radio"
                      name="payment"
                      value="razorpay"
                      checked={paymentMethod === 'razorpay'}
                      onChange={() => handlePaymentMethodChange('razorpay')}
                      className="w-4 h-4 text-honey-600 focus:ring-honey-500"
                    />
                    <div className="ml-3 flex-1">
                      <span className="font-semibold text-gray-900">Razorpay (UPI, Cards, Net Banking)</span>
                      <p className="text-sm text-gray-600 mt-1">
                        Pay securely online
                      </p>
                      {paymentMethod === 'razorpay' && deliveryCharges > 0 && shippingInfo.courier_name && (
                        <p className="text-sm text-honey-600 mt-1">
                          via {shippingInfo.courier_name} - Delivery in {shippingInfo.etd}
                        </p>
                      )}
                    </div>
                    <span className="text-2xl">💳</span>
                  </label>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              isLoading={loading}
              className="w-full mt-6"
            >
              Place Order - {formatPrice(total)}
            </Button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md sticky top-20">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>

            <div className="space-y-3 mb-4">
              {cart.map((item) => (
                <div key={item.product.id} className="flex justify-between text-sm">
                  <span>
                    {item.product.name} × {item.quantity}
                  </span>
                  <span>{formatPrice(item.product.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              
              {/* Shipping Charges Details */}
              {fetchingShipping ? (
                <div className="flex justify-between text-honey-600">
                  <span>Calculating delivery...</span>
                  <span className="animate-pulse">⏳</span>
                </div>
              ) : formData.pincode.length === 6 && deliveryCharges > 0 ? (
                <div className="bg-honey-50 -mx-4 px-4 py-3 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping ({shippingInfo.courier_name})</span>
                    <span className="text-gray-900">₹{shippingInfo.freight_charge}</span>
                  </div>
                  {paymentMethod === 'cod' && shippingInfo.cod_charges > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">COD Charges</span>
                      <span className="text-gray-900">₹{shippingInfo.cod_charges}</span>
                    </div>
                  )}
                  {shippingInfo.etd && (
                    <div className="text-xs text-gray-500 pt-1">
                      📦 Estimated delivery: {shippingInfo.etd}
                    </div>
                  )}
                  <div className="flex justify-between font-semibold pt-2 border-t border-honey-200">
                    <span className="text-honey-800">Total Delivery</span>
                    <span className="text-honey-800">₹{deliveryCharges}</span>
                  </div>
                </div>
              ) : formData.pincode.length === 6 && errors.shipping ? (
                <div className="flex justify-between text-red-500 text-sm">
                  <span>{errors.shipping}</span>
                </div>
              ) : (
                <div className="flex justify-between text-gray-400 text-sm">
                  <span>Delivery Charges</span>
                  <span>Enter pincode</span>
                </div>
              )}
              
              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>Total</span>
                <span className="text-honey-600">{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Razorpay Script */}
      <script src="https://checkout.razorpay.com/v1/checkout.js" async />
    </div>
    </div>
  );
}
