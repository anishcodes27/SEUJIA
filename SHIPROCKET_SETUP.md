# Shiprocket Integration Guide

This guide explains how to set up and use Shiprocket for automated shipping and order tracking in your e-commerce application.

## What is Shiprocket?

Shiprocket is India's leading shipping aggregator that provides:
- ✅ **Real-time shipping rates** from multiple courier partners
- ✅ **Automated order tracking** with AWB codes
- ✅ **Smart courier selection** based on cost and delivery time
- ✅ **Professional shipping labels** generation
- ✅ **COD and Prepaid** support
- ✅ **Pan-India delivery** coverage

## Benefits Over Manual Shipping Calculator

### Before (Manual Calculator):
- ❌ Fixed rates for all states
- ❌ No real-time courier availability
- ❌ Manual tracking updates
- ❌ No professional labels
- ❌ Limited to predefined zones

### After (Shiprocket):
- ✅ Real-time dynamic rates based on actual courier prices
- ✅ Automatic courier selection (cheapest & fastest)
- ✅ Live tracking with AWB codes
- ✅ Professional shipping labels
- ✅ Coverage for 27,000+ pincodes across India
- ✅ Better customer experience with ETA

---

## Setup Instructions

### Step 1: Create Shiprocket Account

1. Go to [Shiprocket.in](https://www.shiprocket.in/)
2. Sign up for a free account (you can start with their free plan)
3. Complete KYC verification (required for activation)
4. Add your pickup address

### Step 2: Get API Credentials

1. Log in to your Shiprocket dashboard
2. Go to **Settings** → **API**
3. Note down your:
   - Email (used for login)
   - Password
   
*Note: Shiprocket uses email/password authentication to generate API tokens*

### Step 3: Configure Environment Variables

Add these to your `.env.local` file:

```env
SHIPROCKET_EMAIL=your_shiprocket_email@example.com
SHIPROCKET_PASSWORD=your_shiprocket_password
SHIPROCKET_PICKUP_PINCODE=781001
```

Replace:
- `your_shiprocket_email@example.com` - Your Shiprocket account email
- `your_shiprocket_password` - Your Shiprocket account password
- `781001` - Your pickup location pincode (warehouse/store)

### Step 4: Run Database Migration

Execute this SQL in Supabase SQL Editor:

```bash
# The migration file is at: supabase/add_shiprocket_tracking.sql
```

This adds tracking fields to your orders table:
- `shiprocket_order_id`
- `shiprocket_shipment_id`
- `awb_code`
- `courier_name`
- `tracking_url`
- `shipment_status`
- `estimated_delivery_date`

### Step 5: Test the Integration

1. Start your development server:
```bash
npm run dev
```

2. Go to checkout page
3. Enter a valid delivery pincode (try: 110001 for Delhi)
4. You should see real-time shipping rates from Shiprocket

---

## How It Works

### 1. Checkout Flow

```
Customer enters pincode
         ↓
Frontend calls /api/shiprocket/get-rates
         ↓
Backend authenticates with Shiprocket API
         ↓
Checks serviceability for delivery pincode
         ↓
Returns cheapest courier with rates
         ↓
Customer sees: Shipping ₹X via [Courier Name]
         ↓
Customer completes checkout
```

### 2. Order Creation (Admin Action)

After an order is placed, admin should:

1. Create shipment in Shiprocket
2. Generate AWB code
3. Request pickup
4. Update order with tracking details

### 3. Order Tracking

Customers can track their orders:
- Visit: `/track-order`
- Enter AWB code from email
- See live tracking updates with timeline

---

## API Endpoints

### 1. Get Shipping Rates

**Endpoint:** `POST /api/shiprocket/get-rates`

**Request:**
```json
{
  "delivery_pincode": "110001",
  "weight": 0.5,
  "cod": false
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "freight_charge": 45,
    "cod_charges": 0,
    "total_charge": 45,
    "courier_name": "Delhivery Surface",
    "etd": "3-5 Days"
  }
}
```

### 2. Track Order

**Endpoint:** `POST /api/shiprocket/track-order`

**Request:**
```json
{
  "awb_code": "123456789"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "tracking_data": {
      "shipment_track": [{
        "awb_code": "123456789",
        "current_status": "In Transit",
        "courier_name": "Delhivery",
        "edd": "2024-01-15"
      }],
      "shipment_track_activities": [...]
    }
  }
}
```

---

## Features Implemented

### ✅ Real-time Shipping Rates
- Automatically calculates shipping based on delivery pincode
- Shows different rates for COD vs Prepaid
- Displays courier name and estimated delivery time

### ✅ Smart Package Weight Calculation
- Calculates total weight based on cart items
- Includes packaging weight
- Can be customized per product

### ✅ Order Tracking Page
- Beautiful tracking interface at `/track-order`
- Shows shipment timeline with status updates
- Real-time updates from Shiprocket

### ✅ Database Integration
- Stores tracking information in orders table
- AWB codes, shipment IDs, courier details
- Indexed for fast queries

### ✅ Error Handling
- Graceful fallback if Shiprocket is unavailable
- User-friendly error messages
- Automatic retry for failed API calls

---

## Testing

### Test with Sample Pincodes:

| City | Pincode | Expected Result |
|------|---------|-----------------|
| Delhi | 110001 | ₹40-60 (2-3 days) |
| Mumbai | 400001 | ₹50-70 (3-4 days) |
| Bangalore | 560001 | ₹55-75 (3-5 days) |
| Remote Area | 123456 | May not be serviceable |

### Test COD Charges:
- Select "Cash on Delivery"
- You should see additional COD charges (₹20-40)

---

## Pricing

### Shiprocket Pricing:
- **Free Plan**: 50 shipments/month
- **Lite Plan**: ₹199/month (500 shipments)
- **Professional**: ₹999/month (2000 shipments)

*Courier charges are separate and charged per shipment*

### Typical Courier Charges:
- Within city: ₹30-50
- Within state: ₹40-60
- Interstate: ₹50-80
- Remote areas: ₹80-120

**COD charges:** ₹20-40 extra

---

## Advanced Features

### 1. Automatic Shipment Creation

You can extend the checkout API to automatically create shipments:

```typescript
// In app/api/create-checkout/route.ts
import { shiprocket } from '@/lib/shiprocket';

const shipmentData = {
  order_id: orderNumber,
  order_date: new Date().toISOString(),
  pickup_location: "Primary",
  billing_customer_name: formData.name,
  // ... other fields
};

const shipment = await shiprocket.createOrder(shipmentData);
```

### 2. Webhook Integration

Set up webhooks to get real-time status updates:

```typescript
// app/api/webhooks/shiprocket/route.ts
export async function POST(request: Request) {
  const data = await request.json();
  
  // Update order status in database
  await supabase
    .from('orders')
    .update({ 
      shipment_status: data.current_status,
      awb_code: data.awb_code 
    })
    .eq('shiprocket_order_id', data.order_id);
}
```

### 3. Return/RTO Handling

Shiprocket supports return shipments:

```typescript
const rtoShipment = await shiprocket.createOrder({
  ...orderData,
  is_return: true,
  return_shipping_address: customerAddress
});
```

---

## Troubleshooting

### Issue: "Shiprocket authentication failed"
**Solution:** 
- Check your SHIPROCKET_EMAIL and SHIPROCKET_PASSWORD in .env.local
- Make sure your Shiprocket account is active
- Try logging in to Shiprocket dashboard to verify credentials

### Issue: "No courier services available"
**Solution:**
- Pincode might not be serviceable
- Try a major city pincode first (110001, 400001)
- Check if Shiprocket account has active courier partners

### Issue: "Failed to calculate shipping rates"
**Solution:**
- Check internet connection
- Verify Shiprocket API is not down (check status.shiprocket.in)
- Check browser console for detailed error messages

### Issue: Rate calculation is slow
**Solution:**
- Rates are cached for 9 days after authentication
- First request might be slow (~2-3 seconds)
- Subsequent requests should be faster

---

## Files Modified/Created

### New Files:
- `lib/shiprocket.ts` - Shiprocket API integration
- `app/api/shiprocket/get-rates/route.ts` - Shipping rate calculation
- `app/api/shiprocket/track-order/route.ts` - Order tracking
- `app/track-order/page.tsx` - Customer tracking page
- `supabase/add_shiprocket_tracking.sql` - Database migration
- `SHIPROCKET_SETUP.md` - This documentation

### Modified Files:
- `app/checkout/page.tsx` - Integrated Shiprocket rates
- `.env.example` - Added Shiprocket credentials

### Removed Dependencies:
- `lib/shipping-calculator.ts` - No longer needed (replaced by Shiprocket)

---

## Next Steps

1. **Complete KYC** on Shiprocket (if not done)
2. **Add pickup address** in Shiprocket dashboard
3. **Test with real orders** using test mode
4. **Set up webhooks** for automatic status updates
5. **Customize tracking page** with your branding
6. **Add email notifications** when shipment status changes

---

## Support

- **Shiprocket Support:** support@shiprocket.in
- **Documentation:** https://apidocs.shiprocket.in/
- **Dashboard:** https://app.shiprocket.in/

---

## Important Notes

⚠️ **Shiprocket Account Activation:**
- KYC verification takes 24-48 hours
- You need GST number for business account
- Test mode available before full activation

⚠️ **API Rate Limits:**
- Authentication tokens expire after 10 days
- Implement proper caching to avoid rate limits
- Our implementation caches tokens automatically

⚠️ **Pricing:**
- Courier charges are deducted from your Shiprocket wallet
- Recharge wallet before shipments
- Monitor wallet balance regularly

---

## Summary

✅ **Removed:** Manual shipping calculator with fixed rates  
✅ **Added:** Dynamic Shiprocket integration with real-time rates  
✅ **Feature:** Live order tracking for customers  
✅ **Benefit:** Professional shipping experience with 27,000+ pincode coverage  
✅ **Result:** Better customer experience and automated shipping management  

The manual `lib/shipping-calculator.ts` is no longer used and can be safely deleted after testing Shiprocket integration.
