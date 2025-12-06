// Update product images
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function updateProductImages() {
  console.log('📸 Updating product images...\n');
  
  // Update Ajwain Honey
  console.log('1. Updating Ajwain Honey image...');
  const { error: ajwainError } = await supabase
    .from('products')
    .update({ image_url: '/ajwain.jpg' })
    .eq('slug', 'ajwain-honey');

  if (ajwainError) {
    console.error('   ❌ Error:', ajwainError.message);
  } else {
    console.log('   ✅ Ajwain Honey: /ajwain.jpg');
  }

  // Update Multiflora Honey
  console.log('2. Updating Multiflora Honey image...');
  const { error: multifloraError } = await supabase
    .from('products')
    .update({ image_url: '/multi.jpg' })
    .eq('slug', 'multiflora-honey');

  if (multifloraError) {
    console.error('   ❌ Error:', multifloraError.message);
  } else {
    console.log('   ✅ Multiflora Honey: /multi.jpg');
  }

  // Update Jujube Honey
  console.log('3. Updating Jujube Honey image...');
  const { error: jujubeError } = await supabase
    .from('products')
    .update({ image_url: '/jujube.jpg' })
    .eq('slug', 'jujube-honey');

  if (jujubeError) {
    console.error('   ❌ Error:', jujubeError.message);
  } else {
    console.log('   ✅ Jujube Honey: /jujube.jpg');
  }

  console.log('\n🎉 Product images updated!');
  console.log('\n📋 Summary:');
  console.log('   Ajwain:    /ajwain.jpg');
  console.log('   Multiflora: /multi.jpg');
  console.log('   Jujube:    /jujube.jpg');
  console.log('\n💡 Refresh your browser to see the new images!');
}

updateProductImages();
