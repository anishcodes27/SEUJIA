// Test script to verify Gmail SMTP is working
require('dotenv').config({ path: '.env.local' });

async function testEmail() {
  console.log('🧪 Testing Gmail SMTP Setup...\n');
  
  // Check environment variables
  console.log('Checking environment variables:');
  console.log('✓ GMAIL_USER:', process.env.GMAIL_USER ? '✓' : '✗ Missing');
  console.log('✓ GMAIL_APP_PASSWORD:', process.env.GMAIL_APP_PASSWORD ? '✓' : '✗ Missing');
  console.log('✓ EMAIL_FROM:', process.env.EMAIL_FROM || 'Not set');
  console.log('');
  
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.error('❌ Gmail credentials are missing!');
    process.exit(1);
  }
  
  // Import nodemailer directly
  const nodemailer = require('nodemailer');
  
  console.log('📧 Sending test email...\n');
  
  // Create transporter
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
  
  try {
    // Send test email
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.GMAIL_USER, // Send to yourself
      subject: 'Test Email - Seujia Honey 🍯',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #D97706;">🍯 Test Email Success!</h1>
          <p>This is a test email from your Seujia Honey website.</p>
          <p>If you received this email, your Gmail SMTP setup is working correctly! ✅</p>
          <hr style="margin: 20px 0; border: 1px solid #FEF3C7;">
          <p style="color: #666; font-size: 14px;">
            Sent at: ${new Date().toLocaleString()}<br>
            From: ${process.env.EMAIL_FROM}
          </p>
        </div>
      `,
      text: 'Test email from Seujia Honey website. If you received this, Gmail SMTP is working!'
    });
    
    console.log('✅ SUCCESS! Email sent successfully!');
    console.log('📬 Message ID:', info.messageId);
    console.log('');
    console.log('Check your inbox at:', process.env.GMAIL_USER);
    console.log('');
    console.log('🎉 Your Gmail SMTP is configured correctly!');
    console.log('📧 Emails will be sent to customers when they:');
    console.log('   • Sign up (Welcome email)');
    console.log('   • Place an order (Order confirmation)');
    console.log('   • Receive shipping updates (Tracking email)');
    console.log('   • Order is delivered (Delivery confirmation)');
  } catch (error) {
    console.error('❌ FAILED! Could not send email');
    console.error('Error:', error.message);
    if (error.code === 'EAUTH') {
      console.error('');
      console.error('Authentication failed! Please check:');
      console.error('1. Gmail email is correct');
      console.error('2. App password is correct (remove spaces)');
      console.error('3. 2-Step Verification is enabled');
    }
  }
}

// Run test
testEmail().catch(console.error);
