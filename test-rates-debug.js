// Debug Shiprocket rates for specific pincode
require('dotenv').config({ path: '.env.local' });

async function testSpecificRate() {
  console.log('🔍 Testing Shiprocket Rates for your order...\n');
  
  // Authenticate first
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
    console.error('Authentication failed:', authData);
    return;
  }

  console.log('✅ Authenticated\n');

  // Get rates for your specific scenario
  const pickup = '144411'; // Your pickup
  const delivery = '815301'; // Giridh, Jharkhand
  const weight = 0.5;
  
  console.log('Order Details:');
  console.log('- Pickup:', pickup, '(Kapurthala, Punjab)');
  console.log('- Delivery:', delivery, '(Giridh, Jharkhand)');
  console.log('- Weight:', weight, 'kg');
  console.log('- Value: ₹378');
  console.log('\n---\n');

  // Test PREPAID
  console.log('📦 PREPAID (Razorpay) Rates:\n');
  const prepaidResponse = await fetch(
    `https://apiv2.shiprocket.in/v1/external/courier/serviceability/?pickup_postcode=${pickup}&delivery_postcode=${delivery}&weight=${weight}&cod=0`,
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authData.token}`,
      },
    }
  );

  const prepaidData = await prepaidResponse.json();
  
  if (prepaidData.data?.available_courier_companies) {
    prepaidData.data.available_courier_companies.slice(0, 5).forEach((courier, i) => {
      const total = courier.freight_charge + courier.cod_charges;
      console.log(`${i + 1}. ${courier.courier_name}`);
      console.log(`   Freight: ₹${courier.freight_charge}`);
      console.log(`   COD: ₹${courier.cod_charges}`);
      console.log(`   TOTAL: ₹${total}`);
      console.log(`   ETD: ${courier.etd}`);
      console.log('');
    });

    // Show cheapest
    const cheapest = prepaidData.data.available_courier_companies.reduce((min, c) => {
      const minTotal = min.freight_charge + min.cod_charges;
      const cTotal = c.freight_charge + c.cod_charges;
      return cTotal < minTotal ? c : min;
    });
    console.log('🏆 CHEAPEST (Prepaid):', cheapest.courier_name);
    console.log('   Rate: ₹' + (cheapest.freight_charge + cheapest.cod_charges));
  }

  console.log('\n---\n');

  // Test COD
  console.log('📦 COD Rates:\n');
  const codResponse = await fetch(
    `https://apiv2.shiprocket.in/v1/external/courier/serviceability/?pickup_postcode=${pickup}&delivery_postcode=${delivery}&weight=${weight}&cod=1`,
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authData.token}`,
      },
    }
  );

  const codData = await codResponse.json();
  
  if (codData.data?.available_courier_companies) {
    codData.data.available_courier_companies.slice(0, 5).forEach((courier, i) => {
      const total = courier.freight_charge + courier.cod_charges;
      console.log(`${i + 1}. ${courier.courier_name}`);
      console.log(`   Freight: ₹${courier.freight_charge}`);
      console.log(`   COD: ₹${courier.cod_charges}`);
      console.log(`   TOTAL: ₹${total}`);
      console.log(`   ETD: ${courier.etd}`);
      console.log('');
    });

    // Show cheapest
    const cheapest = codData.data.available_courier_companies.reduce((min, c) => {
      const minTotal = min.freight_charge + min.cod_charges;
      const cTotal = c.freight_charge + c.cod_charges;
      return cTotal < minTotal ? c : min;
    });
    console.log('🏆 CHEAPEST (COD):', cheapest.courier_name);
    console.log('   Rate: ₹' + (cheapest.freight_charge + cheapest.cod_charges));
  }

  console.log('\n---\n');
  console.log('💡 Your website should show the CHEAPEST rate based on payment method.');
  console.log('If showing ₹118, check if it\'s selecting COD rates for Prepaid payment.\n');
}

testSpecificRate();
