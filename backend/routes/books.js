const express = require('express');
const { body } = require('express-validator');
const {
  getBooks, getBook, createBook, updateBook, deleteBook, getCategories,
} = require('../controllers/bookController');
const { protect, adminOnly } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

const bookValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('author').trim().notEmpty().withMessage('Author is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('price').isFloat({ min: 0 }).withMessage('Valid price is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('stock').isInt({ min: 0 }).withMessage('Valid stock is required'),
];

router.get('/categories', getCategories);
router.get('/', getBooks);
router.get('/:id', getBook);

// Admin only
router.post('/', protect, adminOnly, bookValidation, validate, createBook);
router.put('/:id', protect, adminOnly, updateBook);
router.delete('/:id', protect, adminOnly, deleteBook);

module.exports = router;
