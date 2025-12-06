// Check products in database
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkProducts() {
  console.log('📦 Fetching products from database...\n');
  
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  console.log(`Found ${products.length} products:\n`);
  
  products.forEach((product, i) => {
    console.log(`${i + 1}. ${product.name}`);
    console.log(`   ID: ${product.id}`);
    console.log(`   Price: ₹${product.price}`);
    console.log(`   Stock: ${product.stock}`);
    console.log(`   Slug: ${product.slug}`);
    console.log(`   Active: ${product.is_active}`);
    
    if (product.variants && product.variants.length > 0) {
      console.log(`   Variants:`);
      product.variants.forEach(v => {
        console.log(`     - ${v.size}: ₹${v.price} (Stock: ${v.stock})`);
      });
    }
    console.log('');
  });
}

checkProducts();
