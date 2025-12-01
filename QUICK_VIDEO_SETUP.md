# 🎥 Quick Video Setup - Google Drive Method

## Simple 3-Step Process

### Step 1: Upload Videos to Google Drive

1. Go to https://drive.google.com
2. Click **"New"** → **"File upload"**
3. Select your 3 videos from your device:
   - Harvesting video
   - Farm tour video
   - Quality testing video
4. Wait for upload to complete

---

### Step 2: Make Videos Public & Get Links

For **EACH video**, do this:

1. **Right-click on the video** in Google Drive
2. Click **"Share"**
3. Click **"Change to anyone with the link"**
4. Click **"Copy link"**

You'll get a link like:
```
https://drive.google.com/file/d/1aB2cD3eF4gH5iJ6kL7mN8oP9qR0sT1uV/view?usp=sharing
```

5. **Extract the FILE_ID** (the part between `/d/` and `/view`)

In the example above, FILE_ID is: `1aB2cD3eF4gH5iJ6kL7mN8oP9qR0sT1uV`

---

### Step 3: Update Your Website

1. Open file: `components/AuthenticitySection.tsx`

2. Find this section (around line 9):
```typescript
const videos = [
  {
    id: 1,
    title: 'Honey Harvesting Process',
    videoUrl: 'https://drive.google.com/file/d/YOUR_FILE_ID_1/preview',
    description: 'Watch how we carefully harvest pure honey from our hives'
  },
```

3. **Replace `YOUR_FILE_ID_1`** with your actual FILE_ID

Example:
```typescript
videoUrl: 'https://drive.google.com/file/d/1aB2cD3eF4gH5iJ6kL7mN8oP9qR0sT1uV/preview',
```

4. Do the same for all 3 videos

5. Save the file

---

## 📋 Complete Example

Let's say your 3 Google Drive links are:

**Video 1:**
```
https://drive.google.com/file/d/1ABC123xyz456/view?usp=sharing
```
FILE_ID: `1ABC123xyz456`

**Video 2:**
```
https://drive.google.com/file/d/2DEF789abc123/view?usp=sharing
```
FILE_ID: `2DEF789abc123`

**Video 3:**
```
https://drive.google.com/file/d/3GHI456def789/view?usp=sharing
```
FILE_ID: `3GHI456def789`

**Your code should look like:**

```typescript
const videos = [
  {
    id: 1,
    title: 'Honey Harvesting Process',
    videoUrl: 'https://drive.google.com/file/d/1ABC123xyz456/preview',
    description: 'Watch how we carefully harvest pure honey from our hives'
  },
  {
    id: 2,
    title: 'Our Bee Farm',
    videoUrl: 'https://drive.google.com/file/d/2DEF789abc123/preview',
    description: 'A tour of our sustainable bee farming facilities'
  },
  {
    id: 3,
    title: 'Quality Testing',
    videoUrl: 'https://drive.google.com/file/d/3GHI456def789/preview',
    description: 'See our rigorous quality control and testing process'
  },
];
```

---

## ⚠️ Important Notes

### Google Drive Sharing Settings:
- ✅ Must be set to **"Anyone with the link"**
- ❌ NOT "Restricted" (won't work)
- ❌ NOT "Anyone with organization" (won't work for public)

### Link Format:
- ✅ Use `/preview` at the end (for embedding)
- ❌ Don't use `/view` (that's for direct viewing)

### Video Format:
- ✅ MP4 works best
- ✅ Keep under 100MB per video for fast loading
- ✅ HD quality (1080p) recommended

---

## 🎬 Video Tips

### Recording Your Videos:

**1. Use your phone camera:**
- Modern phones shoot great video
- Hold horizontally (landscape mode)
- Steady your hand or use a tripod

**2. Good lighting:**
- Natural daylight is best
- Avoid backlight (don't record facing the sun)
- Morning or late afternoon light is ideal

**3. Keep it short:**
- 30-60 seconds per video
- Focus on key moments
- No need for fancy editing

**4. What to show:**
- **Video 1:** Harvesting - Show honeycomb, extraction
- **Video 2:** Farm tour - Beehives, surroundings
- **Video 3:** Quality - Bottling, packaging process

---

## 🔧 Troubleshooting

### Video not showing?

**Check:**
1. ✅ Video is shared as "Anyone with the link"
2. ✅ Link format is correct (ends with `/preview`)
3. ✅ FILE_ID is copied correctly
4. ✅ No extra spaces in the code

**Test your link:**
- Paste the link in a new browser tab
- It should show the video player
- If it asks for permission, sharing is not set correctly

### Video too slow?

**Solutions:**
1. Compress video before uploading
2. Use online tools like:
   - https://www.freeconvert.com/video-compressor
   - https://www.videosmaller.com
3. Target size: 20-50MB per video

### Want to change video later?

1. Upload new video to Google Drive
2. Make it public
3. Get new FILE_ID
4. Replace old FILE_ID in the code
5. Save and refresh

---

## ✅ Quick Checklist

Before publishing:

- [ ] Upload 3 videos to Google Drive
- [ ] Make all videos "Anyone with the link"
- [ ] Copy all 3 links
- [ ] Extract all 3 FILE_IDs
- [ ] Update AuthenticitySection.tsx with FILE_IDs
- [ ] Save the file
- [ ] Refresh website to see videos
- [ ] Test that all videos play
- [ ] Check on mobile device

---

## 🎯 Summary

**What you need:**
1. 3 videos from your device
2. Google Drive account (free)
3. 5 minutes to upload and share

**What you change:**
- Only file: `components/AuthenticitySection.tsx`
- Only change: Replace `YOUR_FILE_ID_1`, `YOUR_FILE_ID_2`, `YOUR_FILE_ID_3`

**That's it! No YouTube account needed!** 🎉

---

## 💡 Pro Tip

Keep your original video files safe on your device. If you need to update or change videos later, you can easily upload new ones and replace the FILE_IDs.

---

**Need help? The videos section is already set up - just add your Google Drive links and you're done!** 🚀
