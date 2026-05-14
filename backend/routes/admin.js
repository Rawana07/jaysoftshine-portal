import express from 'express';
import Order from '../models/Order.js';
import Service from '../models/Service.js';
import User from '../models/User.js';
import Payment from '../models/Payment.js';
import { sendOrderStatusUpdateEmail } from '../utils/emailService.js';
import { sendOrderNotification } from '../utils/whatsappService.js';

const router = express.Router();

// Dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const completedOrders = await Order.countDocuments({ status: 'completed' });
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const processingOrders = await Order.countDocuments({ status: 'processing' });

    const totalRevenue = await Order.aggregate([
      { $match: { paymentStatus: 'completed' } },
      { $group: { _id: null, total: { $sum: '$finalAmount' } } },
    ]);

    const monthlyRevenue = await Order.aggregate([
      { $match: { paymentStatus: 'completed' } },
      { $group: { 
          _id: { $dateToString: { format: '%Y-%m', date: '$paidAt' } },
          total: { $sum: '$finalAmount' }
        }
      },
      { $sort: { _id: -1 } },
      { $limit: 12 }
    ]);

    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalServices = await Service.countDocuments();
    const totalPayments = await Payment.countDocuments({ status: 'completed' });

    // Service wise orders
    const serviceWiseOrders = await Order.aggregate([
      { $group: { 
          _id: '$serviceId',
          count: { $sum: 1 },
          revenue: { $sum: '$finalAmount' }
        }
      },
      { $lookup: {
          from: 'services',
          localField: '_id',
          foreignField: '_id',
          as: 'service'
        }
      }
    ]);

    // Recent orders
    const recentOrders = await Order.find()
      .populate('userId')
      .populate('serviceId')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalOrders,
      completedOrders,
      pendingOrders,
      processingOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      monthlyRevenue,
      totalUsers,
      totalServices,
      totalPayments,
      serviceWiseOrders,
      recentOrders,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all orders
router.get('/orders', async (req, res) => {
  try {
    const { status, paymentStatus, startDate, endDate } = req.query;
    let filter = {};

    if (status) filter.status = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;
    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const orders = await Order.find(filter)
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
    const service = await Service.findById(order.serviceId);
    const user = await User.findById(order.userId);

    // Send status update notifications
    if (req.body.status && req.body.status !== order.status) {
      await sendOrderStatusUpdateEmail(order, service, user, req.body.status);
      await sendOrderNotification(order, req.body.status);
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get users analytics
router.get('/users/analytics', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const activeUsers = await User.countDocuments({
      role: 'user',
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    });

    const userSignups = await User.aggregate([
      { $match: { role: 'user' } },
      { $group: { 
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: -1 } },
      { $limit: 12 }
    ]);

    res.json({ totalUsers, activeUsers, userSignups });
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