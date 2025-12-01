# Authentication System Setup Guide

This guide explains how to set up the authentication system for your Seujia Honey e-commerce website.

## 🎯 What's Been Added

### 1. **Login & Signup Pages**
- Beautiful login page at `/login`
- Registration page at `/signup`
- Both match your honey color theme
- Responsive design for mobile and desktop

### 2. **Authentication Context**
- Manages user login state across the entire app
- Stores user data (name, email, ID)
- Handles login, signup, and logout

### 3. **Updated Navbar**
- Shows "Login" and "Sign Up" buttons for guests
- Shows user profile with dropdown menu when logged in
- Displays user's first name and avatar
- "Sign Out" option in dropdown menu

### 4. **API Routes**
- `/api/auth/signup` - Creates new user accounts
- `/api/auth/login` - Authenticates users
- Stores data in Supabase database

## 📋 Setup Steps

### Step 1: Create Users Table in Supabase

1. Go to your Supabase Dashboard: https://app.supabase.com
2. Select your project
3. Click on "SQL Editor" in the left sidebar
4. Click "New Query"
5. Copy the contents of `supabase/users_schema.sql`
6. Paste into the SQL Editor
7. Click "Run" to create the users table

**What this does:**
- Creates a `users` table with columns: id, name, email, password, created_at, updated_at
- Adds an index on email for faster lookups
- Sets up Row Level Security (RLS) policies

### Step 2: Verify the Table Was Created

1. In Supabase, click "Table Editor" in the left sidebar
2. You should see a new table called "users"
3. Click on it to see the columns

### Step 3: Install Supabase Package (If Not Already Installed)

If you see an error about `@supabase/supabase-js` not being found, install it:

```bash
npm install @supabase/supabase-js
```

### Step 4: Test the Authentication System

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Open http://localhost:3000 in your browser

3. Click "Sign Up" in the navbar

4. Fill in the form:
   - Full Name: John Doe
   - Email: john@example.com
   - Password: test123 (at least 6 characters)
   - Confirm Password: test123

5. Click "Create Account"

6. If successful, you'll be redirected to the home page and see your name in the navbar

7. Try logging out and logging back in

## 🎨 Features

### For Guests (Not Logged In):
- Can browse products
- Can add to cart
- See "Login" and "Sign Up" buttons in navbar

### For Logged-In Users:
- See their name and avatar in navbar
- Can click on profile to see dropdown menu
- Can sign out
- User data persists in localStorage

## 📊 Tracking Customers

### View All Registered Users

To see how many customers have signed up:

1. Go to Supabase Dashboard
2. Click "Table Editor"
3. Select "users" table
4. You'll see all registered users with:
   - Name
   - Email
   - Registration date (created_at)

### Get User Count

Run this SQL query in Supabase SQL Editor:

```sql
SELECT COUNT(*) as total_users FROM users;
```

### Get Recent Signups

```sql
SELECT name, email, created_at 
FROM users 
ORDER BY created_at DESC 
LIMIT 10;
```

### Export User Data

1. In Table Editor, click on "users" table
2. Click the "..." menu (three dots)
3. Select "Download as CSV"
4. Save the file with all your customer data

## 🔒 Security Notes

### ⚠️ IMPORTANT: Password Security

The current implementation uses basic Base64 encoding for passwords. **This is NOT secure for production!**

**Before launching your website, you MUST:**

1. Install bcrypt:
   ```bash
   npm install bcrypt
   npm install --save-dev @types/bcrypt
   ```

2. Update `app/api/auth/signup/route.ts`:
   ```typescript
   import bcrypt from 'bcrypt';
   
   // Replace this line:
   const hashedPassword = Buffer.from(password).toString('base64');
   
   // With this:
   const hashedPassword = await bcrypt.hash(password, 10);
   ```

3. Update `app/api/auth/login/route.ts`:
   ```typescript
   import bcrypt from 'bcrypt';
   
   // Replace these lines:
   const hashedPassword = Buffer.from(password).toString('base64');
   if (user.password !== hashedPassword) {
   
   // With this:
   const isValidPassword = await bcrypt.compare(password, user.password);
   if (!isValidPassword) {
   ```

## 🎯 What Happens When Users Sign Up

1. User fills out signup form with name, email, and password
2. Form validates:
   - All fields are filled
   - Password is at least 6 characters
   - Passwords match
3. Data sent to `/api/auth/signup`
4. API checks if email already exists
5. If new, creates user in Supabase `users` table
6. Returns user data (without password)
7. User data saved to localStorage
8. User automatically logged in
9. Redirected to home page
10. Navbar updates to show user profile

## 🎯 What Happens When Users Log In

1. User enters email and password
2. Data sent to `/api/auth/login`
3. API looks up user by email in Supabase
4. Compares passwords
5. If match, returns user data
6. User data saved to localStorage
7. User logged in
8. Navbar updates to show profile

## 📱 Mobile Features

- Login and signup forms are fully responsive
- Navbar mobile menu includes auth buttons
- Shows user info in mobile menu when logged in

## 🎨 Theme Consistency

All authentication pages use your honey color scheme:
- Honey gradient backgrounds
- Honey-colored buttons
- Logo displayed on auth pages
- Consistent with rest of website

## 🔄 Next Steps

1. ✅ Create users table (Step 1)
2. ✅ Test signup and login
3. ✅ Verify users appear in Supabase
4. 🔒 Add bcrypt password hashing (before production)
5. 📧 Add email verification (optional)
6. 🔑 Add "Forgot Password" feature (optional)
7. 👤 Create user profile page (optional)
8. 📦 Link orders to user accounts (optional)

## 🐛 Troubleshooting

### Error: "@supabase/supabase-js not found"
**Solution:** Run `npm install @supabase/supabase-js`

### Error: "Failed to create user"
**Solution:** Make sure you've run the SQL schema in Step 1

### Error: "Email already registered"
**Solution:** User is trying to sign up with an email that's already in the database. Tell them to use the login page instead.

### Users not appearing in Supabase
**Solution:** 
1. Check that SQL schema ran successfully
2. Check browser console for errors
3. Verify NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local

### Can't log in after signup
**Solution:** Make sure you're using the exact same email and password

## 📈 Analytics Ideas

You can track:
- Total number of users
- New signups per day/week/month
- User growth over time
- Most common signup times
- User engagement (users who made purchases vs just signed up)

## 🎉 Success!

You now have a fully functional authentication system! Users can:
- ✅ Create accounts
- ✅ Log in and out
- ✅ See their profile in navbar
- ✅ Have persistent sessions (stored in localStorage)

Your Supabase database now tracks all customer registrations, giving you valuable insights into your user base!
