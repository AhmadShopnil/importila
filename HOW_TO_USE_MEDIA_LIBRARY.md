# Media Manager - How to Use

## ✅ UPDATED: Product Edit Page Now Has Media Library Integration!

Both the **Product Creation** page and **Product Edit** page now have the "Choose from Library" option.

## Where to Find the Buttons

### When NO Image is Selected:

You'll see TWO buttons side by side:

```
┌─────────────────────────────────────┐
│         Upload Featured Image       │
│                                     │
│  [Upload New] [Choose from Library] │
│                                     │
│     PNG, JPG or WebP (max. 5MB)    │
└─────────────────────────────────────┘
```

- **Upload New** (Blue button) - Opens your computer's file browser
- **Choose from Library** (White button with blue border) - Opens the Media Library modal

### When an Image IS Already Selected:

Hover over the image to see THREE buttons:

```
┌─────────────────────────────────────┐
│                                     │
│         [Image Preview]             │
│                                     │
│   (Hover to see buttons)            │
│                                     │
│   [Choose from Library]             │
│   [Upload New]                      │
│   [Remove]                          │
│                                     │
└─────────────────────────────────────┘
```

## Step-by-Step Instructions

### Option 1: Choose from Existing Images

1. Go to **Admin → Products → Add New Product** (or edit existing)
2. Scroll to "Featured Image" or "Extra Images" section
3. Click the **"Choose from Library"** button (white button with blue border)
4. A modal will open showing all your uploaded images
5. Click on any image to select it
6. The image will be set without uploading to Cloudinary again!

### Option 2: Upload New Image

1. Click the **"Upload New"** button (blue button)
2. Select an image from your computer
3. The image will upload to Cloudinary AND save to the media library
4. You can now reuse this image in other products!

## Troubleshooting

### "I only see one button that opens my computer folder"

**Cause**: You might be on an old cached version of the page.

**Solution**:
1. Hard refresh the page: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
2. Or clear your browser cache
3. The page should now show BOTH buttons

### "The buttons are not visible"

**Cause**: The page might not have loaded the latest code.

**Solution**:
1. Make sure your dev server is running (`npm run dev`)
2. Check the browser console for any errors
3. Try refreshing the page

## Visual Guide

### Before (Old Version):
```
❌ Only one upload area - clicking anywhere opens file browser
```

### After (New Version):
```
✅ Two clear buttons:
   - "Upload New" - For new images
   - "Choose from Library" - For existing images
```

## Pages Updated

✅ **Product Creation Page** (`/admin/products/new`)
✅ **Product Edit Page** (`/admin/products/[id]`)  ← **JUST UPDATED!**
✅ **Slider Management** (`/admin/sliders`)

## Next: Try It Out!

1. Go to `/admin/products` and click "Edit" on any product
2. You should now see the "Choose from Library" button
3. Click it to open the Media Library
4. Select an existing image - no upload needed!

---

**Note**: If you still don't see the buttons after refreshing, let me know and I'll help debug!
