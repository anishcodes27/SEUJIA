export interface OrderConfirmationEmailData {
  customerName: string;
  orderNumber: string;
  orderItems: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  discount: number;
  total: number;
  shippingAddress: string;
  paymentMethod: string;
}

export function getOrderConfirmationEmailHtml(data: OrderConfirmationEmailData): string {
  const {
    customerName,
    orderNumber,
    orderItems,
    subtotal,
    discount,
    total,
    shippingAddress,
    paymentMethod,
  } = data;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation</title>
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
      color: #d97706;
      margin: 0 0 10px 0;
      font-size: 28px;
    }
    .success-icon {
      font-size: 64px;
      margin-bottom: 20px;
    }
    .order-number {
      background-color: #fef3c7;
      padding: 15px;
      border-radius: 6px;
      text-align: center;
      margin: 30px 0;
      font-family: monospace;
      font-size: 18px;
      font-weight: bold;
      color: #92400e;
    }
    .section {
      margin: 30px 0;
    }
    .section h2 {
      color: #1f2937;
      font-size: 18px;
      margin-bottom: 15px;
      border-bottom: 2px solid #d97706;
      padding-bottom: 8px;
    }
    .order-item {
      display: flex;
      justify-content: space-between;
      padding: 12px 0;
      border-bottom: 1px solid #e5e7eb;
    }
    .order-item:last-child {
      border-bottom: none;
    }
    .item-details {
      flex: 1;
    }
    .item-name {
      font-weight: 600;
      color: #1f2937;
    }
    .item-quantity {
      color: #6b7280;
      font-size: 14px;
    }
    .item-price {
      font-weight: 600;
      color: #1f2937;
    }
    .totals {
      margin-top: 20px;
      padding-top: 20px;
      border-top: 2px solid #e5e7eb;
    }
    .total-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
    }
    .total-row.grand-total {
      font-size: 20px;
      font-weight: bold;
      color: #d97706;
      padding-top: 15px;
      border-top: 2px solid #d97706;
    }
    .info-box {
      background-color: #f3f4f6;
      padding: 15px;
      border-radius: 6px;
      margin: 15px 0;
    }
    .info-box p {
      margin: 5px 0;
      font-size: 14px;
    }
    .button {
      display: inline-block;
      background-color: #d97706;
      color: #ffffff;
      text-decoration: none;
      padding: 12px 30px;
      border-radius: 6px;
      font-weight: 600;
      margin: 20px 0;
      text-align: center;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      text-align: center;
      color: #6b7280;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="success-icon">✓</div>
      <h1>Order Confirmed!</h1>
      <p style="color: #6b7280; font-size: 16px;">Thank you for your order, ${customerName}</p>
    </div>

    <div class="order-number">
      Order #${orderNumber}
    </div>

    <p style="text-align: center; color: #6b7280;">
      We've received your order and will send you a shipping notification as soon as your items are dispatched.
    </p>

    <div class="section">
      <h2>📦 Order Items</h2>
      ${orderItems.map(item => `
        <div class="order-item">
          <div class="item-details">
            <div class="item-name">${item.name}</div>
            <div class="item-quantity">Quantity: ${item.quantity} × ₹${item.price.toFixed(2)}</div>
          </div>
          <div class="item-price">₹${(item.quantity * item.price).toFixed(2)}</div>
        </div>
      `).join('')}
    </div>

    <div class="totals">
      <div class="total-row">
        <span>Subtotal</span>
        <span>₹${subtotal.toFixed(2)}</span>
      </div>
      ${discount > 0 ? `
      <div class="total-row" style="color: #10b981;">
        <span>Discount</span>
        <span>-₹${discount.toFixed(2)}</span>
      </div>
      ` : ''}
      <div class="total-row grand-total">
        <span>Total</span>
        <span>₹${total.toFixed(2)}</span>
      </div>
    </div>

    <div class="section">
      <h2>🚚 Shipping Address</h2>
      <div class="info-box">
        <p><strong>${customerName}</strong></p>
        <p>${shippingAddress}</p>
      </div>
    </div>

    <div class="section">
      <h2>💳 Payment Method</h2>
      <div class="info-box">
        <p><strong>${paymentMethod.toUpperCase()}</strong></p>
        ${paymentMethod === 'cod' ? '<p>Pay when you receive your order</p>' : '<p>Payment processed successfully</p>'}
      </div>
    </div>

    <div style="text-align: center; margin: 30px 0;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/orders" class="button">View Order Details</a>
    </div>

    <div class="footer">
      <p><strong>Seujia Honey - Pure, Natural, Authentic</strong></p>
      <p>Questions? Contact us at seujia20@gmail.com</p>
      <p style="margin-top: 15px;">Thank you for choosing Seujia Honey! 🍯</p>
    </div>
  </div>
</body>
</html>
  `;
}

export function getOrderConfirmationEmailText(data: OrderConfirmationEmailData): string {
  const {
    customerName,
    orderNumber,
    orderItems,
    subtotal,
    discount,
    total,
    shippingAddress,
    paymentMethod,
  } = data;

  return `
ORDER CONFIRMED!

Thank you for your order, ${customerName}!

Order #${orderNumber}

ORDER ITEMS:
${orderItems.map(item => `
- ${item.name}
  Quantity: ${item.quantity} × ₹${item.price.toFixed(2)} = ₹${(item.quantity * item.price).toFixed(2)}
`).join('')}

TOTAL:
Subtotal: ₹${subtotal.toFixed(2)}
${discount > 0 ? `Discount: -₹${discount.toFixed(2)}\n` : ''}Total: ₹${total.toFixed(2)}

SHIPPING ADDRESS:
${customerName}
${shippingAddress}

PAYMENT METHOD:
${paymentMethod.toUpperCase()}
${paymentMethod === 'cod' ? 'Pay when you receive your order' : 'Payment processed successfully'}

We'll send you a shipping notification as soon as your items are dispatched.

View your order: ${process.env.NEXT_PUBLIC_APP_URL}/orders

Thank you for choosing Seujia Honey! 🍯

Questions? Contact us at seujia20@gmail.com
  `.trim();
}
