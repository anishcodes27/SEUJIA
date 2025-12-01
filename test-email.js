// Test script to verify email sending
const { Resend } = require('resend');

const resend = new Resend('re_CvhRzfEv_DGLUVhxcV8HQXrstZ7shEGie');

async function testEmail() {
  console.log('Testing email send...');
  console.log('API Key:', 're_CvhRzfEv_DGLUVhxcV8HQXrstZ7shEGie'.substring(0, 10) + '...');
  
  try {
    const data = await resend.emails.send({
      from: 'Seujia Honey <onboarding@resend.dev>',
      to: 'seujia20@gmail.com', // Your verified email
      subject: 'Test Email from Seujia Honey 🍯',
      html: '<h1>Test Email</h1><p>If you receive this, email is working!</p>',
    });

    console.log('✅ Email sent successfully!');
    console.log('Response:', data);
  } catch (error) {
    console.error('❌ Error sending email:');
    console.error('Error message:', error.message);
    console.error('Full error:', error);
  }
}

testEmail();
