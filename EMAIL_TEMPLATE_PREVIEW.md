# Welcome Email Template Preview

This is how the welcome email will look when sent to customers.

---

## Email Subject
```
Welcome to Seujia Honey, [Customer Name]! 🍯
```

---

## Email Body (Visual Representation)

```
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║            🍯 SEUJIA HONEY 🍯                            ║
║     [Honey gradient background - Orange/Amber]           ║
║                                                          ║
╠══════════════════════════════════════════════════════════╣
║                                                          ║
║     Welcome, [Customer Name]! 🎉                         ║
║                                                          ║
║     Thank you for joining the Seujia Honey family!      ║
║     We're thrilled to have you with us.                 ║
║                                                          ║
║     At Seujia, we're passionate about bringing you      ║
║     the finest, purest honey straight from nature.      ║
║     Every jar is a testament to our commitment to       ║
║     quality and sustainability.                         ║
║                                                          ║
║   ┌────────────────────────────────────────────────┐    ║
║   │  WHAT YOU CAN EXPECT:                          │    ║
║   │                                                │    ║
║   │  🌸 100% Pure & Natural honey from            │    ║
║   │     sustainable apiaries                       │    ║
║   │                                                │    ║
║   │  🎯 Exclusive Offers and early access to      │    ║
║   │     new products                               │    ║
║   │                                                │    ║
║   │  📦 Fast Delivery right to your doorstep      │    ║
║   │                                                │    ║
║   │  🎁 Special Discounts for loyal customers     │    ║
║   │                                                │    ║
║   │  💚 Health Benefits with every spoonful       │    ║
║   └────────────────────────────────────────────────┘    ║
║                                                          ║
║              ┌──────────────────────┐                   ║
║              │  🛍️ START SHOPPING   │                   ║
║              │   [Clickable Button]  │                   ║
║              └──────────────────────┘                   ║
║           [Links to your shop page]                     ║
║                                                          ║
║     If you have any questions or need assistance,       ║
║     feel free to reach out to us anytime. We're        ║
║     here to help!                                       ║
║                                                          ║
╠══════════════════════════════════════════════════════════╣
║                                                          ║
║                   STAY CONNECTED                         ║
║                                                          ║
║     📧 Email: hello@seujia.com                          ║
║     📱 Phone: +91 1234567890                            ║
║                                                          ║
║         📷 Instagram    📘 Facebook    🐦 Twitter        ║
║                                                          ║
║           © 2025 Seujia Honey. All rights reserved.     ║
║                Pure. Natural. Sustainable.               ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
```

---

## Color Scheme

- **Header Background**: Orange gradient (#D97706 to #F59E0B)
- **Main Text**: Dark brown (#78350F)
- **Headings**: Deep brown (#92400E)
- **Highlight Box**: Light amber background (#FEF3C7)
- **Button**: Orange gradient with white text
- **Footer**: Light amber background (#FEF3C7)

---

## Responsive Design

The email automatically adjusts for:
- 📱 **Mobile devices** (stacks content vertically)
- 💻 **Desktop** (600px width, centered)
- 📧 **All email clients** (Gmail, Outlook, Apple Mail, etc.)

---

## Interactive Elements

1. **Start Shopping Button**
   - Links to: `/shop` page
   - Hover effect
   - Prominent placement

2. **Social Media Icons**
   - Instagram, Facebook, Twitter links
   - Update URLs in template

3. **Email/Phone Links**
   - Clickable email (opens mail client)
   - Clickable phone (opens dialer on mobile)

---

## Personalization

Variables automatically filled:
- `${name}` - Customer's first name
- `${email}` - Customer's email address
- Current year for copyright

---

## Plain Text Version

Also included for email clients that don't support HTML:

```
Welcome to Seujia Honey, [Customer Name]!

Thank you for joining the Seujia Honey family! 
We're thrilled to have you with us.

At Seujia, we're passionate about bringing you the 
finest, purest honey straight from nature.

WHAT YOU CAN EXPECT:
• 100% Pure & Natural honey from sustainable apiaries
• Exclusive Offers and early access to new products
• Fast Delivery right to your doorstep
• Special Discounts for loyal customers
• Health Benefits with every spoonful

Start shopping now: [Your Website URL]/shop

Stay Connected:
Email: hello@seujia.com
Phone: +91 1234567890

© 2025 Seujia Honey. All rights reserved.
Pure. Natural. Sustainable.
```

---

## Testing Checklist

Before sending to customers:

- [ ] Test with your own email
- [ ] Check on mobile device
- [ ] Check on desktop
- [ ] Verify all links work
- [ ] Check in Gmail
- [ ] Check in Outlook
- [ ] Check in Apple Mail
- [ ] Verify images load
- [ ] Check spam score
- [ ] Update contact info
- [ ] Update social media links

---

## Customization Tips

### Change Welcome Message
Edit `lib/email/templates/welcome.ts` - line 35-40

### Change Button Text
Edit `lib/email/templates/welcome.ts` - line 71

### Change Button Link
Edit `lib/email/templates/welcome.ts` - line 69

### Add Your Logo
Replace emoji "🍯" with:
```html
<img src="https://yoursite.com/logo.png" 
     alt="Seujia Honey" 
     width="80" height="80" />
```

### Change Colors
Find and replace hex codes:
- `#D97706` - Primary orange
- `#F59E0B` - Secondary orange
- `#92400E` - Dark brown
- `#78350F` - Medium brown
- `#FEF3C7` - Light amber

---

## Email Performance Tips

### Improve Open Rates:
- Keep subject line under 50 characters ✅
- Personalize with customer name ✅
- Send within 5 minutes of signup ✅
- Use emojis strategically ✅

### Improve Click Rates:
- Single clear call-to-action ✅
- Prominent button placement ✅
- Above the fold positioning ✅
- Contrasting button color ✅

### Avoid Spam:
- Include physical address (add yours!)
- Don't use all caps in subject
- Balance text and images
- Include plain text version ✅

---

## Analytics to Track

In Resend Dashboard, monitor:

1. **Delivery Rate** (target: >95%)
2. **Open Rate** (target: >20%)
3. **Click Rate** (target: >3%)
4. **Bounce Rate** (target: <5%)
5. **Time to Open** (most within 1 hour)

---

## Example Test

When user "John Doe" signs up with john@example.com:

**Subject:** `Welcome to Seujia Honey, John Doe! 🍯`

**Email starts with:** `Welcome, John Doe! 🎉`

**Sent from:** `Seujia Honey <onboarding@resend.dev>`
(or your custom domain after verification)

**Delivered in:** 1-2 minutes

**Opens in:** Gmail, Outlook, Apple Mail, etc.

---

**Ready to send? Just sign up a test user and check your email!** 📧🍯
