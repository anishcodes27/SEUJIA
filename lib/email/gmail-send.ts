import nodemailer from 'nodemailer';

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
}

/**
 * Send an email using Gmail SMTP
 * @param options Email options including recipient, subject, and content
 * @returns Promise with email sending result
 */
export async function sendEmail(options: SendEmailOptions) {
  try {
    // Check if Gmail credentials are configured
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      console.error('Gmail credentials are not configured');
      return { success: false, error: 'Email service not configured' };
    }

    // Create transporter with Gmail SMTP
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    // Use custom from address or default
    const fromAddress = options.from || process.env.EMAIL_FROM || `Seujia Honey <${process.env.GMAIL_USER}>`;

    console.log('Attempting to send email via Gmail SMTP to:', options.to);
    console.log('From:', fromAddress);

    // Send email
    const info = await transporter.sendMail({
      from: fromAddress,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text || options.subject,
    });

    console.log('✅ Email sent successfully via Gmail!');
    console.log('Message ID:', info.messageId);

    return { 
      success: true, 
      data: { id: info.messageId },
      messageId: info.messageId 
    };
  } catch (error: any) {
    console.error('❌ Failed to send email via Gmail:', error);
    
    // Provide helpful error messages
    if (error.code === 'EAUTH') {
      console.error('Authentication failed. Please check:');
      console.error('1. Gmail user email is correct');
      console.error('2. App password is correct (16 characters without spaces)');
      console.error('3. 2-Step Verification is enabled on Gmail account');
    } else if (error.code === 'ETIMEDOUT' || error.code === 'ECONNECTION') {
      console.error('Connection timeout. Please check your internet connection.');
    }

    return { 
      success: false, 
      error: error.message || 'Failed to send email',
      details: error
    };
  }
}
