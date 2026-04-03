const express = require('express');
const { body } = require('express-validator');
const {
  placeOrder, getMyOrders, getOrder, getAllOrders, updateOrderStatus,
} = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

router.use(protect);

router.post(
  '/',
  [
    body('cartItems').isArray({ min: 1 }).withMessage('Cart items are required'),
    body('shippingAddress.fullName').notEmpty().withMessage('Full name is required'),
    body('shippingAddress.phone').notEmpty().withMessage('Phone is required'),
    body('shippingAddress.street').notEmpty().withMessage('Street is required'),
    body('shippingAddress.city').notEmpty().withMessage('City is required'),
    body('shippingAddress.state').notEmpty().withMessage('State is required'),
    body('shippingAddress.pincode').notEmpty().withMessage('Pincode is required'),
  ],
  validate,
  placeOrder
);

router.get('/my-orders', getMyOrders);
router.get('/:id', getOrder);

// Admin routes
router.get('/', adminOnly, getAllOrders);
router.put('/:id/status', adminOnly, updateOrderStatus);

module.exports = router;
