# Razorpay Payment Gateway Setup Guide

## Complete Setup Checklist

Follow these steps to integrate Razorpay payment gateway into your Seujia Honey website.

---

## 📋 Prerequisites

### 1. **Razorpay Account**
- [ ] Create account at [https://razorpay.com/](https://razorpay.com/)
- [ ] Complete business verification (KYC)
- [ ] Provide business documents:
  - PAN Card
  - Business registration certificate
  - Bank account details
  - GST certificate (if applicable)

### 2. **Bank Account**
- [ ] Indian bank account in business name
- [ ] Bank account verified with Razorpay
- [ ] Settlement account configured

### 3. **Legal Requirements**
- [ ] Registered business entity (or individual)
- [ ] Valid PAN number
- [ ] GST registration (optional but recommended)

---

## 🔑 Step 1: Get Razorpay API Keys

### Test Mode (For Development)

1. **Login to Razorpay Dashboard**: https://dashboard.razorpay.com/
2. **Go to Settings** → **API Keys**
3. **Generate Test Keys**:
   - You'll get:
     - `Key ID` (starts with `rzp_test_`)
     - `Key Secret` (keep this confidential)

### Live Mode (For Production)

1. **Complete KYC verification**
2. **Go to Settings** → **API Keys**
3. **Switch to Live Mode**
4. **Generate Live Keys**:
   - You'll get:
     - `Key ID` (starts with `rzp_live_`)
     - `Key Secret` (keep this confidential)

⚠️ **Important**: Never commit API keys to version control!

---

## 🛠️ Step 2: Install Required Packages

### Install Razorpay SDK

```bash
npm install razorpay
```

### Install Types (for TypeScript)

```bash
npm install --save-dev @types/razorpay
```

---

## 🔐 Step 3: Configure Environment Variables

### Create/Update `.env.local` file

Add these variables to your `.env.local` file in the project root:

```env
# Razorpay Configuration
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXXXXXXXX
RAZORPAY_KEY_SECRET=YOUR_SECRET_KEY_HERE

# For production, replace with:
# NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_XXXXXXXXXXXXXXXX
# RAZORPAY_KEY_SECRET=YOUR_LIVE_SECRET_KEY
```

⚠️ **Security Notes**:
- `NEXT_PUBLIC_RAZORPAY_KEY_ID` - Public (safe to expose in frontend)
- `RAZORPAY_KEY_SECRET` - Private (server-side only, never expose)

---

## 💻 Step 4: Enable Razorpay in Code

### Update API Route

Edit `/app/api/create-checkout/route.ts`:

**Uncomment these lines (at the top):**

```typescript
import Razorpay from 'razorpay';
const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});
```

**Uncomment Razorpay order creation (in the razorpay payment section):**

```typescript
const razorpayOrder = await razorpay.orders.create({
  amount: Math.round(finalTotal * 100), // Razorpay uses paise
  currency: 'INR',
  receipt: orderNumber,
});

await supabaseAdmin
  .from('orders')
  .update({ payment_intent_id: razorpayOrder.id })
  .eq('id', order.id);
```

**Replace the test order ID:**

Change:
```typescript
razorpayOrderId: 'order_test_' + orderNumber,
```

To:
```typescript
razorpayOrderId: razorpayOrder.id,
```

---

## 🌐 Step 5: Configure Razorpay Dashboard

### Enable Payment Methods

1. **Login to Razorpay Dashboard**
2. **Go to Settings** → **Configuration** → **Payment Methods**
3. **Enable desired payment methods**:
   - ✅ UPI (Google Pay, PhonePe, Paytm, etc.)
   - ✅ Credit/Debit Cards (Visa, Mastercard, RuPay)
   - ✅ Net Banking (All major banks)
   - ✅ Wallets (Paytm, Mobikwik, etc.)
   - ✅ EMI (if applicable)

### Set Payment Capture Mode

1. **Go to Settings** → **Configuration** → **Payment Capture**
2. **Choose mode**:
   - **Automatic**: Payment captured immediately (recommended)
   - **Manual**: You manually capture after review

Recommended: **Automatic Capture**

### Configure Webhooks (Important!)

1. **Go to Settings** → **Webhooks**
2. **Add Webhook URL**:
   ```
   https://your-domain.com/api/webhooks/razorpay
   ```
3. **Select Events to Listen**:
   - ✅ `payment.authorized`
   - ✅ `payment.captured`
   - ✅ `payment.failed`
   - ✅ `order.paid`
4. **Copy Webhook Secret** (you'll need this)

Add webhook secret to `.env.local`:
```env
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret_here
```

---

## 🎨 Step 6: Customize Razorpay Checkout

### Update Checkout Theme (Optional)

Edit `/app/checkout/page.tsx` in the Razorpay options:

```typescript
const options = {
  key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  amount: data.amount,
  currency: 'INR',
  name: 'Seujia Honey',
  description: 'Order Payment',
  image: 'https://your-domain.com/logo.png', // Add your logo
  order_id: data.razorpayOrderId,
  handler: function (response: any) {
    // Payment successful
    clearCart();
    router.push(`/order-success?order=${data.orderId}`);
  },
  prefill: {
    name: formData.name,
    email: formData.email,
    contact: formData.phone,
  },
  notes: {
    order_id: data.orderId,
  },
  theme: {
    color: '#f7b731', // Honey theme color
  },
  modal: {
    ondismiss: function() {
      // User closed payment modal
      alert('Payment cancelled. Please try again.');
    }
  }
};
```

---

## 🧪 Step 7: Testing

### Test Mode Credentials

Razorpay provides test cards for testing:

#### Test Cards (Use in Test Mode)

**Successful Payment:**
- Card: `4111 1111 1111 1111`
- CVV: Any 3 digits
- Expiry: Any future date
- Name: Any name

**Failed Payment:**
- Card: `4012 0010 3714 1112`
- CVV: Any 3 digits
- Expiry: Any future date

#### Test UPI

- UPI ID: `success@razorpay`
- Result: Payment succeeds

#### Test Net Banking

- Select any bank
- Use credentials: `razorpay` / `razorpay`

### Testing Checklist

- [ ] Test successful payment with test card
- [ ] Test failed payment
- [ ] Test UPI payment
- [ ] Test Net Banking
- [ ] Verify order created in database
- [ ] Verify email notifications sent
- [ ] Test payment cancellation (close modal)
- [ ] Test webhook receiving payments

---

## 🚀 Step 8: Go Live

### Pre-Launch Checklist

- [ ] ✅ KYC verification completed
- [ ] ✅ Bank account verified
- [ ] ✅ All tests passed in test mode
- [ ] ✅ Webhooks configured and tested
- [ ] ✅ Live API keys obtained
- [ ] ✅ Environment variables updated with live keys
- [ ] ✅ Payment methods enabled in dashboard
- [ ] ✅ Refund policy added to website
- [ ] ✅ Terms & conditions updated
- [ ] ✅ Privacy policy includes payment info

### Switch to Live Mode

1. **Replace test keys with live keys** in `.env.local`:
   ```env
   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_XXXXXXXXXXXXXXXX
   RAZORPAY_KEY_SECRET=your_live_secret_key
   ```

2. **Update webhook URL** to production domain

3. **Enable live mode** in Razorpay dashboard

4. **Test with small real transaction**

5. **Monitor first few transactions** closely

---

## 💰 Costs & Fees

### Transaction Fees

Razorpay charges per successful transaction:

- **Domestic Cards**: 2% + GST
- **International Cards**: 3% + GST
- **UPI**: 2% + GST (or as per plan)
- **Net Banking**: 2% + GST
- **Wallets**: 2% + GST

### Settlement

- **Standard**: T+3 days (3 days after transaction)
- **Instant Settlement**: Available for additional fee
- **No Setup Fee**: Free to start
- **No Annual Fee**: Pay only for transactions

---

## 🔒 Security Best Practices

### API Key Security

- ✅ Never commit `.env.local` to Git
- ✅ Add `.env.local` to `.gitignore`
- ✅ Use environment variables for all keys
- ✅ Rotate keys periodically
- ✅ Different keys for test/live environments

### Payment Security

- ✅ Always verify payment on server-side
- ✅ Use webhooks for payment confirmation
- ✅ Validate payment amounts match order
- ✅ Implement HTTPS on production
- ✅ Log all payment attempts
- ✅ Handle payment failures gracefully

---

## 🐛 Troubleshooting

### Common Issues

#### 1. **"Key ID is required"**
**Solution**: Verify `NEXT_PUBLIC_RAZORPAY_KEY_ID` is set in `.env.local`

#### 2. **"Payment failed" on test cards**
**Solution**: 
- Ensure you're using test mode keys
- Use official test cards from Razorpay docs
- Check browser console for errors

#### 3. **Webhooks not receiving**
**Solution**:
- Verify webhook URL is publicly accessible
- Check webhook secret is correct
- View webhook logs in Razorpay dashboard

#### 4. **"Invalid API Key"**
**Solution**:
- Verify you're using correct environment (test/live)
- Check key hasn't been regenerated
- Ensure no extra spaces in environment variables

#### 5. **Payment success but order not created**
**Solution**:
- Implement proper webhook handling
- Add error logging in API route
- Check database connection

---

## 📚 Resources

### Official Documentation

- **Razorpay Docs**: https://razorpay.com/docs/
- **API Reference**: https://razorpay.com/docs/api/
- **Integration Guide**: https://razorpay.com/docs/payments/
- **Webhooks**: https://razorpay.com/docs/webhooks/

### Support

- **Razorpay Support**: support@razorpay.com
- **Dashboard**: https://dashboard.razorpay.com/
- **Developer Forum**: https://discuss.razorpay.com/

### Test Environment

- **Test Dashboard**: https://dashboard.razorpay.com/test
- **Test Cards**: https://razorpay.com/docs/payments/payments/test-card-details/

---

## ✅ Final Checklist

Before going live, ensure:

- [ ] Razorpay account created and verified
- [ ] KYC completed (for live mode)
- [ ] Bank account linked and verified
- [ ] `razorpay` npm package installed
- [ ] Environment variables configured
- [ ] API code uncommented and configured
- [ ] Webhooks set up and tested
- [ ] Payment methods enabled in dashboard
- [ ] Tested in test mode successfully
- [ ] Legal pages updated (refund policy, T&C)
- [ ] Live keys configured (when going live)
- [ ] First test transaction successful
- [ ] Email notifications working
- [ ] Customer support process defined

---

## 🎯 Quick Start Commands

```bash
# Install Razorpay
npm install razorpay

# Install types
npm install --save-dev @types/razorpay

# Start development server
npm run dev

# Test the payment flow
# Use test cards: 4111 1111 1111 1111
```

---

## 📧 Need Help?

If you encounter issues:

1. Check Razorpay dashboard logs
2. Review browser console errors
3. Check server logs for API errors
4. Contact Razorpay support: support@razorpay.com
5. Visit developer docs: https://razorpay.com/docs/

---

**Your payment gateway is now ready! 🎉**

Start with test mode, validate everything works, then switch to live mode when ready.
