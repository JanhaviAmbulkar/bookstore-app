const express = require('express');
const { body } = require('express-validator');
const {
  getProfile, updateProfile, changePassword, getAllUsers, toggleUserStatus,
} = require('../controllers/userController');
const { protect, adminOnly } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

router.use(protect);

router.get('/profile', getProfile);
router.put('/profile', [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
], validate, updateProfile);
router.put('/change-password', [
  body('currentPassword').notEmpty().withMessage('Current password required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 chars'),
], validate, changePassword);

// Admin routes
router.get('/', adminOnly, getAllUsers);
router.put('/:id/toggle-status', adminOnly, toggleUserStatus);

module.exports = router;
