// Test 0.9kg rate
require('dotenv').config({ path: '.env.local' });

async function test09kg() {
  console.log('🔍 Testing 0.9kg rate (2 items in cart)...\n');
  
  // Authenticate
  const authResponse = await fetch('https://apiv2.shiprocket.in/v1/external/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: process.env.SHIPROCKET_EMAIL,
      password: process.env.SHIPROCKET_PASSWORD.replace(/"/g, ''),
    }),
  });

  const authData = await authResponse.json();
  if (!authResponse.ok) {
    console.error('Auth failed:', authData);
    return;
  }

  const pickup = '144411';
  const delivery = '815301';
  
  // Test 0.9kg PREPAID
  console.log('📦 0.9kg PREPAID (Razorpay):');
  const response = await fetch(
    `https://apiv2.shiprocket.in/v1/external/courier/serviceability/?pickup_postcode=${pickup}&delivery_postcode=${delivery}&weight=0.9&cod=0`,
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authData.token}`,
      },
    }
  );

  const data = await response.json();
  
  if (data.data?.available_courier_companies) {
    data.data.available_courier_companies.slice(0, 5).forEach((courier, i) => {
      const total = courier.freight_charge + courier.cod_charges;
      console.log(`${i + 1}. ${courier.courier_name}`);
      console.log(`   Total: ₹${total} (Freight: ₹${courier.freight_charge}, COD: ₹${courier.cod_charges})`);
    });

    const cheapest = data.data.available_courier_companies.reduce((min, c) => {
      const minTotal = min.freight_charge + min.cod_charges;
      const cTotal = c.freight_charge + c.cod_charges;
      return cTotal < minTotal ? c : min;
    });
    console.log('\n🏆 CHEAPEST:', cheapest.courier_name, '- ₹' + (cheapest.freight_charge + cheapest.cod_charges));
  }
  
  // Compare with 0.5kg
  console.log('\n---\n');
  console.log('📦 0.5kg PREPAID (for comparison):');
  const response05 = await fetch(
    `https://apiv2.shiprocket.in/v1/external/courier/serviceability/?pickup_postcode=${pickup}&delivery_postcode=${delivery}&weight=0.5&cod=0`,
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authData.token}`,
      },
    }
  );

  const data05 = await response05.json();
  
  if (data05.data?.available_courier_companies) {
    const cheapest = data05.data.available_courier_companies.reduce((min, c) => {
      const minTotal = min.freight_charge + min.cod_charges;
      const cTotal = c.freight_charge + c.cod_charges;
      return cTotal < minTotal ? c : min;
    });
    console.log('🏆 CHEAPEST:', cheapest.courier_name, '- ₹' + (cheapest.freight_charge + cheapest.cod_charges));
  }
  
  console.log('\n💡 Shiprocket charges more for 0.9kg (rounded to 1kg tier) vs 0.5kg.');
  console.log('   This is normal weight-based pricing.\n');
}

test09kg();
