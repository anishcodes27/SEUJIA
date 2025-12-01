export interface ProductVariant {
  size: string;
  price: number;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  image_url: string | null;
  stock: number;
  is_active: boolean;
  variants?: ProductVariant[];
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  created_at?: string;
}

export interface Coupon {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_order_value: number;
  max_uses: number | null;
  current_uses: number;
  is_active: boolean;
  expires_at: string | null;
  created_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  shipping_address: string;
  subtotal: number;
  discount_amount: number;
  total: number;
  coupon_code: string | null;
  payment_provider: 'razorpay' | 'cod';
  payment_intent_id: string | null;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  order_status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_price: number;
  quantity: number;
  subtotal: number;
  created_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: ProductVariant;
}

export interface ShippingInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface CheckoutPayload {
  cart: CartItem[];
  shipping: ShippingInfo;
  couponCode?: string;
  paymentProvider: 'razorpay' | 'cod';
}

export interface CouponValidationResult {
  valid: boolean;
  discount: number;
  newTotal: number;
  message?: string;
}

export interface ProductReview {
  id: string;
  product_id: string;
  user_name: string;
  user_email: string;
  rating: number;
  review_text: string | null;
  review_images: string[] | null;
  is_verified_purchase: boolean;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
}
