import { CartItem } from '@/types';

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(price);
}

export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 7);
  return `SH-${timestamp}-${random}`.toUpperCase();
}

export function calculateSubtotal(cart: CartItem[]): number {
  return cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
  return phoneRegex.test(phone);
}

export async function uploadToSupabase(
  file: File,
  bucket: string = 'product-images'
): Promise<string | null> {
  try {
    const { supabase } = await import('@/lib/supabase/client');
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file);

    if (error) throw error;

    const { data: publicData } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    return publicData.publicUrl;
  } catch (error) {
    console.error('Upload error:', error);
    return null;
  }
}
