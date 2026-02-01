# Category System - Testing & Verification Checklist

## 🚀 Initial Setup

### Step 1: Start Development Server
```bash
npm run dev
```
- [ ] Server starts successfully
- [ ] No compilation errors
- [ ] Navigate to `http://localhost:3000`

### Step 2: Initialize Categories
Visit: `http://localhost:3000/api/categories/init`

**Expected Response:**
```json
{
  "success": true,
  "message": "Initialization complete",
  "results": [
    "Boys category created",
    "Girls category created"
  ]
}
```

- [ ] Response shows success
- [ ] Both categories created (or already exist message)

---

## 📋 Category Management Tests

### Test 1: View Categories Page
Navigate to: Admin Dashboard → Categories

**Verify:**
- [ ] Page loads without errors
- [ ] "Boys" category is visible
- [ ] "Girls" category is visible
- [ ] Form is displayed at the top
- [ ] Tree view is displayed below

### Test 2: Create Subcategory (Level 1)
1. Fill in form:
   - Name: "T-Shirts"
   - Parent: "Boys"
   - Description: "Boys t-shirts collection"
   - Order: 1
   - Active: ✓ Checked
2. Click "Add Category"

**Verify:**
- [ ] Success toast appears
- [ ] "T-Shirts" appears under "Boys"
- [ ] Indentation shows hierarchy
- [ ] Slug badge shows "/t-shirts"
- [ ] Edit, Delete, Add Sub buttons visible

### Test 3: Create Subcategory (Level 2)
1. Click "Add Sub" button on "T-Shirts"
2. Form auto-fills with parent = "T-Shirts"
3. Enter name: "Casual T-Shirts"
4. Click "Add Category"

**Verify:**
- [ ] Success toast appears
- [ ] "Casual T-Shirts" appears under "T-Shirts"
- [ ] Double indentation visible
- [ ] Hierarchy: Boys → T-Shirts → Casual T-Shirts

### Test 4: Expand/Collapse
1. Click chevron icon on "Boys"

**Verify:**
- [ ] Chevron changes from ▼ to ▶
- [ ] Child categories hide
- [ ] Click again to expand
- [ ] Children reappear

### Test 5: Edit Category
1. Click "Edit" on "T-Shirts"
2. Change name to "T-Shirts & Tops"
3. Click "Update Category"

**Verify:**
- [ ] Success toast appears
- [ ] Name updates in tree view
- [ ] Slug updates to "t-shirts-tops"
- [ ] Hierarchy maintained

### Test 6: Move Category
1. Click "Edit" on "Casual T-Shirts"
2. Change parent to "Girls"
3. Click "Update Category"

**Verify:**
- [ ] Category moves from Boys to Girls
- [ ] Hierarchy updates correctly
- [ ] No errors

### Test 7: Toggle Active/Inactive
1. Click "Edit" on any category
2. Uncheck "Active"
3. Click "Update Category"

**Verify:**
- [ ] Yellow "Inactive" badge appears
- [ ] Category still visible in admin
- [ ] Category hidden from product dropdown (test later)

### Test 8: Delete Category
1. Click "Delete" on a category without children
2. Confirm deletion

**Verify:**
- [ ] Confirmation dialog appears
- [ ] Category removed from tree
- [ ] Success toast appears

---

## 🛍️ Product Integration Tests

### Test 9: Create Product with Category
1. Navigate to: Products → Add New Product
2. Fill in basic info:
   - Name: "Test Product"
   - Price: 100
3. Open Category dropdown

**Verify:**
- [ ] "Boys" appears first
- [ ] "Girls" appears second
- [ ] Subcategories show with indentation
- [ ] Example: `  T-Shirts` (2 spaces)
- [ ] Example: `    Casual T-Shirts` (4 spaces)
- [ ] Inactive categories NOT shown

4. Select "Casual T-Shirts"
5. Add at least one variant
6. Upload featured image
7. Click "Create Product"

**Verify:**
- [ ] Product created successfully
- [ ] Category saved correctly

### Test 10: Edit Product Category
1. Go to Products list
2. Click on the test product
3. Change category to different one
4. Click "Update Product"

**Verify:**
- [ ] Category updates successfully
- [ ] No errors

### Test 11: Verify Category Hierarchy in Dropdown
1. Create categories at different levels:
   - Boys → Pants
   - Boys → Pants → Jeans
   - Girls → Dresses
   - Girls → Dresses → Party Dresses

2. Open product category dropdown

**Verify:**
- [ ] All levels show correct indentation
- [ ] Hierarchy is clear and readable
- [ ] Can select any level

---

## 🔧 API Tests

### Test 12: GET Categories (Hierarchical)
```bash
curl http://localhost:3000/api/categories
```

**Verify:**
- [ ] Returns array of root categories
- [ ] Each category has `children` array
- [ ] Nested structure is correct
- [ ] All fields present (name, slug, parentId, etc.)

### Test 13: GET Categories (Flat)
```bash
curl http://localhost:3000/api/categories/flat
```

**Verify:**
- [ ] Returns flat array
- [ ] Only active categories
- [ ] Sorted by order field

### Test 14: POST Category
```bash
curl -X POST http://localhost:3000/api/categories \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Category",
    "parentId": "boys",
    "description": "Test description"
  }'
```

**Verify:**
- [ ] Category created
- [ ] Slug auto-generated
- [ ] Default values set

### Test 15: PUT Category
```bash
curl -X PUT http://localhost:3000/api/categories/[CATEGORY_ID] \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Name"
  }'
```

**Verify:**
- [ ] Category updated
- [ ] Slug regenerated
- [ ] No errors

### Test 16: DELETE Category
```bash
curl -X DELETE http://localhost:3000/api/categories/[CATEGORY_ID]
```

**Verify:**
- [ ] Category deleted
- [ ] Returns success message

---

## 🎨 UI/UX Tests

### Test 17: Responsive Design
1. Resize browser window

**Verify:**
- [ ] Form adapts to mobile
- [ ] Tree view readable on mobile
- [ ] Buttons accessible
- [ ] No horizontal scroll

### Test 18: Visual Hierarchy
**Verify:**
- [ ] Indentation clearly shows levels
- [ ] Badges are readable
- [ ] Colors are consistent
- [ ] Spacing is appropriate

### Test 19: User Feedback
**Verify:**
- [ ] Success toasts appear on actions
- [ ] Error toasts appear on failures
- [ ] Loading states work
- [ ] Confirmation dialogs work

---

## 🐛 Edge Cases

### Test 20: Create Category Without Parent
1. Leave parent as "Top Level"
2. Create category

**Verify:**
- [ ] Category created at root level
- [ ] No indentation
- [ ] Appears alongside Boys/Girls

### Test 21: Deep Nesting (5+ Levels)
Create categories 5 levels deep

**Verify:**
- [ ] All levels display correctly
- [ ] Indentation doesn't break layout
- [ ] Dropdown shows all levels

### Test 22: Special Characters in Name
1. Create category with name: "T-Shirts & Tops (Sale!)"

**Verify:**
- [ ] Category created
- [ ] Slug handles special chars: "t-shirts-tops-sale"
- [ ] No errors

### Test 23: Duplicate Names
1. Create two categories with same name but different parents

**Verify:**
- [ ] Both created successfully
- [ ] Slugs may be same (acceptable)
- [ ] No conflicts

### Test 24: Delete Category with Children
1. Try to delete category that has subcategories

**Verify:**
- [ ] Deletion works (children become orphaned)
- [ ] Or implement prevention (optional)

---

## 📊 Data Integrity Tests

### Test 25: Verify Database Structure
Check MongoDB collection "categories"

**Verify:**
- [ ] All fields present
- [ ] parentId references correct
- [ ] Dates are set
- [ ] Slugs are unique per parent

### Test 26: Verify Product References
1. Create product with category
2. Check product document in database

**Verify:**
- [ ] Category ID stored correctly
- [ ] Can retrieve category info

---

## ✅ Final Verification

### Checklist Summary
- [ ] All API endpoints working
- [ ] Category CRUD operations work
- [ ] Update functionality fixed
- [ ] Delete functionality fixed
- [ ] Tree view displays correctly
- [ ] Expand/collapse works
- [ ] Product integration works
- [ ] Dropdown shows hierarchy
- [ ] Hardcoded Boys/Girls present
- [ ] Slugs auto-generate
- [ ] Active/Inactive works
- [ ] Order sorting works
- [ ] No console errors
- [ ] No visual bugs
- [ ] Mobile responsive

---

## 🎯 Production Readiness

Before deploying to production:

### Data Setup
- [ ] Initialize Boys and Girls categories
- [ ] Create main product categories
- [ ] Create subcategories as needed
- [ ] Set appropriate order values
- [ ] Add descriptions to categories

### Performance
- [ ] Test with 50+ categories
- [ ] Check page load times
- [ ] Verify API response times
- [ ] Test with 100+ products

### Security
- [ ] Admin authentication working
- [ ] Unauthorized access blocked
- [ ] Input validation working
- [ ] XSS protection in place

### Documentation
- [ ] Team trained on category system
- [ ] Documentation accessible
- [ ] Quick start guide reviewed

---

## 📝 Notes

### Issues Found:
_List any issues you encounter during testing_

1. 
2. 
3. 

### Improvements Needed:
_List any desired improvements_

1. 
2. 
3. 

### Questions:
_List any questions_

1. 
2. 
3. 

---

## ✅ Sign-off

**Tested by:** _______________  
**Date:** _______________  
**Status:** ⬜ Pass ⬜ Fail ⬜ Needs Review  
**Notes:** _______________

---

**All tests passed? You're ready to go! 🚀**
