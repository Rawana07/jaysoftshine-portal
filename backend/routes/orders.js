import express from 'express';
import Order from '../models/Order.js';
import User from '../models/User.js';

const router = express.Router();

// Create order
router.post('/', async (req, res) => {
  try {
    const { userId, serviceId, customerDetails, uploadedFiles, notes } = req.body;

    const orderNumber = `JSH-${Date.now()}`;
    
    const order = new Order({
      orderNumber,
      userId,
      serviceId,
      customerDetails,
      uploadedFiles,
      notes,
      status: 'pending',
      paymentStatus: 'unpaid',
    });

    await order.save();
    await User.findByIdAndUpdate(userId, { $push: { orders: order._id } });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user orders
router.get('/user/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).populate('serviceId');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all orders (admin)
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().populate('userId').populate('serviceId');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update order status (admin)
router.put('/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;