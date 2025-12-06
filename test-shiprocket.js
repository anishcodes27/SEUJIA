// Test Shiprocket API credentials
// Run: node test-shiprocket.js

require('dotenv').config({ path: '.env.local' });

async function testShiprocketAuth() {
  console.log('Testing Shiprocket Authentication...\n');
  
  console.log('Email:', process.env.SHIPROCKET_EMAIL || '❌ NOT SET');
  console.log('Password:', process.env.SHIPROCKET_PASSWORD ? '✅ SET (hidden)' : '❌ NOT SET');
  console.log('Pickup Pincode:', process.env.SHIPROCKET_PICKUP_PINCODE || '❌ NOT SET');
  console.log('\n---\n');

  if (!process.env.SHIPROCKET_EMAIL || !process.env.SHIPROCKET_PASSWORD) {
    console.error('❌ Shiprocket credentials are not configured in .env.local');
    console.log('\nPlease add these to your .env.local file:');
    console.log('SHIPROCKET_EMAIL=your_shiprocket_email');
    console.log('SHIPROCKET_PASSWORD=your_shiprocket_password');
    console.log('SHIPROCKET_PICKUP_PINCODE=your_pincode');
    process.exit(1);
  }

  try {
    console.log('Attempting to authenticate with Shiprocket...\n');

    const response = await fetch('https://apiv2.shiprocket.in/v1/external/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: process.env.SHIPROCKET_EMAIL,
        password: process.env.SHIPROCKET_PASSWORD,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Authentication Failed!\n');
      console.error('Error:', data);
      console.log('\n🔧 Possible fixes:');
      console.log('1. Check your email and password are correct');
      console.log('2. Login to Shiprocket dashboard: https://app.shiprocket.in');
      console.log('3. Make sure your account is active');
      console.log('4. Try resetting your password if needed');
      process.exit(1);
    }

    console.log('✅ Authentication Successful!\n');
    console.log('Token received:', data.token.substring(0, 20) + '...');
    console.log('Email:', data.email);
    console.log('Company ID:', data.company_id);
    console.log('\n---\n');

    // Test serviceability check
    console.log('Testing serviceability check (Delhi pincode: 110001)...\n');

    const ratesResponse = await fetch(
      `https://apiv2.shiprocket.in/v1/external/courier/serviceability/?pickup_postcode=${process.env.SHIPROCKET_PICKUP_PINCODE}&delivery_postcode=110001&weight=0.5&cod=0`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${data.token}`,
        },
      }
    );

    const ratesData = await ratesResponse.json();

    if (!ratesResponse.ok) {
      console.error('❌ Serviceability check failed!\n');
      console.error('Error:', ratesData);
      process.exit(1);
    }

    console.log('✅ Serviceability Check Successful!\n');
    
    if (ratesData.data?.available_courier_companies?.length > 0) {
      console.log('Available Couriers:');
      ratesData.data.available_courier_companies.slice(0, 3).forEach((courier, i) => {
        console.log(`${i + 1}. ${courier.courier_name}`);
        console.log(`   Freight: ₹${courier.freight_charge}`);
        console.log(`   COD Charges: ₹${courier.cod_charges}`);
        console.log(`   ETD: ${courier.etd}`);
        console.log('');
      });
    } else {
      console.log('⚠️ No couriers available for this route');
      console.log('This might mean:');
      console.log('- Your pickup pincode is not serviceable');
      console.log('- Delivery pincode is not serviceable');
      console.log('- No courier partners active in your Shiprocket account');
    }

    console.log('\n✅ All tests passed! Shiprocket integration is working correctly.');
    console.log('\n🎉 You can now use shipping rates in your checkout!\n');

  } catch (error) {
    console.error('❌ Error during testing:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check your internet connection');
    console.log('2. Verify Shiprocket API is not down');
    console.log('3. Check if firewall is blocking the request');
    process.exit(1);
  }
}

testShiprocketAuth();
