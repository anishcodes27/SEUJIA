# Admin Product Management Guide

## 🎯 Overview
You now have a complete admin panel to manage products without needing any code changes or database scripts!

## 🔐 Access
1. Visit: `http://localhost:3001/admin` (or your production URL)
2. Login with password: `admin123`
3. Click **"Product Manager"** button in the top right

## ✨ Features

### 1. **Add New Product**
- Click **"+ Add Product"** button
- Fill in:
  - **Product Name**: e.g., "Wildflower Honey"
  - **Slug**: URL-friendly name (e.g., "wildflower-honey")
  - **Description**: Full product description
  - **Base Price**: Starting price in rupees
  - **Base Stock**: Quantity available
  - **Variants**: Add different sizes with their own price/stock
    - Size 1: 250gm - ₹189 - Stock: 100
    - Size 2: 500gm - ₹389 - Stock: 100
  - **Product Image**: 
    - First, place image in `/public/` folder (e.g., `wildflower.jpg`)
    - Then type the path: `/wildflower.jpg`
  - **Active Status**: Check to make product visible to customers
- Click **"Add Product"**

### 2. **Edit Existing Product**
- Find the product in the table
- Click **"Edit"** button
- Update any field (price, stock, image, description, etc.)
- Click **"Update Product"**

### 3. **Update Images**
**Method 1: Through Admin Panel (Recommended)**
1. Place new image in `/public/` folder (e.g., `/public/new-image.jpg`)
2. Click **Edit** on the product
3. Update the image URL field to `/new-image.jpg`
4. Click **Update Product**

**Method 2: Direct Upload**
- Select image file using the file picker
- Preview will show immediately
- Or manually type the image path

### 4. **Update Stock Levels**
- Click **Edit** on the product
- Update stock number in **Base Stock** field
- Update stock for individual variants if needed
- Click **Update Product**

### 5. **Update Prices**
- Click **Edit** on the product
- Change **Base Price** and/or variant prices
- Click **Update Product**
- Changes reflect immediately on the website

### 6. **Delete Product**
- Click **"Delete"** button on any product
- Confirm deletion
- Product is permanently removed

### 7. **Toggle Product Visibility**
- Click **Edit** on the product
- Uncheck **"Product is active"** to hide from customers
- Check it to make visible again
- Useful for seasonal products or out of stock items

## 📋 Product Table Columns
- **Image**: Product photo preview
- **Name**: Product name and slug
- **Price**: Base price and variant prices (if any)
- **Stock**: Available quantity for all sizes
- **Status**: Active (green) or Inactive (gray)
- **Actions**: Edit or Delete buttons

## 🖼️ Image Management

### Adding Product Images:
1. **Prepare your image**:
   - Use JPG or PNG format
   - Recommended size: 800x800px or similar
   - Keep file size under 1MB for fast loading

2. **Upload to public folder**:
   ```bash
   # Place your image in the public folder
   /public/ajwain.jpg
   /public/multiflora.jpg
   /public/jujube.jpg
   ```

3. **Update in admin panel**:
   - Go to Product Manager
   - Click Edit on the product
   - Enter image path: `/ajwain.jpg` (with leading slash)
   - Save changes

### After Deployment (Production):
Same process works! The admin panel will be accessible at:
`https://your-domain.vercel.app/admin/products`

## 🎨 Product Variants
Variants let you have multiple sizes/options for the same product:

Example: Ajwain Honey
- **Base**: ₹249 (250gm)
- **Variant 1**: 250gm - ₹249 - Stock: 100
- **Variant 2**: 500gm - ₹499 - Stock: 100

Customers will see a dropdown to select size on the product page.

## 🔒 Security Notes
- Only accessible with admin password
- Password stored in `.env.local`: `NEXT_PUBLIC_ADMIN_PASSWORD`
- Change default password before going live!
- In production, use strong password

## 🚀 After Deployment
1. Your admin panel works exactly the same in production
2. No need to access terminal or database
3. Manage everything through the browser
4. Changes are instant

## ⚡ Quick Actions

### Change Product Price:
1. Admin → Product Manager
2. Click Edit on product
3. Change price → Update Product

### Update Stock:
1. Admin → Product Manager
2. Click Edit on product
3. Change stock → Update Product

### Add New Honey Variety:
1. Admin → Product Manager
2. Click "+ Add Product"
3. Fill all fields → Add Product

### Hide Product Temporarily:
1. Admin → Product Manager
2. Click Edit on product
3. Uncheck "Product is active" → Update Product

## 📱 Mobile Friendly
The admin panel works perfectly on mobile devices too! Manage your store from anywhere.

## 🆘 Troubleshooting

**Image not showing?**
- Ensure file is in `/public/` folder
- Image path must start with `/` (e.g., `/image.jpg`)
- Check file name matches exactly (case-sensitive)

**Can't login?**
- Default password: `admin123`
- Check `.env.local` for `NEXT_PUBLIC_ADMIN_PASSWORD`

**Changes not visible on website?**
- Hard refresh browser: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- Clear cache if needed

## 💡 Pro Tips
1. **Use consistent image sizes** for better layout
2. **Update stock regularly** to avoid overselling
3. **Use descriptive slugs** for better SEO
4. **Preview changes** by visiting the shop page
5. **Keep backups** of product images in a separate folder

---

**Need help?** The admin panel is fully functional and ready to use. You can manage all products, prices, stock, and images without any coding!
