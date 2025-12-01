# Razorpay Setup - Quick Reference

## ⚡ Fast Setup (5 Steps)

### 1️⃣ Create Razorpay Account
🔗 https://razorpay.com/
- Sign up → Verify email → Complete KYC

### 2️⃣ Get API Keys
📍 Dashboard → Settings → API Keys
```
Key ID: rzp_test_XXXXXXXXX (public)
Secret: XXXXXXXXXXXXXXXXX (private)
```

### 3️⃣ Install Package
```bash
npm install razorpay
npm install --save-dev @types/razorpay
```

### 4️⃣ Set Environment Variables
📄 `.env.local`
```env
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXXXXXXXX
RAZORPAY_KEY_SECRET=your_secret_key_here
```

### 5️⃣ Uncomment Code
📄 `/app/api/create-checkout/route.ts`

**Lines 5-10** - Uncomment:
```typescript
import Razorpay from 'razorpay';
const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});
```

**Lines 122-130** - Uncomment:
```typescript
const razorpayOrder = await razorpay.orders.create({
  amount: Math.round(finalTotal * 100),
  currency: 'INR',
  receipt: orderNumber,
});

await supabaseAdmin
  .from('orders')
  .update({ payment_intent_id: razorpayOrder.id })
  .eq('id', order.id);
```

**Line 135** - Change:
```typescript
// FROM:
razorpayOrderId: 'order_test_' + orderNumber,

// TO:
razorpayOrderId: razorpayOrder.id,
```

---

## ✅ Done! Test It

### Test Cards (Test Mode)
- Success: `4111 1111 1111 1111`
- CVV: Any 3 digits
- Expiry: Any future date

### Test UPI
- UPI ID: `success@razorpay`

---

## 📋 Requirements Checklist

### Account Requirements
- [ ] Valid email address
- [ ] Phone number (Indian)
- [ ] PAN card
- [ ] Business details
- [ ] Bank account (Indian)
- [ ] Business documents (for KYC)
- [ ] GST (optional, recommended)

### Technical Requirements
- [ ] `razorpay` npm package
- [ ] API keys (test/live)
- [ ] Environment variables set
- [ ] Code uncommented
- [ ] HTTPS (for production)

### Razorpay Dashboard Setup
- [ ] Account verified
- [ ] Payment methods enabled (UPI, Cards, Net Banking)
- [ ] Webhook configured (optional)
- [ ] Settlement account added

---

## 💰 Costs

- **Setup Fee**: ₹0 (Free)
- **Annual Fee**: ₹0 (Free)
- **Transaction Fee**: ~2% + GST per successful transaction
- **Settlement**: T+3 days (3 business days)

---

## 🆘 Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| "Key ID required" | Check `.env.local` has `NEXT_PUBLIC_RAZORPAY_KEY_ID` |
| Payment fails | Use test cards, verify test mode enabled |
| Code not working | Ensure code is uncommented |
| Build errors | Run `npm install razorpay` |
| Live mode not working | Complete KYC, use live keys |

---

## 📚 Documentation

**Full Guide**: See `RAZORPAY_SETUP_GUIDE.md`
**Official Docs**: https://razorpay.com/docs/
**Support**: support@razorpay.com

---

## 🎯 Current Status

✅ **Stripe Removed** - Completely removed from codebase
✅ **COD Working** - Cash on Delivery fully functional
⏳ **Razorpay Ready** - Code ready, needs API keys

---

**Setup Time**: 30 minutes
**KYC Approval**: 1-2 business days
**Go Live**: After KYC approval
