import axios from 'axios';

const sendWhatsAppMessage = async (phoneNumber, message) => {
  try {
    // Using a simple WhatsApp API endpoint (e.g., Twilio, CallMeBot, etc.)
    // For production, use a proper WhatsApp Business API
    console.log(`📱 WhatsApp Message to ${phoneNumber}: ${message}`);
    
    // Example implementation with Twilio:
    // const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    // await client.messages.create({
    //   body: message,
    //   from: 'whatsapp:+14155552671',
    //   to: `whatsapp:+91${phoneNumber}`
    // });
  } catch (err) {
    console.error('❌ WhatsApp error:', err);
  }
};

const sendOrderNotification = async (order, type) => {
  const messages = {
    confirmed: `Hi ${order.customerDetails.name}, your order ${order.orderNumber} has been confirmed! Total: ₹${order.finalAmount}. Track status: ${process.env.FRONTEND_URL}/orders/${order._id}`,
    processing: `Hi ${order.customerDetails.name}, your order ${order.orderNumber} is now being processed.`,
    completed: `Hi ${order.customerDetails.name}, your order ${order.orderNumber} is ready! Download from: ${process.env.FRONTEND_URL}/orders/${order._id}`,
  };

  await sendWhatsAppMessage(order.customerDetails.phone, messages[type] || 'Your order has been updated.');
};

export { sendWhatsAppMessage, sendOrderNotification };