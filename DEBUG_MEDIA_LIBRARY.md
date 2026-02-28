# Quick Debug Script for Media Library

## Test the API Directly

Open your browser console (F12) and run this code:

```javascript
// Test 1: Check if you can fetch media
fetch('http://localhost:3000/api/media', {
  credentials: 'include'
})
.then(res => res.json())
.then(data => console.log('Media API Response:', data))
.catch(err => console.error('Media API Error:', err))

// Test 2: Try uploading an image
const testUpload = async () => {
  // First, select a file using a file input
  const fileInput = document.createElement('input')
  fileInput.type = 'file'
  fileInput.accept = 'image/*'
  
  fileInput.onchange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    
    const fd = new FormData()
    fd.append('file', file)
    fd.append('folder', 'products')
    
    try {
      const res = await fetch('http://localhost:3000/api/media', {
        method: 'POST',
        body: fd,
        credentials: 'include'
      })
      const data = await res.json()
      console.log('Upload Response:', data)
    } catch (err) {
      console.error('Upload Error:', err)
    }
  }
  
  fileInput.click()
}

// Run this to test upload
// testUpload()
```

## Manual Testing Steps:

### Step 1: Check if API is accessible
1. Open browser DevTools (F12)
2. Go to Console tab
3. Paste this:
```javascript
fetch('http://localhost:3000/api/media', { credentials: 'include' })
  .then(r => r.json())
  .then(d => console.log('Response:', d))
```
4. Press Enter
5. Check the response

**Expected Results:**
- ✅ Should return an array (even if empty): `[]`
- ❌ If returns `{error: "Unauthorized"}` → Authentication issue
- ❌ If returns error → API issue

### Step 2: Check MongoDB Connection
The API needs to connect to MongoDB. Check your `.env` file has:
```
MONGODB_URI=your_mongodb_connection_string
```

### Step 3: Check Admin Authentication
The media API requires admin authentication. Make sure:
1. You're logged in as admin
2. Your session is valid
3. Cookies are enabled

### Step 4: Upload via Media Library Page
1. Go to `http://localhost:3000/admin/media`
2. Click "Upload Images" button
3. Select an image
4. Check browser console for any errors
5. Check Network tab for the POST request to `/api/media`

### Step 5: Check Database
If upload succeeds but images don't show:
1. Check MongoDB database
2. Look for a collection named `media`
3. See if documents are being created

## Common Issues:

### Issue 1: "Unauthorized" Error
**Cause**: Not authenticated as admin
**Fix**: 
- Make sure you're logged in
- Check if `getAdminAuth()` is working
- Verify cookies are being sent

### Issue 2: Empty Array Returns
**Cause**: No images uploaded yet through new system
**Fix**: Upload at least one image via the Media Library page

### Issue 3: Upload Fails
**Cause**: Cloudinary or MongoDB connection issue
**Fix**:
- Check `.env` file has all required variables:
  - `CLOUDINARY_CLOUD_NAME`
  - `CLOUDINARY_API_KEY`
  - `CLOUDINARY_API_SECRET`
  - `MONGODB_URI`

### Issue 4: Images Upload But Don't Show
**Cause**: Frontend not fetching properly
**Fix**: Check browser console for errors

## Debug Checklist:

- [ ] MongoDB connection is working
- [ ] Admin is authenticated
- [ ] Cloudinary credentials are correct
- [ ] `/api/media` GET returns data (even empty array)
- [ ] `/api/media` POST accepts uploads
- [ ] Browser console shows no errors
- [ ] Network tab shows successful API calls

## Next Steps:

1. Run the console test above
2. Share the response you get
3. Check for any console errors
4. Try uploading an image via `/admin/media` page
5. Check if the upload succeeds in the Network tab
