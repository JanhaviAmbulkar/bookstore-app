const express = require('express');
const { body } = require('express-validator');
const {
  getCart, addToCart, updateCartItem, removeFromCart, clearCart,
} = require('../controllers/cartController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

router.use(protect);

router.get('/', getCart);
router.post(
  '/add',
  [
    body('bookId').notEmpty().withMessage('Book ID is required'),
    body('quantity').optional().isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  ],
  validate,
  addToCart
);
router.put(
  '/:bookId',
  [body('quantity').isInt({ min: 0 }).withMessage('Quantity must be 0 or more')],
  validate,
  updateCartItem
);
router.delete('/clear', clearCart);
router.delete('/:bookId', removeFromCart);

module.exports = router;
