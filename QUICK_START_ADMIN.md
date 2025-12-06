# 🎯 Quick Start: Admin Product Manager

## Access
```
URL: http://localhost:3001/admin/products
Password: admin123
```

## 5-Minute Tutorial

### 1️⃣ Add Your First Product (2 min)
1. Click **"+ Add Product"**
2. Fill in:
   - Name: "Wildflower Honey"
   - Slug: "wildflower-honey"
   - Description: "Pure wildflower honey..."
   - Price: 199
   - Stock: 100
3. Add variants:
   - 250gm: ₹199, Stock: 100
   - 500gm: ₹399, Stock: 100
4. Image: `/wildflower.jpg` (after placing in /public/)
5. Check "Product is active" ✓
6. Click **"Add Product"**
7. Done! ✅

### 2️⃣ Edit Product Price (30 sec)
1. Find product in table
2. Click **"Edit"**
3. Change price: 199 → 249
4. Change variant prices too
5. Click **"Update Product"**
6. Done! ✅

### 3️⃣ Update Stock (30 sec)
1. Click **"Edit"** on product
2. Change stock numbers
3. Click **"Update Product"**
4. Done! ✅

### 4️⃣ Change Image (1 min)
1. Place new image in `/public/new-honey.jpg`
2. Click **"Edit"** on product
3. Change image URL: `/new-honey.jpg`
4. Click **"Update Product"**
5. Done! ✅

### 5️⃣ Hide Product Temporarily (20 sec)
1. Click **"Edit"** on product
2. Uncheck "Product is active"
3. Click **"Update Product"**
4. Hidden from customers! ✅

## Common Tasks

| Task | Time | Steps |
|------|------|-------|
| Add product | 2 min | Fill form → Add |
| Change price | 30 sec | Edit → Update price → Save |
| Update stock | 30 sec | Edit → Change stock → Save |
| New image | 1 min | Upload → Edit → Update URL |
| Delete product | 10 sec | Click Delete → Confirm |

## After Deployment

Same interface, same process:
```
Production: https://your-domain.vercel.app/admin/products
Password: admin123 (or your custom password)
```

## That's It!

You can now manage all products without touching any code or database! 🎉

For detailed guide: See `ADMIN_PRODUCT_GUIDE.md`
For image help: See `IMAGE_UPDATE_GUIDE.md`
