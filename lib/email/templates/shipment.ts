export interface ShipmentEmailData {
  customerName: string;
  orderNumber: string;
  awbCode: string;
  courierName: string;
  trackingUrl: string;
  estimatedDelivery: string;
}

export function getShipmentEmailHtml(data: ShipmentEmailData): string {
  const {
    customerName,
    orderNumber,
    awbCode,
    courierName,
    trackingUrl,
    estimatedDelivery,
  } = data;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Shipped</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f9f9f9;
    }
    .container {
      background-color: #ffffff;
      border-radius: 8px;
      padding: 40px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .header {
      text-align: center;
      margin-bottom: 40px;
    }
    .header h1 {
      color: #059669;
      margin: 0 0 10px 0;
      font-size: 28px;
    }
    .ship-icon {
      font-size: 64px;
      margin-bottom: 20px;
    }
    .tracking-box {
      background: linear-gradient(135deg, #d97706 0%, #f59e0b 100%);
      color: white;
      padding: 25px;
      border-radius: 8px;
      text-align: center;
      margin: 30px 0;
    }
    .tracking-box h2 {
      margin: 0 0 15px 0;
      font-size: 16px;
      font-weight: 600;
      opacity: 0.9;
    }
    .awb-code {
      background-color: rgba(255, 255, 255, 0.2);
      padding: 15px;
      border-radius: 6px;
      font-family: monospace;
      font-size: 24px;
      font-weight: bold;
      letter-spacing: 2px;
      margin: 15px 0;
    }
    .courier-name {
      font-size: 18px;
      font-weight: 600;
      margin-top: 15px;
    }
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
      margin: 30px 0;
    }
    .info-card {
      background-color: #f3f4f6;
      padding: 20px;
      border-radius: 6px;
      text-align: center;
    }
    .info-card h3 {
      margin: 0 0 10px 0;
      font-size: 14px;
      color: #6b7280;
      font-weight: 600;
    }
    .info-card p {
      margin: 0;
      font-size: 16px;
      color: #1f2937;
      font-weight: 600;
    }
    .button {
      display: inline-block;
      background-color: #d97706;
      color: #ffffff;
      text-decoration: none;
      padding: 15px 40px;
      border-radius: 6px;
      font-weight: 600;
      font-size: 16px;
      margin: 20px 0;
      text-align: center;
    }
    .button:hover {
      background-color: #b45309;
    }
    .timeline {
      margin: 30px 0;
      padding: 20px;
      background-color: #f9fafb;
      border-radius: 8px;
    }
    .timeline h3 {
      margin: 0 0 20px 0;
      color: #1f2937;
      font-size: 18px;
    }
    .timeline-item {
      display: flex;
      align-items: flex-start;
      margin-bottom: 15px;
      padding-bottom: 15px;
      border-bottom: 1px solid #e5e7eb;
    }
    .timeline-item:last-child {
      border-bottom: none;
      margin-bottom: 0;
      padding-bottom: 0;
    }
    .timeline-icon {
      font-size: 24px;
      margin-right: 15px;
    }
    .timeline-content {
      flex: 1;
    }
    .timeline-title {
      font-weight: 600;
      color: #1f2937;
      margin: 0 0 5px 0;
    }
    .timeline-desc {
      color: #6b7280;
      font-size: 14px;
      margin: 0;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      text-align: center;
      color: #6b7280;
      font-size: 14px;
    }
    @media only screen and (max-width: 600px) {
      .info-grid {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="ship-icon">🚚</div>
      <h1>Your Order Has Been Shipped!</h1>
      <p style="color: #6b7280; font-size: 16px;">Great news, ${customerName}! Your order is on its way.</p>
    </div>

    <div class="tracking-box">
      <h2>TRACKING NUMBER</h2>
      <div class="awb-code">${awbCode}</div>
      <div class="courier-name">📦 ${courierName}</div>
    </div>

    <div class="info-grid">
      <div class="info-card">
        <h3>Order Number</h3>
        <p>${orderNumber}</p>
      </div>
      <div class="info-card">
        <h3>Estimated Delivery</h3>
        <p>${estimatedDelivery}</p>
      </div>
    </div>

    <div style="text-align: center; margin: 30px 0;">
      <a href="${trackingUrl}" class="button">🔍 Track Your Order</a>
    </div>

    <div class="timeline">
      <h3>📍 What's Next?</h3>
      <div class="timeline-item">
        <div class="timeline-icon">✓</div>
        <div class="timeline-content">
          <p class="timeline-title">Order Confirmed</p>
          <p class="timeline-desc">Your order has been placed successfully</p>
        </div>
      </div>
      <div class="timeline-item">
        <div class="timeline-icon">✓</div>
        <div class="timeline-content">
          <p class="timeline-title">Shipped</p>
          <p class="timeline-desc">Your order is now with ${courierName}</p>
        </div>
      </div>
      <div class="timeline-item">
        <div class="timeline-icon">⏳</div>
        <div class="timeline-content">
          <p class="timeline-title">In Transit</p>
          <p class="timeline-desc">Your order is on the way to you</p>
        </div>
      </div>
      <div class="timeline-item">
        <div class="timeline-icon">📦</div>
        <div class="timeline-content">
          <p class="timeline-title">Out for Delivery</p>
          <p class="timeline-desc">Your order will arrive soon</p>
        </div>
      </div>
      <div class="timeline-item">
        <div class="timeline-icon">🎉</div>
        <div class="timeline-content">
          <p class="timeline-title">Delivered</p>
          <p class="timeline-desc">Enjoy your pure Seujia Honey!</p>
        </div>
      </div>
    </div>

    <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 30px 0;">
      <p style="margin: 0; color: #92400e; text-align: center;">
        <strong>💡 Tip:</strong> Keep this tracking number handy. You can track your order anytime at 
        <a href="${trackingUrl}" style="color: #d97706; text-decoration: underline;">${trackingUrl}</a>
      </p>
    </div>

    <div class="footer">
      <p><strong>Seujia Honey - Pure, Natural, Authentic</strong></p>
      <p>Need help? Contact us at seujia20@gmail.com</p>
      <p style="margin-top: 15px;">Thank you for choosing Seujia Honey! 🍯</p>
    </div>
  </div>
</body>
</html>
  `;
}

export function getShipmentEmailText(data: ShipmentEmailData): string {
  const {
    customerName,
    orderNumber,
    awbCode,
    courierName,
    trackingUrl,
    estimatedDelivery,
  } = data;

  return `
YOUR ORDER HAS BEEN SHIPPED!

Great news, ${customerName}! Your order is on its way.

TRACKING NUMBER: ${awbCode}
COURIER: ${courierName}
ORDER NUMBER: ${orderNumber}
ESTIMATED DELIVERY: ${estimatedDelivery}

Track your order here: ${trackingUrl}

WHAT'S NEXT?
✓ Order Confirmed - Your order has been placed successfully
✓ Shipped - Your order is now with ${courierName}
⏳ In Transit - Your order is on the way to you
📦 Out for Delivery - Your order will arrive soon
🎉 Delivered - Enjoy your pure Seujia Honey!

Keep this tracking number handy. You can track your order anytime.

Thank you for choosing Seujia Honey! 🍯

Need help? Contact us at seujia20@gmail.com

Seujia Honey - Pure, Natural, Authentic
  `.trim();
}
