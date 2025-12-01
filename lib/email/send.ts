import { Resend } from 'resend';

// Initialize Resend with API key from environment variable
const resend = new Resend(process.env.RESEND_API_KEY);

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
}

/**
 * Send an email using Resend
 * @param options Email options including recipient, subject, and content
 * @returns Promise with email sending result
 */
export async function sendEmail(options: SendEmailOptions) {
  try {
    // Check if RESEND_API_KEY is configured
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured');
      return { success: false, error: 'Email service not configured' };
    }

    // Use custom from address or default
    const fromAddress = options.from || process.env.EMAIL_FROM || 'Seujia Honey <onboarding@resend.dev>';

    console.log('Attempting to send email to:', options.to);
    console.log('From:', fromAddress);

    const data = await resend.emails.send({
      from: fromAddress,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });

    // Check if there's an error in the response
    if (data.error) {
      console.error('Resend API error:', data.error);
      
      // Log specific error for domain verification
      if (data.error.message && data.error.message.includes('verify a domain')) {
        console.warn('⚠️  EMAIL LIMITATION: Without domain verification, emails can only be sent to your Resend account email (the one you used to sign up).');
        console.warn('To send to any email: Verify a domain at https://resend.com/domains');
      }
      
      return { success: false, error: data.error };
    }

    console.log('✅ Email sent successfully! ID:', data.data?.id);
    return { success: true, data: data.data };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}

/**
 * Send a welcome email to a new user
 * @param name User's name
 * @param email User's email address
 */
export async function sendWelcomeEmail(name: string, email: string) {
  const { getWelcomeEmailHtml, getWelcomeEmailText } = await import('./templates/welcome');

  return sendEmail({
    to: email,
    subject: `Welcome to Seujia Honey, ${name}! 🍯`,
    html: getWelcomeEmailHtml(name),
    text: getWelcomeEmailText(name),
  });
}
