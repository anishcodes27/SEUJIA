# Image Guide for Seujia Honey

This guide explains how to add your custom images (logo, hero background, etc.) to the website.

## Required Images

### 1. Logo (Navbar)
- **File**: `/public/logo.png`
- **Recommended size**: 200x200px (square)
- **Format**: PNG with transparent background
- **Usage**: Displayed in the navbar

**To add your logo:**
1. Create a `public` folder in the root directory if it doesn't exist
2. Add your logo file as `public/logo.png`
3. In `components/Navbar.tsx`, uncomment line 20-21:
```tsx
<Image src="/logo.png" alt="Seujia Honey" fill className="object-contain" />
```
4. Comment out or remove the placeholder emoji (lines 16-18)

### 2. Hero Background Image
- **File**: `/public/hero-bg.jpg`
- **Recommended size**: 1920x1080px (Full HD) or larger
- **Format**: JPG or WebP
- **Usage**: Full-screen background on home page

**To add your hero background:**
1. Add your background image as `public/hero-bg.jpg`
2. In `app/page.tsx`, uncomment lines 42-47:
```tsx
<Image 
  src="/hero-bg.jpg" 
  alt="Honey Background" 
  fill 
  className="object-cover" 
  priority
/>
```
3. Optionally remove or adjust the gradient overlay (lines 38-40)

### 3. Product Images
Product images are stored in **Supabase Storage**, not in the public folder.

**To add product images:**
1. Go to your Supabase dashboard
2. Navigate to Storage > product-images
3. Upload your product images
4. When creating products in the admin panel, use the image upload feature
5. Or manually set the `image_url` to the Supabase Storage URL

## Directory Structure

```
seujia_web/
├── public/               # Create this folder
│   ├── logo.png         # Your company logo
│   ├── hero-bg.jpg      # Hero section background
│   ├── favicon.ico      # Website favicon (16x16 or 32x32)
│   └── og-image.jpg     # Open Graph image for social sharing (1200x630)
```

## Image Optimization Tips

1. **Logo**: Use PNG with transparency, keep file size under 50KB
2. **Hero Background**: Compress to around 200-500KB using tools like TinyPNG
3. **Favicon**: Create using favicon.io or similar tools
4. **Product Images**: Upload high-quality images to Supabase, Next.js will optimize them automatically

## Next.js Image Component Benefits

The site uses Next.js `<Image>` component which provides:
- Automatic image optimization
- Lazy loading
- Responsive images
- WebP conversion
- Blur placeholder support

## Adding Favicon

1. Create or generate a favicon.ico file
2. Place it in `/public/favicon.ico`
3. Add this to `app/layout.tsx` in the metadata:
```tsx
export const metadata = {
  title: 'Seujia Honey',
  icons: {
    icon: '/favicon.ico',
  },
}
```

## Adding Open Graph Images (Social Sharing)

Create an OG image at `/public/og-image.jpg` (1200x630px) and add to metadata:
```tsx
export const metadata = {
  openGraph: {
    images: ['/og-image.jpg'],
  },
}
```

## Troubleshooting

**Image not showing?**
- Check the file path is correct
- Ensure the file is in the `public` folder
- Check browser console for errors
- Clear Next.js cache: `rm -rf .next` and restart dev server

**Image too large/slow to load?**
- Compress images before uploading
- Use appropriate image formats (WebP for photos, PNG for logos)
- Consider using Supabase Storage for large images
