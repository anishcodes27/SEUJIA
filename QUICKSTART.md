# Quick Start Guide

## 🚀 Get Running in 5 Minutes

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables
```bash
cp .env.example .env.local
```

Then edit `.env.local` with your credentials.

### 3. Set Up Supabase
- Create project at [supabase.com](https://supabase.com)
- Run SQL from `supabase/schema.sql` in SQL Editor
- Create `product-images` storage bucket (make it public)
- Copy API keys to `.env.local`

### 4. Start Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## 🧪 Test the Application

### Add Test Products via Admin
1. Go to [http://localhost:3000/admin](http://localhost:3000/admin)
2. Login with password from `.env.local` (default: `admin123`)
3. Add a product with test image URL:
   ```
   Name: Test Honey
   Slug: test-honey
   Price: 29.99
   Stock: 100
   Image URL: https://images.unsplash.com/photo-1587049352846-4a222e784720?w=800
   ```

### Test Shopping Flow
1. Visit homepage
2. Click product → Add to Cart
3. Go to Cart → Apply coupon `WELCOME10`
4. Proceed to Checkout
5. Fill shipping info
6. Choose COD or set up Razorpay for online payment (see RAZORPAY_SETUP_GUIDE.md)
7. Complete order

---

## 📝 Essential Links

- **Main Guide**: [README.md](README.md)
- **Razorpay Setup**: [RAZORPAY_SETUP_GUIDE.md](RAZORPAY_SETUP_GUIDE.md)
- **Supabase Setup**: [docs/SUPABASE_SETUP.md](docs/SUPABASE_SETUP.md)
- **Deployment**: [DEPLOYMENT.md](DEPLOYMENT.md)

---

## ⚠️ Common Issues

**"Products not showing"**
- Add products via admin or SQL
- Check `is_active = true`

**"Can't connect to Supabase"**
- Verify credentials in `.env.local`
- Check Supabase project is running

**"Payment not working"**
- COD works out of the box
- For Razorpay: Follow RAZORPAY_SETUP_GUIDE.md
- Razorpay test cards: `4111 1111 1111 1111`

---

## 🎯 Next Steps

1. ✅ Get local development working
2. ✅ Add real product data
3. ✅ Test payment flow end-to-end
4. ✅ Deploy to Vercel
5. ✅ Configure production webhooks

**Need help?** Check the full [README.md](README.md)
