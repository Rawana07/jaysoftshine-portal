import express from 'express';
import Order from '../models/Order.js';
import Service from '../models/Service.js';
import User from '../models/User.js';

const router = express.Router();

// Dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $match: { paymentStatus: 'completed' } },
      { $group: { _id: null, total: { $sum: '$finalAmount' } } },
    ]);
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalServices = await Service.countDocuments();

    res.json({
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      totalUsers,
      totalServices,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all orders
router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('userId')
      .populate('serviceId')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update order
router.put('/orders/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Service management
router.get('/services', async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/services', async (req, res) => {
  try {
    const service = new Service(req.body);
    await service.save();
    res.status(201).json(service);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/services/:id', async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(service);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/services/:id', async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: 'Service deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;