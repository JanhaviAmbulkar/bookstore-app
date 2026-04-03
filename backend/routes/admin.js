const express = require('express');
const { protect, adminOnly } = require('../middleware/auth');
const { successResponse } = require('../utils/response');
const Book = require('../models/Book');
const Order = require('../models/Order');
const RecyclingRequest = require('../models/RecyclingRequest');
const User = require('../models/User');

const router = express.Router();

router.use(protect, adminOnly);

router.get('/stats', async (req, res, next) => {
  try {
    const [
      totalBooks,
      totalUsers,
      totalOrders,
      totalRecyclingRequests,
      pendingOrders,
      pendingRecycling,
      recentOrders,
      orderRevenue,
    ] = await Promise.all([
      Book.countDocuments({ isActive: true }),
      User.countDocuments({ role: 'user' }),
      Order.countDocuments(),
      RecyclingRequest.countDocuments(),
      Order.countDocuments({ orderStatus: 'Pending' }),
      RecyclingRequest.countDocuments({ status: 'Pending' }),
      Order.find().sort({ createdAt: -1 }).limit(5).populate('user', 'name email'),
      Order.aggregate([
        { $match: { orderStatus: { $ne: 'Cancelled' } } },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } },
      ]),
    ]);

    const totalRevenue = orderRevenue[0]?.total || 0;

    return successResponse(res, 200, 'Dashboard stats', {
      stats: {
        totalBooks,
        totalUsers,
        totalOrders,
        totalRecyclingRequests,
        pendingOrders,
        pendingRecycling,
        totalRevenue,
      },
      recentOrders,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
