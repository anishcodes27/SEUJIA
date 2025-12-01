# Complete Supabase Database Setup Guide
## For Complete Beginners - Step by Step

This guide will walk you through setting up your Supabase database for the Seujia Honey website from scratch.

---

## Part 1: Create Supabase Account

### Step 1: Go to Supabase Website
1. Open your web browser
2. Go to: **https://supabase.com**
3. Click the **"Start your project"** button (or "Sign Up")

### Step 2: Sign Up for Free Account
You can sign up using:
- **GitHub account** (recommended - fastest)
- **Email and password**

**Instructions:**
1. Click "Continue with GitHub" OR enter your email
2. If using email, check your inbox for verification email
3. Click the verification link in the email
4. You'll be redirected to Supabase Dashboard

---

## Part 2: Create Your Project

### Step 3: Create a New Project
1. After logging in, you'll see the Supabase Dashboard
2. Click **"New Project"** button (big green button)

### Step 4: Create/Select Organization
1. If this is your first time:
   - Click **"New Organization"**
   - Enter organization name: `Seujia Honey` (or any name you like)
   - Click **"Create Organization"**
2. If you already have an organization:
   - Select it from the dropdown

### Step 5: Fill in Project Details
Now fill in the project creation form:

1. **Project Name**: `seujia-honey-store` (or any name you prefer)
2. **Database Password**: 
   - Click **"Generate a password"** (recommended)
   - **IMPORTANT**: Copy this password and save it somewhere safe!
   - You'll need it later
3. **Region**: Choose the closest to your location:
   - For India: `Southeast Asia (Singapore)`
   - For US: `East US (North Virginia)`
   - For Europe: `West EU (Ireland)`
4. **Pricing Plan**: Select **"Free"** (perfect for development)
5. Click **"Create new project"** button

### Step 6: Wait for Project Setup
- You'll see a progress bar
- This takes about 2-3 minutes
- **Do not close the browser**
- When done, you'll see your project dashboard

---

## Part 3: Get Your API Keys

### Step 7: Find Your Project Settings
1. In your project dashboard, look at the left sidebar
2. Click on the **"Settings"** icon (gear icon at bottom)
3. Click on **"API"** in the settings menu

### Step 8: Copy Your API Keys
You'll see several keys. Copy these two:

1. **Project URL**:
   - Look for "Project URL" 
   - It looks like: `https://abcdefgh.supabase.co`
   - Click the copy icon to copy it
   - Save it in a notepad

2. **Anon/Public Key** (anon key):
   - Look for "Project API keys" section
   - Find the key labeled `anon` `public`
   - Click "Reveal" then copy it
   - It's a long string starting with `eyJ...`
   - Save it in notepad

3. **Service Role Key** (service_role):
   - In the same section
   - Find the key labeled `service_role` `secret`
   - Click "Reveal" then copy it
   - It's also a long string starting with `eyJ...`
   - Save it in notepad

**IMPORTANT**: Keep these keys safe! Don't share them publicly.

---

## Part 4: Create Database Tables

### Step 9: Open SQL Editor
1. In the left sidebar of your Supabase project
2. Click on **"SQL Editor"** (looks like a database icon)
3. Click **"New Query"** button (top right)

### Step 10: Run the Schema SQL
1. Open the file `supabase/schema.sql` from your project folder
2. Copy **ALL** the content from that file
3. Paste it into the SQL Editor in Supabase
4. Click **"Run"** button (bottom right)
5. Wait for it to complete
6. You should see: "Success. No rows returned"

**What this does:**
- Creates 4 tables: `products`, `coupons`, `orders`, `order_items`
- Sets up relationships between tables
- Adds sample products and coupons
- Creates necessary indexes for fast queries

---

## Part 5: Set Up Storage for Product Images

### Step 11: Create Storage Bucket
1. In the left sidebar, click **"Storage"**
2. Click **"Create a new bucket"** button
3. Fill in the form:
   - **Name**: `product-images` (exactly this)
   - **Public bucket**: Toggle this **ON** (must be green/checked)
   - **File size limit**: `5` MB
   - **Allowed MIME types**: `image/*`
4. Click **"Create bucket"**

### Step 12: Verify Bucket is Public
1. Click on the `product-images` bucket you just created
2. At the top, you should see "Public bucket" label
3. If you don't see it, click the three dots (⋮) > Edit > Enable "Public bucket"

---

## Part 6: Add Your Products

### Step 13: Run Product Insert SQL
1. Go back to **SQL Editor**
2. Click **"New Query"**
3. Open the file `supabase/add_products.sql` from your project
4. Copy **ALL** the content
5. Paste into the SQL Editor
6. Click **"Run"**
7. You should see: "Success. 6 rows returned" or similar

**What this does:**
- Adds 6 products (Jujube, Multiflora, Ajwain honey in 250gm and 500gm)
- Sets prices as you specified
- Includes seasonal variation notice in descriptions

### Step 14: Verify Products Were Added
In the SQL Editor, run this query:
```sql
SELECT name, price, stock FROM products ORDER BY name;
```
Click **"Run"**

You should see all 6 products listed with their prices.

---

## Part 7: Upload Product Images

### Step 15: Upload Images to Storage
1. Click **"Storage"** in left sidebar
2. Click on **"product-images"** bucket
3. Click **"Upload file"** button
4. Select your product images (one at a time or multiple)
5. Recommended names:
   - `jujube-250.jpg`
   - `jujube-500.jpg`
   - `multiflora-250.jpg`
   - `multiflora-500.jpg`
   - `ajwain-250.jpg`
   - `ajwain-500.jpg`
6. Click **"Upload"**

### Step 16: Get Image URLs
For each uploaded image:
1. Click on the image in the storage browser
2. Click **"Get URL"** or **"Copy URL"** button
3. Copy the URL (looks like: `https://your-project.supabase.co/storage/v1/object/public/product-images/jujube-250.jpg`)
4. Save it in notepad

### Step 17: Update Product Image URLs
1. Go to **SQL Editor** > **New Query**
2. For each product, run this SQL (replace with YOUR actual URLs):

```sql
-- Update Jujube Honey 250gm
UPDATE products 
SET image_url = 'https://YOUR-PROJECT.supabase.co/storage/v1/object/public/product-images/jujube-250.jpg' 
WHERE slug = 'jujube-honey-250gm';

-- Update Jujube Honey 500gm
UPDATE products 
SET image_url = 'https://YOUR-PROJECT.supabase.co/storage/v1/object/public/product-images/jujube-500.jpg' 
WHERE slug = 'jujube-honey-500gm';

-- Update Multiflora Honey 250gm
UPDATE products 
SET image_url = 'https://YOUR-PROJECT.supabase.co/storage/v1/object/public/product-images/multiflora-250.jpg' 
WHERE slug = 'multiflora-honey-250gm';

-- Update Multiflora Honey 500gm
UPDATE products 
SET image_url = 'https://YOUR-PROJECT.supabase.co/storage/v1/object/public/product-images/multiflora-500.jpg' 
WHERE slug = 'multiflora-honey-500gm';

-- Update Ajwain Honey 250gm
UPDATE products 
SET image_url = 'https://YOUR-PROJECT.supabase.co/storage/v1/object/public/product-images/ajwain-250.jpg' 
WHERE slug = 'ajwain-honey-250gm';

-- Update Ajwain Honey 500gm
UPDATE products 
SET image_url = 'https://YOUR-PROJECT.supabase.co/storage/v1/object/public/product-images/ajwain-500.jpg' 
WHERE slug = 'ajwain-honey-500gm';
```

3. Click **"Run"** after pasting
4. Should see: "Success. 6 rows returned"

---

## Part 8: Connect to Your Website

### Step 18: Update Environment Variables (DETAILED)

Environment variables are like secret configuration settings that your website needs to work. Think of them as a "settings file" that tells your website how to connect to Supabase.

#### What are Environment Variables?
They store sensitive information like:
- Database connection details
- API keys (passwords for your services)
- Secret codes that should never be shared publicly

#### Why Do We Need Them?
Your website needs to know:
- WHERE is your database? (Supabase URL)
- HOW to access it? (API keys)
- WHO can do admin tasks? (Admin password)

---

#### PART A: Find the .env.example File

**Step 1: Open Your Project Folder**
1. Open File Explorer (Windows) or Finder (Mac)
2. Navigate to your project folder: `seujia_web`
3. You should see many files and folders

**Step 2: Find .env.example**
1. Look for a file named **`.env.example`**
2. **Can't see it?** Files starting with a dot (.) are often hidden
3. **On Windows**:
   - Click "View" menu at top
   - Check the box "Hidden items"
4. **On Mac**:
   - Press `Cmd + Shift + .` (period) to show hidden files
5. Now you should see `.env.example`

---

#### PART B: Create Your .env.local File

**Step 3: Copy the File**
1. **Right-click** on `.env.example`
2. Select **"Copy"**
3. **Right-click** in empty space in the same folder
4. Select **"Paste"**
5. You now have a file called `.env - Copy.example` or similar

**Step 4: Rename to .env.local**
1. **Right-click** the copied file
2. Select **"Rename"**
3. Delete the entire name
4. Type exactly: `.env.local` (must include the dot at the start!)
5. Press **Enter**
6. If you see a warning "If you change the extension, the file might become unusable", click **"Yes"** or **"Use .env.local"**

**Important**: The file MUST be named exactly `.env.local` - not `.env.local.txt` or anything else!

---

#### PART C: Open and Edit the File

**Step 5: Open in Text Editor**

**Option 1 - Using VS Code (Recommended):**
1. Right-click `.env.local`
2. Select "Open with" > "Visual Studio Code" or "Code"
3. File opens in VS Code

**Option 2 - Using Notepad (Windows):**
1. Right-click `.env.local`
2. Select "Open with" > "Notepad"
3. File opens in Notepad

**Option 3 - Using TextEdit (Mac):**
1. Right-click `.env.local`
2. Select "Open with" > "TextEdit"
3. File opens in TextEdit

**Step 6: You'll See This Template**
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Stripe (for payments - optional for now)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Razorpay (for payments - optional for now)
NEXT_PUBLIC_RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=

# Admin Panel
ADMIN_PASSWORD=admin123
```

---

#### PART D: Fill in Your Supabase Details

Now you'll replace the placeholder text with YOUR actual Supabase information (that you saved in Step 8).

**Step 7: Add Your Supabase URL**

Find this line:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
```

**Replace it with YOUR Project URL** (from Step 8):
```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijk.supabase.co
```

**EXAMPLE - Before:**
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
```

**EXAMPLE - After (with YOUR actual URL):**
```env
NEXT_PUBLIC_SUPABASE_URL=https://xyzprojectid.supabase.co
```

⚠️ **Important Rules:**
- No spaces before or after the `=` sign
- Don't add quotes around the URL
- Make sure it starts with `https://`
- Make sure it ends with `.supabase.co`

---

**Step 8: Add Your Anon Key**

Find this line:
```env
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

**Replace with YOUR Anon Key** (from Step 8):
- It's a VERY long string (around 150+ characters)
- Starts with `eyJ`
- Has lots of random letters and dots

**EXAMPLE - After:**
```env
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVidGRneG5hY3R2dXpub2J0eHdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTg4MzE2MzAsImV4cCI6MjAxNDQwNzYzMH0.fK9Zr8B3QxYkC5L7d2M9p1N6vT3hW8jX
```

⚠️ **Important:**
- Copy the ENTIRE key (it's very long!)
- Don't break it into multiple lines
- No spaces
- Make sure you copied it completely

---

**Step 9: Add Your Service Role Key**

Find this line:
```env
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
```

**Replace with YOUR Service Role Key** (from Step 8):
- Also a very long string
- Also starts with `eyJ`
- Similar length to anon key but DIFFERENT

**EXAMPLE - After:**
```env
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVidGRneG5hY3R2dXpub2J0eHdwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY5ODgzMTYzMCwiZXhwIjoyMDE0NDA3NjMwfQ.dF8Sr9C4RyZlD6M8e3O0q2P7wU4iY9kZ
```

⚠️ **Important:**
- This is DIFFERENT from the anon key!
- Also copy the entire string
- Keep it all on one line

---

**Step 10: Set Admin Password**

Find this line:
```env
ADMIN_PASSWORD=admin123
```

**Change it to YOUR secure password:**
```env
ADMIN_PASSWORD=MySecurePassword2024!
```

**Tips for good password:**
- At least 8 characters
- Mix of letters and numbers
- Include special characters like ! @ # $
- Don't use "password" or "admin"
- This is what you'll use to login to `/admin`

---

**Step 11: Leave Payment Fields Empty (For Now)**

These lines can stay empty:
```env
# Stripe (for payments - optional for now)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Razorpay (for payments - optional for now)
NEXT_PUBLIC_RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=
```

**Why?** You'll set these up later when you're ready to accept real payments.

---

#### PART E: Save the File

**Step 12: Save Your Changes**

**In VS Code:**
- Press `Ctrl + S` (Windows) or `Cmd + S` (Mac)
- Or click File > Save

**In Notepad/TextEdit:**
- Click File > Save
- Or press `Ctrl + S` (Windows) or `Cmd + S` (Mac)

**Step 13: Close the Editor**
- Close the text editor
- Your `.env.local` file is now ready!

---

#### PART F: Verify Your File

**Step 14: Double-Check Everything**

Your final `.env.local` should look like this:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xyzprojectid.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFz...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFz...

# Stripe (for payments - optional for now)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Razorpay (for payments - optional for now)
NEXT_PUBLIC_RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=

# Admin Panel
ADMIN_PASSWORD=YourSecurePassword123!
```

**Checklist - Make sure:**
- [ ] File is named exactly `.env.local` (with the dot)
- [ ] File is in the root of `seujia_web` folder (same level as package.json)
- [ ] Supabase URL is filled in (starts with https://)
- [ ] Anon key is filled in (very long string)
- [ ] Service role key is filled in (very long string)
- [ ] Admin password is changed from default
- [ ] No extra spaces around the `=` signs
- [ ] File is saved

---

#### Common Mistakes to Avoid

❌ **Wrong file name:**
- `.env.local.txt` ❌
- `env.local` ❌
- `.env` ❌
- `.env.example` ❌

✅ **Correct:** `.env.local`

---

❌ **Spaces around equals sign:**
```env
NEXT_PUBLIC_SUPABASE_URL = https://xyz.supabase.co  ❌
```

✅ **Correct:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://xyz.supabase.co
```

---

❌ **Quotes around values:**
```env
NEXT_PUBLIC_SUPABASE_URL="https://xyz.supabase.co"  ❌
```

✅ **Correct:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://xyz.supabase.co
```

---

❌ **Breaking long keys into multiple lines:**
```env
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiI
sInR5cCI6IkpXVCJ9...  ❌
```

✅ **Correct (all on one line):**
```env
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

#### What Happens Next?

After you save `.env.local`:
1. Your website can now connect to Supabase
2. It can read products from your database
3. It can upload images to storage
4. The admin panel will work with your password

---

#### Security Notes

🔒 **IMPORTANT:**
- Never share your `.env.local` file
- Never commit it to Git (it's already in .gitignore)
- Never post your keys online or in screenshots
- These keys give access to your database!

---

**✅ Step 18 Complete!** Your website is now connected to Supabase!

Continue to Step 19 to test if everything works...

### Step 19: Test the Connection
1. Open terminal in your project folder
2. Run:
   ```bash
   npm install
   ```
3. Wait for installation to complete
4. Then run:
   ```bash
   npm run dev
   ```
5. Open browser and go to: `http://localhost:3000`
6. Click "Shop" in navbar
7. You should see your products!

---

## Part 9: Verify Everything Works

### Step 20: Check Your Data
Go to Supabase Dashboard:

1. **Table Editor**:
   - Click "Table Editor" in sidebar
   - Click on `products` table
   - You should see all 6 products with images

2. **Storage**:
   - Click "Storage"
   - Click `product-images`
   - You should see all uploaded images

3. **SQL Editor** - Run this test query:
   ```sql
   SELECT 
     name, 
     price, 
     stock, 
     is_active,
     image_url
   FROM products 
   WHERE is_active = true
   ORDER BY name;
   ```
   - Should show all 6 products

---

## Quick Reference - What You Need

### From Supabase (save these):
- ✅ Project URL: `https://xxxxx.supabase.co`
- ✅ Anon Key: `eyJhbG...` (long string)
- ✅ Service Role Key: `eyJhbG...` (long string)
- ✅ Database Password (if needed later)

### Files You Created/Modified:
- ✅ `.env.local` (with your Supabase keys)
- ✅ Product images uploaded to storage
- ✅ Database tables created
- ✅ Products added

---

## Troubleshooting

### Problem: "No rows returned" when viewing products
**Solution**: 
- Go to SQL Editor
- Run: `SELECT * FROM products;`
- If empty, run the `add_products.sql` again

### Problem: Images not showing
**Solution**:
1. Check bucket is public (Settings > Make public)
2. Verify image URLs are correct
3. Make sure URLs start with `https://`

### Problem: Can't connect to database
**Solution**:
1. Check `.env.local` has correct values
2. Make sure there are no spaces in the keys
3. Restart dev server: Stop (Ctrl+C) and run `npm run dev` again

### Problem: "Project not found"
**Solution**:
- Double-check the Project URL in `.env.local`
- Make sure it matches exactly from Supabase Settings > API

---

## Next Steps

After completing this setup:

1. ✅ Your database is ready
2. ✅ Products are added
3. ✅ Images are uploaded
4. ✅ Website can connect to database

Now you can:
- View products on your website
- Add products to cart
- Test the checkout flow
- Add more products via Admin panel (`/admin`)

---

## Important Notes

🔒 **Security**:
- Never share your Service Role Key publicly
- Don't commit `.env.local` to Git (it's already in .gitignore)
- Keep your database password safe

💰 **Free Tier Limits**:
- 500 MB database space
- 1 GB file storage
- 2 GB bandwidth per month
- Unlimited API requests
- Perfect for development and small production sites

📧 **Support**:
- Supabase Docs: https://supabase.com/docs
- Supabase Discord: https://discord.supabase.com

---

## Summary - What You Did

1. ✅ Created Supabase account
2. ✅ Created a new project
3. ✅ Got API keys
4. ✅ Created database tables (products, orders, coupons, order_items)
5. ✅ Set up image storage
6. ✅ Added 6 honey products
7. ✅ Uploaded product images
8. ✅ Connected website to database
9. ✅ Tested everything works

**Congratulations! Your Supabase database is now fully set up and ready to use! 🎉🍯**
