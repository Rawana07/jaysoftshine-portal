import express from 'express';
import Order from '../models/Order.js';
import Service from '../models/Service.js';
import User from '../models/User.js';
import generateReceipt from '../utils/pdfGenerator.js';

const router = express.Router();

// Generate receipt for order
router.post('/:orderId', async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    const service = await Service.findById(order.serviceId);
    const user = await User.findById(order.userId);

    const receiptUrl = await generateReceipt(order, service, user);
    
    // Update order with receipt URL
    order.receiptUrl = receiptUrl;
    await order.save();

    res.json({ receiptUrl, message: 'Receipt generated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Download receipt
router.get('/:orderId/download', async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order || !order.receiptUrl) {
      return res.status(404).json({ error: 'Receipt not found' });
    }

    const filepath = `.${order.receiptUrl}`;
    res.download(filepath);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;