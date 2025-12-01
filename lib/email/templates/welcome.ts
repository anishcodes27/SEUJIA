export function getWelcomeEmailHtml(name: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Seujia Honey</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #FEF3C7;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    <!-- Header with Logo -->
                    <tr>
                        <td align="center" style="padding: 40px 40px 20px 40px; background: linear-gradient(135deg, #D97706 0%, #F59E0B 100%); border-radius: 16px 16px 0 0;">
                            <h1 style="color: #ffffff; font-size: 32px; margin: 0; font-weight: bold; text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);">
                                🍯 Seujia Honey
                            </h1>
                        </td>
                    </tr>
                    
                    <!-- Welcome Message -->
                    <tr>
                        <td style="padding: 40px;">
                            <h2 style="color: #92400E; font-size: 28px; margin: 0 0 20px 0; font-weight: bold;">
                                Welcome, ${name}! 🎉
                            </h2>
                            <p style="color: #78350F; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                                Thank you for joining the <strong>Seujia Honey</strong> family! We're thrilled to have you with us.
                            </p>
                            <p style="color: #78350F; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                                At Seujia, we're passionate about bringing you the finest, purest honey straight from nature. Every jar is a testament to our commitment to quality and sustainability.
                            </p>
                            
                            <!-- Benefits Section -->
                            <div style="background-color: #FEF3C7; border-left: 4px solid #F59E0B; padding: 20px; margin: 30px 0; border-radius: 8px;">
                                <h3 style="color: #92400E; font-size: 20px; margin: 0 0 15px 0;">
                                    What You Can Expect:
                                </h3>
                                <ul style="color: #78350F; font-size: 15px; line-height: 1.8; margin: 0; padding-left: 20px;">
                                    <li>🌸 <strong>100% Pure & Natural</strong> honey from sustainable apiaries</li>
                                    <li>🎯 <strong>Exclusive Offers</strong> and early access to new products</li>
                                    <li>📦 <strong>Fast Delivery</strong> right to your doorstep</li>
                                    <li>🎁 <strong>Special Discounts</strong> for loyal customers</li>
                                    <li>💚 <strong>Health Benefits</strong> with every spoonful</li>
                                </ul>
                            </div>
                            
                            <!-- CTA Button -->
                            <table role="presentation" style="margin: 30px 0;">
                                <tr>
                                    <td align="center">
                                        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/shop" 
                                           style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #D97706 0%, #F59E0B 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px rgba(217, 119, 6, 0.3);">
                                            🛍️ Start Shopping
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="color: #78350F; font-size: 16px; line-height: 1.6; margin: 20px 0 0 0;">
                                If you have any questions or need assistance, feel free to reach out to us anytime. We're here to help!
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 30px 40px; background-color: #FEF3C7; border-radius: 0 0 16px 16px; text-align: center;">
                            <p style="color: #92400E; font-size: 14px; margin: 0 0 10px 0; font-weight: bold;">
                                Stay Connected
                            </p>
                            <p style="color: #78350F; font-size: 14px; margin: 0 0 15px 0;">
                                📧 Email: hello@seujia.com | 📱 Phone: +91 1234567890
                            </p>
                            <div style="margin: 15px 0;">
                                <a href="#" style="display: inline-block; margin: 0 10px; color: #D97706; text-decoration: none; font-size: 20px;">📷</a>
                                <a href="#" style="display: inline-block; margin: 0 10px; color: #D97706; text-decoration: none; font-size: 20px;">📘</a>
                                <a href="#" style="display: inline-block; margin: 0 10px; color: #D97706; text-decoration: none; font-size: 20px;">🐦</a>
                            </div>
                            <p style="color: #92400E; font-size: 12px; margin: 15px 0 0 0;">
                                © ${new Date().getFullYear()} Seujia Honey. All rights reserved.
                            </p>
                            <p style="color: #92400E; font-size: 11px; margin: 10px 0 0 0;">
                                Pure. Natural. Sustainable.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
  `;
}

export function getWelcomeEmailText(name: string): string {
  return `
Welcome to Seujia Honey, ${name}!

Thank you for joining the Seujia Honey family! We're thrilled to have you with us.

At Seujia, we're passionate about bringing you the finest, purest honey straight from nature. Every jar is a testament to our commitment to quality and sustainability.

WHAT YOU CAN EXPECT:
• 100% Pure & Natural honey from sustainable apiaries
• Exclusive Offers and early access to new products
• Fast Delivery right to your doorstep
• Special Discounts for loyal customers
• Health Benefits with every spoonful

Start shopping now: ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/shop

If you have any questions or need assistance, feel free to reach out to us anytime. We're here to help!

Stay Connected:
Email: hello@seujia.com
Phone: +91 1234567890

© ${new Date().getFullYear()} Seujia Honey. All rights reserved.
Pure. Natural. Sustainable.
  `;
}
