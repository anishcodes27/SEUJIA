// Update product prices in database
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function updatePrices() {
  console.log('💰 Updating product prices...\n');
  
  // Jujube Honey: 250gm = ₹189, 500gm = ₹389
  console.log('1. Updating Jujube Honey...');
  const { error: jujubeError } = await supabase
    .from('products')
    .update({
      price: 189,
      variants: [
        { size: '250gm', price: 189, stock: 100 },
        { size: '500gm', price: 389, stock: 100 }
      ]
    })
    .eq('slug', 'jujube-honey');

  if (jujubeError) {
    console.error('   ❌ Error:', jujubeError.message);
  } else {
    console.log('   ✅ Jujube: 250gm=₹189, 500gm=₹389');
  }

  // Multiflora Honey: 250gm = ₹149, 500gm = ₹299
  console.log('2. Updating Multiflora Honey...');
  const { error: multifloraError } = await supabase
    .from('products')
    .update({
      price: 149,
      variants: [
        { size: '250gm', price: 149, stock: 100 },
        { size: '500gm', price: 299, stock: 100 }
      ]
    })
    .eq('slug', 'multiflora-honey');

  if (multifloraError) {
    console.error('   ❌ Error:', multifloraError.message);
  } else {
    console.log('   ✅ Multiflora: 250gm=₹149, 500gm=₹299');
  }

  // Ajwain Honey: 250gm = ₹249, 500gm = ₹499
  console.log('3. Updating Ajwain Honey...');
  const { error: ajwainError } = await supabase
    .from('products')
    .update({
      price: 249,
      variants: [
        { size: '250gm', price: 249, stock: 100 },
        { size: '500gm', price: 499, stock: 100 }
      ]
    })
    .eq('slug', 'ajwain-honey');

  if (ajwainError) {
    console.error('   ❌ Error:', ajwainError.message);
  } else {
    console.log('   ✅ Ajwain: 250gm=₹249, 500gm=₹499');
  }

  console.log('\n🎉 Price update complete!');
  console.log('\n📋 Summary:');
  console.log('   Jujube:    250gm=₹189  500gm=₹389');
  console.log('   Multiflora: 250gm=₹149  500gm=₹299');
  console.log('   Ajwain:    250gm=₹249  500gm=₹499');
}

updatePrices();
