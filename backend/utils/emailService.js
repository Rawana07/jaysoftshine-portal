import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendOrderConfirmationEmail = async (order, service, user) => {
  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: order.customerDetails.email || user.email,
    subject: `Order Confirmation - ${order.orderNumber}`,
    html: `
      <h2>Order Confirmed!</h2>
      <p>Dear ${order.customerDetails.name},</p>
      <p>Thank you for placing an order with JaySoftShine.</p>
      
      <h3>Order Details:</h3>
      <p><strong>Order Number:</strong> ${order.orderNumber}</p>
      <p><strong>Service:</strong> ${service.name}</p>
      <p><strong>Amount:</strong> ₹${order.finalAmount}</p>
      <p><strong>Status:</strong> ${order.status}</p>
      
      <p>We will process your order shortly. You can track the status on your dashboard.</p>
      
      <p>Best regards,<br/>JaySoftShine Team</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Order confirmation email sent');
  } catch (err) {
    console.error('❌ Email error:', err);
  }
};

const sendPaymentSuccessEmail = async (order, service, user, receiptUrl) => {
  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: order.customerDetails.email || user.email,
    subject: `Payment Successful - ${order.orderNumber}`,
    html: `
      <h2>Payment Received!</h2>
      <p>Dear ${order.customerDetails.name},</p>
      <p>Your payment of ₹${order.finalAmount} has been successfully processed.</p>
      
      <h3>Payment Details:</h3>
      <p><strong>Order Number:</strong> ${order.orderNumber}</p>
      <p><strong>Payment ID:</strong> ${order.razorpayPaymentId}</p>
      <p><strong>Date:</strong> ${new Date(order.paidAt).toLocaleDateString()}</p>
      
      <p><a href="${process.env.FRONTEND_URL}${receiptUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Download Receipt</a></p>
      
      <p>Your order is now confirmed and will be processed soon.</p>
      
      <p>Best regards,<br/>JaySoftShine Team</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Payment confirmation email sent');
  } catch (err) {
    console.error('❌ Email error:', err);
  }
};

const sendOrderStatusUpdateEmail = async (order, service, user, newStatus) => {
  const statusMessages = {
    processing: 'We are now processing your order. Please allow 2-3 business days for completion.',
    completed: 'Your order has been completed! Download your documents from your dashboard.',
    cancelled: 'Your order has been cancelled. Please contact support for more details.',
  };

  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: order.customerDetails.email || user.email,
    subject: `Order Status Update - ${order.orderNumber}`,
    html: `
      <h2>Order Status Update</h2>
      <p>Dear ${order.customerDetails.name},</p>
      
      <p><strong>Order Number:</strong> ${order.orderNumber}</p>
      <p><strong>New Status:</strong> <span style="color: #28a745; font-weight: bold;">${newStatus.toUpperCase()}</span></p>
      
      <p>${statusMessages[newStatus] || 'Your order status has been updated.'}</p>
      
      <p>Best regards,<br/>JaySoftShine Team</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Status update email sent');
  } catch (err) {
    console.error('❌ Email error:', err);
  }
};

export { sendOrderConfirmationEmail, sendPaymentSuccessEmail, sendOrderStatusUpdateEmail };