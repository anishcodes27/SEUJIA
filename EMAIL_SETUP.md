# 📧 Email Automation Setup Guide

## Welcome Email System for Seujia Honey

This guide will help you set up automatic welcome emails that are sent whenever a new customer signs up on your website.

---

## 🎯 What's Been Implemented

### ✅ Features Added:

1. **Beautiful HTML Email Template**
   - Honey-themed design with gradient colors
   - Responsive layout that works on all devices
   - Professional branding with Seujia logo
   - Clear call-to-action button to shop

2. **Automated Email Sending**
   - Triggers automatically after successful signup
   - Uses Resend (free tier: 3,000 emails/month!)
   - Doesn't block signup process if email fails
   - Logs all email activity for tracking

3. **Email Content Includes:**
   - Personalized greeting with customer's name
   - Welcome message from Seujia Honey
   - List of benefits (pure honey, exclusive offers, etc.)
   - "Start Shopping" button linking to your shop
   - Contact information and social media links
   - Professional footer with copyright

---

## 📋 Step-by-Step Setup

### Step 1: Create a Free Resend Account

1. Go to https://resend.com
2. Click **"Start Building"** or **"Sign Up"**
3. Sign up with your email or GitHub account
4. Verify your email address

**Free Tier Benefits:**
- ✅ 3,000 emails per month (100/day)
- ✅ No credit card required
- ✅ Perfect for small to medium businesses

---

### Step 2: Get Your API Key

1. After logging in, go to your Resend Dashboard
2. Click **"API Keys"** in the left sidebar
3. Click **"Create API Key"**
4. Give it a name (e.g., "Seujia Production")
5. Select permissions: **"Sending access"**
6. Click **"Create"**
7. **COPY THE API KEY** - you won't see it again!

It will look like: `re_123abc456def789ghi012jkl345mno678`

---

### Step 3: Add API Key to Your Project

1. Open your `.env.local` file (in the root of your project)
2. Add this line with your actual API key:

\`\`\`
RESEND_API_KEY=re_your_actual_api_key_here
\`\`\`

3. Save the file

**Example `.env.local` file:**
\`\`\`
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_supabase_key
RESEND_API_KEY=re_123abc456def789ghi012jkl345mno678
EMAIL_FROM=Seujia Honey <hello@seujia.com>
NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`

---

### Step 4: Domain Verification (Detailed Guide)

#### 🎯 Two Options Available:

---

#### **OPTION A: Use Resend's Test Domain (Easiest - Recommended for Development)**

**Best for:** Testing, development, or if you don't have a custom domain

1. In your `.env.local` file, use:
   \`\`\`
   EMAIL_FROM=Seujia Honey <onboarding@resend.dev>
   \`\`\`

2. **That's it!** This works immediately with no verification needed.

**Limitations:**
- "resend.dev" appears in sender address
- May have lower deliverability for production use
- Good for testing but unprofessional for customers

---

#### **OPTION B: Verify Your Custom Domain (Professional - Recommended for Production)**

**Best for:** Production, sending emails from your own domain (e.g., hello@seujia.com)

**⚠️ IMPORTANT:** You must own a domain (purchased from GoDaddy, Namecheap, etc.) to use this option.

---

### 🔧 Detailed Domain Verification Steps:

#### **Part 1: Add Domain to Resend**

1. Log in to your Resend Dashboard at https://resend.com
2. Click **"Domains"** in the left sidebar
3. Click **"Add Domain"** button
4. Enter your **root domain only** (without www or subdomain)
   - ✅ Correct: `seujia.com` or `yourdomain.com`
   - ❌ Wrong: `www.seujia.com`, `https://seujia.com`, `mail.seujia.com`
5. Click **"Add"**

#### **Part 2: Get Your DNS Records**

After adding the domain, Resend will show you **3 DNS records** that look like this:

**Example DNS Records:**

| Type  | Name/Host              | Value/Data                                    | TTL  |
|-------|------------------------|-----------------------------------------------|------|
| TXT   | `@` or blank          | `v=spf1 include:_spf.resend.com ~all`         | 3600 |
| TXT   | `resend._domainkey`   | `p=MIGfMA0GCS...` (long string)               | 3600 |
| TXT   | `_dmarc`              | `v=DMARC1; p=none; pct=100; rua=mailto:...`   | 3600 |

**Screenshot this page or copy all values!** You'll need them in the next step.

---

#### **Part 3: Add DNS Records to Your Domain Provider**

Now you need to add these records to wherever you bought your domain. Here's how for popular providers:

---

##### **🌐 For GoDaddy:**

1. Log in to https://godaddy.com
2. Go to **"My Products"**
3. Find your domain, click **"DNS"** or **"Manage DNS"**
4. Scroll to **"Records"** section
5. Click **"Add"** button (or **"Add Record"**)
6. For each of the 3 records from Resend:
   - **Type:** Select `TXT`
   - **Name/Host:** Enter exactly as shown in Resend (e.g., `@`, `resend._domainkey`, `_dmarc`)
   - **Value/TXT Value:** Copy-paste the entire value from Resend
   - **TTL:** Use `3600` or `1 hour`
   - Click **"Save"**
7. Repeat for all 3 records

**GoDaddy Tips:**
- If "Name" field auto-adds your domain, just use the prefix (e.g., if it shows "resend._domainkey.seujia.com", just enter "resend._domainkey")
- Don't add quotes around values
- Click "Save" after each record

---

##### **🌐 For Namecheap:**

1. Log in to https://namecheap.com
2. Go to **"Domain List"**
3. Click **"Manage"** next to your domain
4. Go to **"Advanced DNS"** tab
5. Scroll to **"Host Records"** section
6. Click **"Add New Record"**
7. For each record:
   - **Type:** Select `TXT Record`
   - **Host:** Enter as shown in Resend (e.g., `@`, `resend._domainkey`, `_dmarc`)
   - **Value:** Paste the value from Resend
   - **TTL:** Select `Automatic` or `1 hour`
8. Click green checkmark to save

**Namecheap Tips:**
- Use `@` for root domain records
- Don't include your domain name in the Host field
- Make sure there are no extra spaces in the Value field

---

##### **🌐 For Cloudflare:**

1. Log in to https://dash.cloudflare.com
2. Select your domain from the list
3. Click **"DNS"** in the top menu
4. Click **"Add record"** button
5. For each record:
   - **Type:** Select `TXT`
   - **Name:** Enter as shown (e.g., `@`, `resend._domainkey`, `_dmarc`)
   - **Content:** Paste the value from Resend
   - **TTL:** Select `Auto` or `3600`
   - **Proxy status:** Toggle OFF (gray cloud)
6. Click **"Save"**

**Cloudflare Tips:**
- Make sure Proxy is OFF (gray cloud, not orange)
- Cloudflare is usually the fastest to propagate (5-10 minutes)

---

##### **🌐 For Other Providers:**

The process is similar for all DNS providers:
1. Find "DNS Management", "DNS Settings", or "Zone Editor"
2. Look for "Add Record" or "Add TXT Record"
3. Add all 3 TXT records from Resend
4. Save changes

**Common Providers:**
- **Bluehost:** My Sites → Manage Site → Advanced → DNS
- **HostGator:** Domains → DNS → Manage
- **Domain.com:** Domain Overview → DNS & Nameservers → DNS Records
- **Google Domains:** DNS → Custom records → Manage custom records

---

#### **Part 4: Verify Your Records Were Added Correctly**

Before waiting, check if DNS records are added:

1. Open a new tab and go to: https://mxtoolbox.com/SuperTool.aspx
2. Select **"TXT Lookup"** from dropdown
3. Enter: `seujia.com` (your domain)
4. Click **"TXT Lookup"**
5. You should see your SPF record in the results

**Or use command line:**
\`\`\`bash
# Check SPF record
nslookup -type=TXT seujia.com

# Check DKIM record
nslookup -type=TXT resend._domainkey.seujia.com

# Check DMARC record
nslookup -type=TXT _dmarc.seujia.com
\`\`\`

---

#### **Part 5: Wait for DNS Propagation**

**Typical Wait Times:**
- ⚡ **5-30 minutes** - Most providers (Cloudflare, Namecheap)
- 🕐 **1-4 hours** - Some providers (GoDaddy)
- ⏰ **Up to 24-48 hours** - In rare cases

**What's happening:** Your DNS records are being distributed across internet servers worldwide.

**DO NOT click "Verify" in Resend repeatedly!** Wait at least 15-30 minutes between attempts.

---

#### **Part 6: Verify in Resend Dashboard**

After waiting (at least 30 minutes):

1. Go back to Resend Dashboard → Domains
2. Find your domain in the list
3. Click **"Verify"** button
4. Wait for verification to complete

**Status Indicators:**
- ✅ **Verified** - Success! You can send emails
- ⏳ **Pending** - Wait longer and try again
- ❌ **Failed** - Check troubleshooting below

---

#### **Part 7: Update Your Environment Variables**

Once verified, update `.env.local`:

\`\`\`
EMAIL_FROM=Seujia Honey <hello@seujia.com>
\`\`\`

Replace `seujia.com` with your actual domain.

**Restart your dev server:**
\`\`\`bash
npm run dev
\`\`\`

---

### 🐛 Domain Verification Troubleshooting

#### ❌ **Problem: "Domain verification failed"**

**Most Common Causes:**

1. **DNS records not propagated yet**
   - **Solution:** Wait 30 minutes to 2 hours, then try again
   - Check with MXToolbox: https://mxtoolbox.com/SuperTool.aspx

2. **Incorrect DNS record values**
   - **Solution:** Double-check you copied the ENTIRE value from Resend
   - Make sure no spaces at start/end of value
   - TXT values should NOT have quotes (unless your provider requires them)

3. **Wrong record name/host**
   - **Solution:** 
     - For SPF: Use `@` or leave blank (NOT your domain name)
     - For DKIM: Use exactly `resend._domainkey`
     - For DMARC: Use exactly `_dmarc`

4. **Multiple SPF records**
   - **Solution:** You can only have ONE SPF record per domain
   - If you already have an SPF record, merge them:
   - Old: `v=spf1 include:_spf.google.com ~all`
   - New: `v=spf1 include:_spf.google.com include:_spf.resend.com ~all`

5. **Domain provider doesn't allow subdomain TXT records**
   - **Solution:** Contact your domain provider support
   - Or switch to a provider that supports full DNS management

6. **Nameservers not pointed correctly**
   - **Solution:** Make sure your domain's nameservers point to your DNS provider
   - Check in domain registrar: Domain Settings → Nameservers

---

#### 🔍 **How to Check What's Wrong:**

**Method 1: Use MXToolbox**
1. Go to https://mxtoolbox.com/SuperTool.aspx
2. Enter: `resend._domainkey.yourdomain.com`
3. Select "TXT Lookup"
4. If it shows "DNS Record not found" → Records not added or not propagated yet

**Method 2: Use Command Line**
\`\`\`bash
# On Mac/Linux/Windows (in PowerShell or Terminal)
nslookup -type=TXT resend._domainkey.seujia.com
\`\`\`

If you see the long DKIM key → Records are working!
If you see "no records found" → Wait longer or check DNS settings

**Method 3: Check Resend Error Message**
- Click "Verify" in Resend Dashboard
- If it fails, Resend shows which record is missing
- Focus on fixing that specific record

---

#### ⚡ **Quick Fixes:**

**Can't verify domain?** Use test domain temporarily:
\`\`\`
EMAIL_FROM=Seujia Honey <onboarding@resend.dev>
\`\`\`

**DNS takes too long?** Try Cloudflare (free):
1. Sign up at cloudflare.com
2. Add your domain
3. Change nameservers to Cloudflare
4. Add DNS records (propagates in 5-10 min)

**Still stuck?** Contact Resend support:
- Email: support@resend.com
- Include: Your domain name and screenshot of DNS records

---

### 📋 DNS Records Checklist

Before clicking "Verify" in Resend, confirm:

- [ ] All 3 TXT records added (SPF, DKIM, DMARC)
- [ ] Values copied completely (no truncation)
- [ ] No extra spaces in values
- [ ] Record names exactly match Resend's instructions
- [ ] Waited at least 30 minutes after adding records
- [ ] Checked with MXToolbox that records are visible
- [ ] No conflicting SPF records
- [ ] Domain nameservers point to correct DNS provider

---

### ✅ Success Indicators

You'll know domain verification worked when:

1. Resend Dashboard shows **"Verified"** status with green checkmark
2. You can send test email from your domain
3. Emails show "from: hello@yourdomain.com" (not resend.dev)
4. Emails land in inbox (not spam)

---

**Remember:** Domain verification is optional! You can use `onboarding@resend.dev` for testing and development. Only verify a custom domain when you're ready for production.

---

### Step 5: Restart Your Development Server

1. Stop your server (Ctrl+C in terminal)
2. Start it again:
   \`\`\`bash
   npm run dev
   \`\`\`

---

### Step 6: Test the Welcome Email

1. Go to http://localhost:3000
2. Click **"Sign Up"** in the navbar
3. Fill in the signup form:
   - Name: Your Name
   - Email: **YOUR REAL EMAIL** (to receive the test)
   - Password: test123
4. Click **"Create Account"**
5. Check your email inbox! 📬

**What to Check:**
- ✅ Email arrives within 1-2 minutes
- ✅ Subject line: "Welcome to Seujia Honey, [Your Name]! 🍯"
- ✅ Beautiful honey-themed design
- ✅ Your name appears in the email
- ✅ "Start Shopping" button works
- ✅ All links are clickable

---

## 🎨 Email Template Preview

The welcome email includes:

```
┌─────────────────────────────────────┐
│   🍯 Seujia Honey                   │  ← Honey gradient header
│   (Beautiful gradient background)   │
├─────────────────────────────────────┤
│                                     │
│   Welcome, [Customer Name]! 🎉      │
│                                     │
│   Thank you for joining...          │
│                                     │
│   ┌─────────────────────────────┐   │
│   │ What You Can Expect:        │   │
│   │ • 100% Pure & Natural       │   │
│   │ • Exclusive Offers          │   │
│   │ • Fast Delivery             │   │
│   └─────────────────────────────┘   │
│                                     │
│   [ 🛍️ Start Shopping ]             │  ← Call-to-action button
│                                     │
├─────────────────────────────────────┤
│   Contact Info | Social Media       │  ← Footer
│   © 2025 Seujia Honey              │
└─────────────────────────────────────┘
```

---

## 🔧 Customization Options

### Change Email Content

Edit the template file: `lib/email/templates/welcome.ts`

**Customize:**
- Welcome message text
- Benefits list
- Colors and styling
- Button text and links
- Footer information
- Contact details

### Change Email Subject

Edit: `lib/email/send.ts` (line with `subject:`)

Example:
\`\`\`typescript
subject: \`🎉 Welcome to Seujia! Special 10% off for you, \${name}\`
\`\`\`

### Add More Email Types

Create new template files:
- `lib/email/templates/order-confirmation.ts`
- `lib/email/templates/shipping-notification.ts`
- `lib/email/templates/password-reset.ts`

Then add functions in `lib/email/send.ts`:
\`\`\`typescript
export async function sendOrderConfirmation(email: string, orderNumber: string) {
  // Implementation
}
\`\`\`

---

## 📊 Monitor Email Activity

### In Resend Dashboard:

1. Go to **"Emails"** in sidebar
2. See all sent emails
3. Check status: Delivered, Opened, Clicked
4. View email content
5. See delivery time

### Email Statuses:
- ✅ **Delivered** - Successfully sent
- ⏳ **Queued** - Waiting to send
- ❌ **Failed** - Check error message
- 📊 **Opened** - Recipient opened email
- 🖱️ **Clicked** - Recipient clicked links

---

## 🐛 Troubleshooting

### Problem: No email received

**Solutions:**
1. Check spam/junk folder
2. Verify `RESEND_API_KEY` in `.env.local` is correct
3. Check Resend Dashboard → Emails for error messages
4. Make sure dev server restarted after adding API key
5. Check browser console for errors

### Problem: "Missing API Key" error

**Solution:**
\`\`\`bash
# Make sure .env.local has:
RESEND_API_KEY=re_your_actual_key

# Restart server:
npm run dev
\`\`\`

### Problem: Email goes to spam

**Solutions:**
1. Verify your domain in Resend (Step 4)
2. Add SPF, DKIM, DMARC records
3. Avoid spam trigger words
4. Include unsubscribe link (for bulk emails)

### Problem: "Failed to send email" in console

**Check:**
1. API key is valid (not revoked)
2. Free tier limit not exceeded (100/day)
3. Resend service status: https://status.resend.com
4. Internet connection is stable

---

## 📈 Best Practices

### 1. **Email Deliverability**
- Verify your domain for better inbox placement
- Use consistent "From" name and email
- Include plain text version (already implemented)
- Add unsubscribe link for marketing emails

### 2. **Email Content**
- Keep subject line under 50 characters
- Personalize with customer's name
- Include clear call-to-action
- Make it mobile-responsive (already done)
- Test on different email clients

### 3. **Privacy & Compliance**
- Include your physical business address
- Add unsubscribe option for newsletters
- Follow GDPR/CAN-SPAM regulations
- Don't buy email lists

### 4. **Testing**
- Always test with real email before launch
- Check on mobile and desktop
- Test in Gmail, Outlook, Apple Mail
- Verify all links work

---

## 🎯 What Happens When User Signs Up

Here's the complete flow:

1. **User fills signup form** → Enters name, email, password
2. **Backend validates data** → Checks email not already used
3. **User created in database** → Stored in Supabase users table
4. **Welcome email triggered** → `sendWelcomeEmail()` called
5. **Email sent via Resend** → API request to Resend
6. **User receives email** → Within 1-2 minutes
7. **User redirected to home** → Can start shopping!

**Email sending is non-blocking:**
- Signup completes even if email fails
- User doesn't wait for email to send
- Errors logged but don't affect signup

---

## 💡 Advanced Features (Optional)

### Track Email Opens

Add tracking pixel to template:
\`\`\`typescript
<img src="https://yourdomain.com/track?email=${email}" width="1" height="1" />
\`\`\`

### Schedule Emails

Install delay package:
\`\`\`bash
npm install delay
\`\`\`

Send followup email after 3 days:
\`\`\`typescript
import delay from 'delay';

await delay(3 * 24 * 60 * 60 * 1000); // 3 days
await sendFollowupEmail(email, name);
\`\`\`

### A/B Testing

Create multiple templates:
\`\`\`typescript
const template = Math.random() > 0.5 ? 'version-a' : 'version-b';
\`\`\`

Track which version converts better.

---

## 📞 Need Help?

### Resources:
- **Resend Documentation:** https://resend.com/docs
- **Resend Status:** https://status.resend.com
- **Support:** support@resend.com
- **Community:** https://resend.com/discord

### Common Issues:
- API key format: Must start with `re_`
- Rate limits: 100 emails/day on free tier
- Domain verification takes 24-48 hours
- Emails may take 1-2 minutes to arrive

---

## ✅ Checklist

Before going live:

- [ ] Resend account created
- [ ] API key added to `.env.local`
- [ ] Domain verified (for production)
- [ ] Test email sent successfully
- [ ] Email received in inbox (not spam)
- [ ] All links in email work
- [ ] Email looks good on mobile
- [ ] Contact information updated
- [ ] Social media links updated
- [ ] Privacy policy link added

---

## 🎉 Success!

Your email automation is now set up! Every new customer who signs up will automatically receive a beautiful welcome email from Seujia Honey.

### What Customers See:
1. Sign up on your website
2. See "Account created successfully" message
3. Receive welcome email within 1-2 minutes
4. Feel valued and welcomed to your brand
5. Click "Start Shopping" to browse products

### What You Get:
- 📧 Automated customer engagement
- 🎨 Professional branded emails
- 📊 Email analytics in Resend Dashboard
- 💰 Better customer retention
- ⚡ Fast, reliable delivery

**Your email automation is ready to welcome customers! 🍯**

---

## 📝 Files Reference

### Created Files:
1. `lib/email/templates/welcome.ts` - HTML email template
2. `lib/email/send.ts` - Email sending utility
3. `app/api/auth/signup/route.ts` - Updated with email trigger

### Environment Variables:
\`\`\`
RESEND_API_KEY=re_your_key_here
EMAIL_FROM=Seujia Honey <hello@seujia.com>
NEXT_PUBLIC_APP_URL=https://seujia.com
\`\`\`

### Package Installed:
- `resend` - Official Resend SDK for Node.js

---

**Happy emailing! 📬🍯**
