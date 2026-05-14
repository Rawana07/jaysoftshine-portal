import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import Order from '../models/Order.js';
import Payment from '../models/Payment.js';
import Service from '../models/Service.js';
import User from '../models/User.js';
import generateReceipt from '../utils/pdfGenerator.js';
import { sendPaymentSuccessEmail } from '../utils/emailService.js';
import { sendOrderNotification } from '../utils/whatsappService.js';

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create payment order
router.post('/create-order', async (req, res) => {
  try {
    const { orderId, amount } = req.body;

    const options = {
      amount: Math.round(amount * 100),
      currency: 'INR',
      receipt: orderId,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    const payment = new Payment({
      orderId,
      userId: (await Order.findById(orderId)).userId,
      razorpayOrderId: razorpayOrder.id,
      amount,
      status: 'pending',
    });

    await payment.save();
    await Order.findByIdAndUpdate(orderId, { razorpayOrderId: razorpayOrder.id });

    res.json(razorpayOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Verify payment
router.post('/verify-payment', async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    const body = razorpayOrderId + '|' + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature === razorpaySignature) {
      await Payment.findOneAndUpdate(
        { razorpayOrderId },
        { 
          razorpayPaymentId, 
          razorpaySignature, 
          status: 'completed' 
        }
      );

      const payment = await Payment.findOne({ razorpayOrderId });
      const order = await Order.findByIdAndUpdate(payment.orderId, {
        razorpayPaymentId,
        paymentStatus: 'completed',
        paidAt: new Date(),
        status: 'confirmed',
      }, { new: true });

      // Generate receipt
      const service = await Service.findById(order.serviceId);
      const user = await User.findById(order.userId);
      const receiptUrl = await generateReceipt(order, service, user);
      order.receiptUrl = receiptUrl;
      await order.save();

      // Send email notification
      await sendPaymentSuccessEmail(order, service, user, receiptUrl);

      // Send WhatsApp notification
      await sendOrderNotification(order, 'confirmed');

      res.json({ success: true, message: 'Payment verified', receiptUrl });
    } else {
      res.status(400).json({ success: false, message: 'Invalid signature' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;