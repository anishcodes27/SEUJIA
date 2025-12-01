# 🎥 Authenticity Section - Video Setup Guide

## What Was Added

A new **Authenticity Section** that showcases your farm and harvesting videos to build trust with customers. This section appears on every page, right before the feedback section.

---

## 🎨 Features

### Visual Elements:
- ✅ **3 Video Slots** - Showcase different aspects of your process
- ✅ **Responsive Grid** - Looks great on all devices
- ✅ **Hover Effects** - Interactive video cards
- ✅ **Trust Badges** - Highlights your transparency and quality
- ✅ **Call-to-Action** - Contact buttons for inquiries
- ✅ **Honey Theme** - Consistent with your brand colors

### Default Videos:
1. **Honey Harvesting Process** - Show the harvesting
2. **Our Bee Farm** - Tour of your facilities
3. **Quality Testing** - Quality control process

---

## 📹 How to Add Your Videos

### Option 1: YouTube Videos (Recommended)

**Step 1:** Upload your videos to YouTube
- Go to https://youtube.com
- Click "Create" → "Upload video"
- Upload your farm/harvesting videos
- Make them Public or Unlisted

**Step 2:** Get the embed URL
For a YouTube video like: `https://www.youtube.com/watch?v=ABC123`

The embed URL is: `https://www.youtube.com/embed/ABC123`

**Step 3:** Update the component
Edit `components/AuthenticitySection.tsx`:

```typescript
const videos = [
  {
    id: 1,
    title: 'Honey Harvesting Process',
    thumbnail: '/honey-harvest-thumb.jpg', // Optional
    videoUrl: 'https://www.youtube.com/embed/YOUR_VIDEO_ID_1',
    description: 'Watch how we carefully harvest pure honey from our hives'
  },
  {
    id: 2,
    title: 'Our Bee Farm',
    thumbnail: '/bee-farm-thumb.jpg', // Optional
    videoUrl: 'https://www.youtube.com/embed/YOUR_VIDEO_ID_2',
    description: 'A tour of our sustainable bee farming facilities'
  },
  {
    id: 3,
    title: 'Quality Testing',
    thumbnail: '/quality-test-thumb.jpg', // Optional
    videoUrl: 'https://www.youtube.com/embed/YOUR_VIDEO_ID_3',
    description: 'See our rigorous quality control and testing process'
  },
];
```

**Replace:**
- `YOUR_VIDEO_ID_1` with your actual YouTube video ID
- `YOUR_VIDEO_ID_2` with second video ID
- `YOUR_VIDEO_ID_3` with third video ID

---

### Option 2: Direct Video Files

If you have video files (MP4, WebM), you can host them:

**Step 1:** Add videos to your project
- Place video files in `public/videos/` folder
- Example: `public/videos/harvest.mp4`

**Step 2:** Update the component to use HTML5 video:

```typescript
// In components/AuthenticitySection.tsx
// Replace the iframe with:

<video
  controls
  className="absolute inset-0 w-full h-full object-cover"
  poster={video.thumbnail}
>
  <source src={video.videoUrl} type="video/mp4" />
  Your browser does not support the video tag.
</video>
```

Then set:
```typescript
videoUrl: '/videos/harvest.mp4'
```

---

### Option 3: Other Video Platforms

**Vimeo:**
```
https://player.vimeo.com/video/YOUR_VIDEO_ID
```

**Google Drive:**
1. Upload video to Google Drive
2. Right-click → Get link → Make it public
3. Use embed code from "Embed item"

---

## 🎬 Video Recording Tips

### What to Record:

1. **Harvesting Process:**
   - Show beekeepers in action
   - Close-up of honeycomb
   - Extraction process
   - Filtering and bottling

2. **Farm Tour:**
   - Overview of bee farm location
   - Beehives arrangement
   - Natural surroundings
   - Farm facilities

3. **Quality Check:**
   - Testing process
   - Lab equipment (if any)
   - Purity tests
   - Packaging process

### Video Best Practices:
- ✅ **Duration:** 30-90 seconds per video
- ✅ **Quality:** HD (1080p) or higher
- ✅ **Lighting:** Natural daylight works best
- ✅ **Audio:** Clear narration or background music
- ✅ **Authenticity:** Real footage, no stock videos
- ✅ **Branding:** Include your logo/watermark

---

## 🎨 Customization Options

### Change Number of Videos

**Show 2 videos:**
```typescript
const videos = [
  // Video 1
  { ... },
  // Video 2
  { ... },
];
```

Update grid:
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
```

**Show 4 videos:**
```typescript
const videos = [
  // Video 1, 2, 3, 4
];
```

Update grid:
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
```

### Change Section Title

```tsx
<h2 className="text-4xl md:text-5xl font-bold text-honey-800 mb-4">
  Your Custom Title Here
</h2>
```

### Change Trust Badges

```tsx
<div className="space-y-3">
  <div className="text-5xl mb-2">🎖️</div>
  <h3 className="text-2xl font-bold">Your Badge Title</h3>
  <p className="text-honey-100">
    Your badge description
  </p>
</div>
```

### Change Contact Info

```tsx
<a href="mailto:your-email@example.com">
<a href="tel:+91XXXXXXXXXX">
```

---

## 📱 How It Looks

### Desktop:
```
┌────────────────────────────────────────────────────┐
│         🎥 🍯 🐝                                    │
│    See Our Authentic Process                       │
│    [Description]                                   │
├──────────────┬──────────────┬──────────────────────┤
│  Video 1     │  Video 2     │  Video 3             │
│  [iframe]    │  [iframe]    │  [iframe]            │
│  Title       │  Title       │  Title               │
│  Description │  Description │  Description         │
├──────────────┴──────────────┴──────────────────────┤
│  ┌─────────────────────────────────────────────┐   │
│  │ ✓ Transparent  🌿 Natural  🔬 Lab Tested   │   │
│  └─────────────────────────────────────────────┘   │
│         [Contact Us]  [Call Us]                    │
└────────────────────────────────────────────────────┘
```

### Mobile:
```
┌──────────────┐
│  Video 1     │
│  [iframe]    │
│  Title       │
├──────────────┤
│  Video 2     │
│  [iframe]    │
│  Title       │
├──────────────┤
│  Video 3     │
│  [iframe]    │
│  Title       │
└──────────────┘
```

---

## 🚀 Quick Start Checklist

- [ ] Upload videos to YouTube
- [ ] Get embed URLs for each video
- [ ] Update `videoUrl` in `AuthenticitySection.tsx`
- [ ] Update video titles
- [ ] Update video descriptions
- [ ] Change contact email/phone
- [ ] Test on desktop
- [ ] Test on mobile
- [ ] Check all videos play correctly

---

## 🎯 Where It Appears

The Authenticity Section appears on **EVERY PAGE**:
- ✅ Home page
- ✅ Shop page
- ✅ Product pages
- ✅ Cart page
- ✅ All other pages

**Location:** Between main content and feedback section

---

## 🔧 Troubleshooting

### Videos not showing?

**Check:**
1. YouTube video is Public or Unlisted (not Private)
2. Embed URL format is correct
3. No typos in video ID
4. YouTube embed is allowed

**Solution:**
- Test embed URL directly in browser
- Check YouTube video settings
- Try different video

### Videos too slow to load?

**Solutions:**
1. Use YouTube (fastest)
2. Compress video files
3. Use CDN for video hosting
4. Add lazy loading

### Want to hide on specific pages?

Edit the component to check page:
```tsx
'use client';
import { usePathname } from 'next/navigation';

export default function AuthenticitySection() {
  const pathname = usePathname();
  
  // Don't show on checkout page
  if (pathname === '/checkout') {
    return null;
  }
  
  // ... rest of component
}
```

---

## 💡 Pro Tips

1. **Keep Videos Short:** 30-60 seconds is ideal
2. **Add Subtitles:** Helps viewers understand without sound
3. **Update Regularly:** Add new seasonal videos
4. **Show Real People:** Builds trust and authenticity
5. **Good Lighting:** Natural light works best
6. **Stable Camera:** Use tripod or stabilization
7. **Tell a Story:** Make it engaging, not just footage

---

## 📊 Benefits

### For Customers:
✅ See the actual process
✅ Build trust in product quality
✅ Understand your values
✅ Connect with your brand
✅ Make informed purchases

### For Business:
✅ Differentiate from competitors
✅ Reduce customer doubts
✅ Increase conversion rates
✅ Build brand loyalty
✅ Educational marketing
✅ Shareable content

---

## 🎉 Example Video Ideas

1. **Morning at the Farm** - Sunrise, bees starting their day
2. **Flower Fields** - Where bees collect nectar
3. **Meet the Beekeeper** - Personal introduction
4. **Honey Collection** - Step-by-step process
5. **Lab Testing** - Quality assurance
6. **Packaging** - How we pack your honey
7. **Customer Testimonials** - Happy customers
8. **Behind the Scenes** - Day in the life
9. **Sustainability Practices** - Eco-friendly methods
10. **Seasonal Variations** - Different honey types

---

**Your authenticity section is ready! Just add your video URLs and show customers the real Seujia Honey process!** 🎥🍯✨
