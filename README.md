# 🍯 Seujia Honey - E-Commerce Storefront

A complete, production-ready Next.js 14 e-commerce application for selling premium honey products. Built with the App Router, TypeScript, Tailwind CSS, Supabase (PostgreSQL), and Razorpay.

## ✨ Features

### Customer Features
- 🏠 **Home Page**: Hero section with featured products
- 🛍️ **Shop Page**: Product grid with "Add to Cart" functionality
- 📦 **Product Details**: Individual product pages with quantity selector
- 🛒 **Shopping Cart**: Persistent cart with localStorage, quantity management
- 💳 **Checkout**: Secure payment with Razorpay or Cash on Delivery (COD)
- 🎟️ **Coupon System**: Apply discount codes at checkout
- ✅ **Order Confirmation**: Success page after payment

### Admin Features
- 🔐 **Protected Admin Dashboard**: Simple password authentication
- 📝 **Product Management**: CRUD operations for products
- 🎫 **Coupon Management**: Create and manage discount codes
- 📊 **Order Viewing**: View all orders with status tracking
- 🖼️ **Image Upload**: Direct upload to Supabase Storage

### Technical Features
- ⚡ **Next.js 14 App Router**: Server and client components
- 🎨 **Tailwind CSS**: Honey-themed color palette (amber/tan)
- 🗄️ **Supabase (PostgreSQL)**: Database and file storage
- 💰 **Payment Integration**: Razorpay with webhooks + COD support
- 🔄 **Inventory Management**: Automatic stock decrement on purchase
- 📱 **Responsive Design**: Mobile-first approach
- 🔒 **Transaction Safety**: Webhook signature verification

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- A Supabase account (free tier works)
- Razorpay account (for online payments) - optional
- Git

### 1. Clone and Install

```bash
cd seujia_web
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the schema from `supabase/schema.sql`
3. Go to **Storage** and create a bucket named `product-images` (make it public)
4. Get your credentials from **Project Settings → API**:
   - Project URL
   - Anon/Public key
   - Service Role key (keep this secret!)

3. **Add Your Images** (optional but recommended):
   ```bash
   # Add your logo and hero background to the public folder
   # See IMAGE_GUIDE.md for detailed instructions
   ```

4. **Install Dependencies**:

### 3. Set Up Razorpay (For Online Payments)

### 3. Set Up Razorpay (For Online Payments)

1. Sign up at [razorpay.com](https://razorpay.com)
2. Get your test keys from **Settings → API Keys**
3. Set up webhook:
   - Go to **Settings → Webhooks**
   - Add webhook: `https://your-domain.com/api/webhooks/razorpay`
   - Select: `payment.captured`, `payment.authorized`
   - Copy the webhook secret

**See `RAZORPAY_SETUP_GUIDE.md` for complete setup instructions**

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Razorpay
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=your-razorpay-secret
RAZORPAY_WEBHOOK_SECRET=your-razorpay-webhook-secret

# Admin
ADMIN_PASSWORD=your-secure-password

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
seujia_web/
├── app/
│   ├── admin/              # Admin dashboard
│   ├── api/                # API routes
│   │   ├── products/       # Get all products
│   │   ├── product/[slug]/ # Get single product
│   │   ├── apply-coupon/   # Validate coupon
│   │   ├── create-checkout/# Create order & payment
│   │   └── webhooks/       # Stripe & Razorpay webhooks
│   ├── cart/               # Cart page
│   ├── checkout/           # Checkout page
│   ├── order-success/      # Order confirmation
│   ├── product/[slug]/     # Product detail page
│   ├── shop/               # Shop page
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   └── globals.css         # Global styles
├── components/             # Reusable components
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── ProductCard.tsx
│   ├── CartDrawer.tsx
│   └── Button.tsx
├── context/
│   └── CartContext.tsx     # Cart state management
├── lib/
│   ├── supabase/           # Supabase clients
│   └── utils.ts            # Helper functions
├── supabase/
│   └── schema.sql          # Database schema
├── types/
│   └── index.ts            # TypeScript types
├── .env.example            # Environment variables template
├── next.config.js          # Next.js configuration
├── tailwind.config.ts      # Tailwind configuration
└── package.json
```

---

## 🛠️ Development Guide

### Adding Products

#### Option 1: Admin Dashboard
1. Navigate to `/admin`
2. Login with your admin password
3. Use the Products tab to add/edit/delete products
4. Upload images directly to Supabase Storage

#### Option 2: Supabase Studio
1. Go to your Supabase project
2. Navigate to **Table Editor → products**
3. Insert new rows directly
4. For images, upload to Storage bucket and copy the public URL

### Adding Coupons

```sql
-- Example: 10% off coupon
INSERT INTO coupons (code, discount_type, discount_value, min_order_value, max_uses, is_active)
VALUES ('HONEY10', 'percentage', 10, 0, 100, true);

-- Example: $5 off orders over $20
INSERT INTO coupons (code, discount_type, discount_value, min_order_value, max_uses, is_active)
VALUES ('SAVE5', 'fixed', 5, 20, 50, true);
```

### Testing Payments

#### Stripe Test Cards
```
Success: 4242 4242 4242 4242
Decline: 4000 0000 0000 0002
3D Secure: 4000 0025 0000 3155

CVC: Any 3 digits
Date: Any future date
ZIP: Any 5 digits
```

#### Razorpay Test Cards
```
Success: 4111 1111 1111 1111
Decline: 4000 0000 0000 0002

CVC: 123
Date: Any future date
```

---

## 🚀 Deployment to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/seujia-honey.git
git push -u origin main
```

### 2. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **Add New Project**
3. Import your GitHub repository
4. Configure environment variables (copy from `.env.local`)
5. Click **Deploy**

### 3. Configure Webhooks

After deployment, update your webhook URLs:

**Stripe:**
- Webhook URL: `https://your-domain.vercel.app/api/webhooks/stripe`

**Razorpay:**
- Webhook URL: `https://your-domain.vercel.app/api/webhooks/razorpay`

Update `.env.local` or Vercel environment variables:
```
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

---

## 🧪 Testing Checklist

### Functional Tests
- [ ] Home page loads with featured products
- [ ] Shop page displays all active products
- [ ] Product detail page shows correct information
- [ ] Add to cart works and persists after page reload
- [ ] Cart shows correct items and totals
- [ ] Coupon code applies discount correctly
- [ ] Invalid coupon shows error message
- [ ] Checkout form validation works
- [ ] Stripe payment completes successfully
- [ ] Razorpay payment completes successfully
- [ ] Order appears in admin dashboard
- [ ] Product inventory decrements after purchase
- [ ] Order success page displays

### Admin Tests
- [ ] Admin login works with correct password
- [ ] Can add new products
- [ ] Can edit existing products
- [ ] Can delete products
- [ ] Image upload to Supabase works
- [ ] Can add new coupons
- [ ] Can edit/delete coupons
- [ ] Orders list displays correctly
- [ ] Logout works

### Edge Cases
- [ ] Empty cart shows appropriate message
- [ ] Out of stock products can't be added to cart
- [ ] Expired coupons are rejected
- [ ] Maximum coupon usage is enforced
- [ ] Failed payment doesn't create order
- [ ] Webhook signature verification works

---

## 🔐 Security Best Practices

1. **Never commit `.env.local` to git** - use `.env.example` as template
2. **Use Supabase Service Role Key only on server** - never expose to client
3. **Verify webhook signatures** - prevents unauthorized order updates
4. **Use strong admin password** - change default password immediately
5. **Enable RLS in Supabase** (optional) - row-level security for extra protection
6. **Use HTTPS in production** - Vercel provides this automatically

---

## 📚 API Routes Reference

### GET `/api/products`
Fetch all active products
- Query params: `?limit=4` (optional)
- Returns: Array of products

### GET `/api/product/[slug]`
Fetch single product by slug
- Returns: Product object or 404

### POST `/api/apply-coupon`
Validate and calculate coupon discount
- Body: `{ couponCode, subtotal }`
- Returns: `{ valid, discount, newTotal, message }`

### POST `/api/create-checkout`
Create order and payment intent
- Body: `{ cart, shipping, couponCode?, paymentProvider }`
- Returns: `{ orderId, orderNumber, clientSecret/razorpayOrderId }`

### POST `/api/webhooks/stripe`
Handle Stripe payment events
- Verifies signature
- Updates order status
- Decrements inventory

### POST `/api/webhooks/razorpay`
Handle Razorpay payment events
- Verifies signature
- Updates order status
- Decrements inventory

---

## 🎨 Customization

### Colors
Edit `tailwind.config.ts` to change the honey theme:
```typescript
colors: {
  honey: {
    50: '#fef9ee',
    // ... customize these values
  }
}
```

### Product Categories
To add categories:
1. Add `category` column to `products` table
2. Update TypeScript types
3. Add filter UI to shop page

### Shipping Calculation
Currently shipping is not calculated. To add:
1. Add `shipping_cost` to orders table
2. Update checkout API to calculate based on address
3. Display in cart and checkout pages

---

## 🐛 Troubleshooting

### "Products not loading"
- Check Supabase credentials in `.env.local`
- Ensure products are marked as `is_active = true`
- Check browser console for errors

### "Payment not processing"
- Verify Stripe/Razorpay keys are correct (test mode)
- Check webhook endpoints are configured
- Review API logs in Vercel dashboard

### "Images not uploading"
- Ensure `product-images` bucket exists in Supabase
- Make bucket public: Settings → Public bucket = ON
- Check file size limits (default 5MB)

### "Cart not persisting"
- Check browser localStorage is enabled
- Clear localStorage: `localStorage.clear()` in console
- Verify CartContext is wrapped around app

---

## 📄 License

MIT License - feel free to use for personal or commercial projects.

---

## 🤝 Support

For issues or questions:
1. Check the troubleshooting section
2. Review Supabase/Stripe/Razorpay documentation
3. Check Next.js 14 App Router docs

---

## 🎯 Next Steps

After setup, consider:
- [ ] Add email notifications (using Resend or SendGrid)
- [ ] Implement product search and filters
- [ ] Add customer reviews and ratings
- [ ] Create customer account system
- [ ] Add shipping calculation
- [ ] Implement abandoned cart recovery
- [ ] Add analytics (Google Analytics, Vercel Analytics)
- [ ] Set up monitoring (Sentry for error tracking)
- [ ] Add product variants (size, weight options)
- [ ] Implement subscription products

---

Built with ❤️ using Next.js, Supabase, Stripe, and Razorpay.
