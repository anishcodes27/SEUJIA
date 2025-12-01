# 🔧 Fix COD Payment Provider Error

## The Problem
You're getting this error when placing COD orders:
```
new row for relation "orders" violates check constraint "orders_payment_provider_check"
```

**Reason:** The database only allows 'stripe' and 'razorpay' as payment providers, but we're trying to use 'cod'.

---

## ✅ Solution - Run This SQL

### Step 1: Open Supabase Dashboard
1. Go to https://supabase.com
2. Login to your account
3. Select your project

### Step 2: Open SQL Editor
1. Click **"SQL Editor"** in the left sidebar
2. Click **"New Query"**

### Step 3: Copy and Run This SQL

```sql
-- Add COD to allowed payment providers
ALTER TABLE orders 
DROP CONSTRAINT IF EXISTS orders_payment_provider_check;

ALTER TABLE orders 
ADD CONSTRAINT orders_payment_provider_check 
CHECK (payment_provider IN ('stripe', 'razorpay', 'cod'));
```

### Step 4: Click "Run" Button
- The SQL will execute
- You should see: "Success. No rows returned"

### Step 5: Verify the Fix
- Go back to your website
- Try placing a COD order
- It should work now! ✅

---

## Alternative: Run from File

The SQL is also saved in: `supabase/add_cod_payment_option.sql`

**To run it:**
1. Open Supabase SQL Editor
2. Copy content from `supabase/add_cod_payment_option.sql`
3. Paste in SQL Editor
4. Click "Run"

---

## What This Does

**Before:**
- ❌ payment_provider can only be: 'stripe' or 'razorpay'
- ❌ COD orders fail with constraint error

**After:**
- ✅ payment_provider can be: 'stripe', 'razorpay', or 'cod'
- ✅ COD orders work perfectly

---

## Test After Fix

1. **Add products to cart**
2. **Go to checkout**
3. **Fill in all details**
4. **Enter pincode** (e.g., 110001)
5. **Select "Cash on Delivery"**
6. **Click "Place Order"**
7. **Should work!** ✅

---

## If Still Having Issues

**Check these:**

1. **SQL ran successfully?**
   - Look for "Success" message in Supabase
   - No red error messages

2. **Correct database?**
   - Make sure you're in the right project
   - Check project name at top of Supabase dashboard

3. **Browser cache?**
   - Clear browser cache
   - Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

4. **Server restarted?**
   - Stop dev server (Ctrl+C)
   - Start again: `npm run dev`

---

## Verification Query

To check if the fix worked, run this in SQL Editor:

```sql
-- Check constraint details
SELECT 
  conname as constraint_name,
  pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'orders'::regclass 
AND conname = 'orders_payment_provider_check';
```

**Expected Result:**
```
CHECK ((payment_provider)::text = ANY (ARRAY[('stripe'::character varying)::text, ('razorpay'::character varying)::text, ('cod'::character varying)::text]))
```

---

**Run the SQL fix and you'll be able to accept COD orders!** 🎉
