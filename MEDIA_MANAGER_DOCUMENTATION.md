# Media Manager Documentation

## Overview

The Media Manager is a centralized system for managing all uploaded images in your application. It allows you to:
- Upload images once and reuse them across multiple products, sliders, combos, etc.
- Browse and search through all uploaded images
- Filter images by folder/category
- Delete unused images
- Copy image URLs to clipboard
- Select images from the library instead of re-uploading

## Features

### 1. **Centralized Media Library**
- All uploaded images are stored in MongoDB with metadata
- Images are organized by folders (products, sliders, combos, categories, general)
- Full-text search by filename or folder
- Grid view with image previews

### 2. **Reusable Images**
- Upload an image once, use it in multiple places
- No need to upload the same image multiple times
- Reduces Cloudinary storage usage

### 3. **Media Picker Modal**
- Easy-to-use modal for selecting images
- Can be integrated into any form
- Supports both single and multiple image selection

## Usage

### Accessing the Media Library

Navigate to **Admin Dashboard → Media Library** to view and manage all uploaded images.

### Using MediaPicker in Forms

#### Example 1: Single Image Selection

```javascript
import { useState } from "react"
import MediaPicker from "@/components/Dashboard/MediaManager/MediaPicker"

function MyForm() {
    const [imageUrl, setImageUrl] = useState("")
    const [showPicker, setShowPicker] = useState(false)

    return (
        <>
            <button onClick={() => setShowPicker(true)}>
                Choose Image
            </button>

            <MediaPicker
                isOpen={showPicker}
                onClose={() => setShowPicker(false)}
                onSelect={(url) => setImageUrl(url)}
                folder="products"
                multiple={false}
            />
        </>
    )
}
```

#### Example 2: Multiple Image Selection

```javascript
import { useState } from "react"
import MediaPicker from "@/components/Dashboard/MediaManager/MediaPicker"

function MyForm() {
    const [imageUrls, setImageUrls] = useState([])
    const [showPicker, setShowPicker] = useState(false)

    return (
        <>
            <button onClick={() => setShowPicker(true)}>
                Choose Images
            </button>

            <MediaPicker
                isOpen={showPicker}
                onClose={() => setShowPicker(false)}
                onSelect={(urls) => setImageUrls(urls)}
                folder="products"
                multiple={true}
            />
        </>
    )
}
```

#### Example 3: Using ImageUploadWithMediaPicker Component

This is the easiest way to integrate media library into your forms:

```javascript
import ImageUploadWithMediaPicker from "@/components/Dashboard/MediaManager/ImageUploadWithMediaPicker"

function ProductForm() {
    const [featuredImage, setFeaturedImage] = useState(null)

    return (
        <ImageUploadWithMediaPicker
            value={featuredImage}
            onChange={(file) => setFeaturedImage(file)}
            folder="products"
            label="Featured Image"
            required={true}
        />
    )
}
```

## API Endpoints

### GET `/api/media`
Fetch all media items or filter by folder.

**Query Parameters:**
- `folder` (optional): Filter by folder name

**Response:**
```json
[
    {
        "_id": "...",
        "url": "https://res.cloudinary.com/...",
        "publicId": "products/abc123",
        "folder": "products",
        "fileName": "product-image.jpg",
        "fileSize": 245678,
        "format": "jpg",
        "width": 1200,
        "height": 800,
        "createdAt": "2026-02-04T10:00:00.000Z"
    }
]
```

### POST `/api/media`
Upload a new image to the media library.

**Body (FormData):**
- `file`: Image file
- `folder`: Folder name (products, sliders, combos, categories, general)

**Response:**
```json
{
    "_id": "...",
    "url": "https://res.cloudinary.com/...",
    "publicId": "products/abc123",
    "folder": "products",
    "fileName": "product-image.jpg",
    "fileSize": 245678,
    "format": "jpg",
    "width": 1200,
    "height": 800,
    "createdAt": "2026-02-04T10:00:00.000Z"
}
```

### DELETE `/api/media?id={mediaId}`
Delete an image from both Cloudinary and the database.

**Query Parameters:**
- `id`: Media document ID

**Response:**
```json
{
    "success": true
}
```

## Folder Structure

Images are organized into the following folders:

- **products**: Product images (featured and gallery)
- **sliders**: Banner/slider images
- **combos**: Combo product images
- **categories**: Category images
- **general**: Miscellaneous images

## Database Schema

```javascript
{
    url: String,           // Cloudinary URL
    publicId: String,      // Cloudinary public ID (for deletion)
    folder: String,        // Folder/category
    fileName: String,      // Original filename
    fileSize: Number,      // File size in bytes
    format: String,        // Image format (jpg, png, webp)
    width: Number,         // Image width in pixels
    height: Number,        // Image height in pixels
    createdAt: Date        // Upload timestamp
}
```

## Integration Examples

### Updating SliderForm to use Media Library

The SliderForm component already uses the media library. When you click "Upload Banner", it:
1. Uploads the image to Cloudinary
2. Saves metadata to the media collection
3. Returns the URL for use in the slider

### Updating Product Creation Form

You can replace the traditional file input with `ImageUploadWithMediaPicker`:

**Before:**
```javascript
<input type="file" onChange={handleFileUpload} />
```

**After:**
```javascript
<ImageUploadWithMediaPicker
    value={formData.featuredImage}
    onChange={(file) => setFormData(prev => ({ ...prev, featuredImage: file }))}
    folder="products"
    label="Featured Image"
    required={true}
/>
```

## Benefits

1. **Reduced Storage Costs**: Upload images once, reuse everywhere
2. **Faster Workflow**: No need to re-upload the same image
3. **Better Organization**: All images in one searchable library
4. **Easy Management**: Delete unused images from one place
5. **Improved Performance**: Reuse optimized images across the site

## Future Enhancements

- Bulk upload support
- Image editing (crop, resize, filters)
- Advanced search and filtering
- Image tags and labels
- Usage tracking (see where each image is used)
- Automatic duplicate detection
