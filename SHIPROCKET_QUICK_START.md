# Shiprocket Quick Start - 5 Minutes Setup

Get professional shipping and tracking running in 5 minutes!

## Step 1: Create Shiprocket Account (2 min)

1. Visit: https://www.shiprocket.in/
2. Click "Sign Up Free"
3. Enter your business details
4. Verify email

## Step 2: Add Environment Variables (1 min)

Copy your `.env.example` to `.env.local` and add:

```env
SHIPROCKET_EMAIL=your_shiprocket_email@example.com
SHIPROCKET_PASSWORD=your_shiprocket_password
SHIPROCKET_PICKUP_PINCODE=781001
```

Replace with your actual Shiprocket credentials and your warehouse/store pincode.

## Step 3: Run Database Migration (1 min)

1. Go to Supabase Dashboard → SQL Editor
2. Copy content from `supabase/add_shiprocket_tracking.sql`
3. Click "Run"

## Step 4: Test the Integration (1 min)

1. Start dev server: `npm run dev`
2. Go to checkout page
3. Enter pincode: `110001` (Delhi)
4. See real-time shipping rates! 🎉

## What You Get

✅ **Real-time Shipping Rates** - Dynamic pricing from 17+ courier partners  
✅ **Smart Courier Selection** - Automatically picks cheapest & fastest  
✅ **Order Tracking** - Professional tracking page at `/track-order`  
✅ **Pan-India Coverage** - 27,000+ pincodes supported  
✅ **COD Support** - Automatic COD charge calculation  

## Quick Test

Try these pincodes in checkout:
- Delhi: `110001` → Should show ₹40-60
- Mumbai: `400001` → Should show ₹50-70
- Bangalore: `560001` → Should show ₹55-75

## Features Removed

❌ Manual `lib/shipping-calculator.ts` - No longer needed!  
❌ Fixed state-based rates - Now dynamic!  
❌ Manual COD calculation - Shiprocket handles it!  

## Next Steps

1. ✅ Complete KYC on Shiprocket (required for live shipping)
2. ✅ Add your pickup address in Shiprocket dashboard
3. ✅ Recharge wallet (₹500 recommended)
4. ✅ Test with real orders

## Need Help?

📖 Full Guide: See `SHIPROCKET_SETUP.md`  
🌐 Shiprocket Dashboard: https://app.shiprocket.in/  
📧 Support: support@shiprocket.in  

---

**That's it!** You now have professional shipping integration. 🚀
