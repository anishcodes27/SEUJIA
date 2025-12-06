// Alternative Shiprocket Auth Test with detailed debugging
require('dotenv').config({ path: '.env.local' });

async function detailedShiprocketTest() {
  console.log('🔍 Detailed Shiprocket API Test\n');
  console.log('Credentials:');
  console.log('- Email:', process.env.SHIPROCKET_EMAIL);
  console.log('- Password length:', process.env.SHIPROCKET_PASSWORD?.length, 'characters');
  console.log('- Pickup Pincode:', process.env.SHIPROCKET_PICKUP_PINCODE);
  console.log('\n---\n');

  // Test 1: Check if Shiprocket API is reachable
  console.log('Test 1: Checking if Shiprocket API is reachable...');
  try {
    const pingResponse = await fetch('https://apiv2.shiprocket.in/v1/external/auth/login', {
      method: 'OPTIONS',
    });
    console.log('✅ Shiprocket API is reachable\n');
  } catch (error) {
    console.log('❌ Cannot reach Shiprocket API');
    console.log('Error:', error.message);
    return;
  }

  // Test 2: Attempt authentication
  console.log('Test 2: Attempting authentication...');
  
  const requestBody = {
    email: process.env.SHIPROCKET_EMAIL,
    password: process.env.SHIPROCKET_PASSWORD,
  };

  console.log('Request URL: https://apiv2.shiprocket.in/v1/external/auth/login');
  console.log('Request Body:', JSON.stringify({ email: requestBody.email, password: '***' }));
  console.log('');

  try {
    const response = await fetch('https://apiv2.shiprocket.in/v1/external/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Seujia-Honey-App/1.0',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('Response Status:', response.status, response.statusText);
    console.log('Response Headers:', JSON.stringify(Object.fromEntries(response.headers.entries()), null, 2));
    console.log('');

    const data = await response.json();
    console.log('Response Body:', JSON.stringify(data, null, 2));
    console.log('\n---\n');

    if (response.status === 403) {
      console.log('🚨 403 Forbidden Error - This means:\n');
      console.log('Possible causes:');
      console.log('1. ⚠️  API Access Not Enabled for your account');
      console.log('   → Contact Shiprocket: support@shiprocket.in');
      console.log('   → Ask them to enable API access for your account');
      console.log('   → Phone: +91-120-6643000');
      console.log('');
      console.log('2. ⚠️  Account type doesn\'t have API access');
      console.log('   → Free/Starter plans might not have API access');
      console.log('   → You may need to upgrade to a paid plan');
      console.log('');
      console.log('3. ⚠️  IP Whitelisting required');
      console.log('   → Some accounts require IP whitelisting');
      console.log('   → Check Shiprocket Settings → API');
      console.log('');
      console.log('📧 Email Template to send to Shiprocket:');
      console.log('─'.repeat(50));
      console.log('Subject: Enable API Access for Account');
      console.log('');
      console.log('Dear Shiprocket Support,');
      console.log('');
      console.log('I am trying to integrate Shiprocket API with my e-commerce website.');
      console.log('Account Email: ' + process.env.SHIPROCKET_EMAIL);
      console.log('');
      console.log('I am getting "403 Access Forbidden" error when calling the authentication API.');
      console.log('');
      console.log('Could you please:');
      console.log('1. Enable API access for my account');
      console.log('2. Confirm if my account plan supports API integration');
      console.log('3. Let me know if any additional steps are needed');
      console.log('');
      console.log('Thank you!');
      console.log('─'.repeat(50));
      console.log('');
    } else if (response.status === 401) {
      console.log('🚨 401 Unauthorized - Wrong email or password');
      console.log('Please double-check your credentials in .env.local');
    } else if (response.ok) {
      console.log('✅ SUCCESS! Authentication worked!');
      console.log('Token:', data.token?.substring(0, 20) + '...');
    }

  } catch (error) {
    console.error('❌ Request failed:', error.message);
  }

  console.log('\n📝 Summary:');
  console.log('If you see 403 error, your account needs API access enabled.');
  console.log('Contact Shiprocket support to enable API access.');
  console.log('');
  console.log('In the meantime, your website will use fixed delivery charges.');
  console.log('Everything will work perfectly! ✅\n');
}

detailedShiprocketTest();
