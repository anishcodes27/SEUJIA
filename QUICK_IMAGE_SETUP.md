# 🎨 Quick Start: Adding Your Images

Follow these simple steps to personalize your Seujia Honey website!

## Step 1: Prepare Your Images

### Logo
- **Size**: 200x200 pixels (square)
- **Format**: PNG with transparent background
- **Name**: `logo.png`

### Hero Background
- **Size**: 1920x1080 pixels or larger
- **Format**: JPG or WebP
- **Name**: `hero-bg.jpg`

## Step 2: Add Images to Project

```bash
# Your images go in the public folder:
seujia_web/
└── public/
    ├── logo.png          ← Your logo here
    └── hero-bg.jpg       ← Your background here
```

## Step 3: Enable Logo in Code

Open `components/Navbar.tsx` and find line 16-22:

**BEFORE** (with placeholder):
```tsx
<div className="w-full h-full bg-gradient-to-br from-honey-400 to-honey-600 rounded-full flex items-center justify-center">
  <span className="text-2xl">🍯</span>
</div>
{/* Uncomment and use this when you have your logo image */}
{/* <Image src="/logo.png" alt="Seujia Honey" fill className="object-contain" /> */}
```

**AFTER** (with your logo):
```tsx
<Image src="/logo.png" alt="Seujia Honey" fill className="object-contain" />
```

## Step 4: Enable Hero Background

Open `app/page.tsx` and find lines 38-48:

**BEFORE** (with gradient):
```tsx
<div className="absolute inset-0 bg-gradient-to-br from-honey-600 via-honey-500 to-amber-600">
  {/* Uncomment and use this when you have your hero image */}
  {/* <Image 
    src="/hero-bg.jpg" 
    alt="Honey Background" 
    fill 
    className="object-cover" 
    priority
  /> */}
</div>
```

**AFTER** (with your image):
```tsx
<div className="absolute inset-0 bg-gradient-to-br from-honey-600 via-honey-500 to-amber-600">
  <Image 
    src="/hero-bg.jpg" 
    alt="Honey Background" 
    fill 
    className="object-cover" 
    priority
  />
</div>
```

## Step 5: Restart Dev Server

```bash
# Stop the server (Ctrl+C) and restart:
npm run dev
```

## ✅ That's It!

Your website now has:
- ✨ Your custom logo in the navbar
- 🖼️ Your hero background image
- 🎨 All the beautiful UI improvements

## 🎨 Current UI Features

### Home Page
- **Full-screen hero** with your background image
- **Large "Shop All" button** on the right side
- **Animated scroll indicator** at the bottom
- **Feature badges** with hover effects
- **Enhanced product grid** with smooth transitions

### Navbar
- **Your logo** with hover animation
- **Gradient background** with depth
- **Cart badge** with item count
- **Responsive mobile menu**

### Overall Design
- 🍯 Honey-themed color palette
- ⚡ Smooth animations throughout
- 📱 Fully responsive on all devices
- 🚀 Fast and optimized

## 📖 Need More Help?

- **Full Image Guide**: See `IMAGE_GUIDE.md`
- **UI Details**: See `UI_IMPROVEMENTS.md`
- **Project Setup**: See `README.md`
- **Quick Setup**: See `QUICKSTART.md`

## 🎯 Pro Tips

1. **Compress images** before adding (use TinyPNG.com)
2. **Logo works best** with transparent background
3. **Hero image** should be high quality but under 500KB
4. **Test on mobile** after adding images
5. **Clear browser cache** if changes don't appear

---

**Questions?** Check the documentation files or open an issue!
