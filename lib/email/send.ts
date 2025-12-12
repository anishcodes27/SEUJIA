// Export the Gmail email service
export { sendEmail } from './gmail-send';
export type { SendEmailOptions } from './gmail-send';

/**
 * Send a welcome email to a new user
 * @param name User's name
 * @param email User's email address
 */
export async function sendWelcomeEmail(name: string, email: string) {
  const { getWelcomeEmailHtml, getWelcomeEmailText } = await import('./templates/welcome');
  const { sendEmail } = await import('./gmail-send');

  return sendEmail({
    to: email,
    subject: `Welcome to Seujia Honey, ${name}! 🍯`,
    html: getWelcomeEmailHtml(name),
    text: getWelcomeEmailText(name),
  });
}
