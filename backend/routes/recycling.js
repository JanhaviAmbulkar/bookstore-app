const express = require('express');
const { body } = require('express-validator');
const {
  submitRequest, getMyRequests, getRequest, getAllRequests, updateRequestStatus,
  getCompanies, getCompany, createCompany, updateCompany, deleteCompany,
  sendContactMessage, getImpactConfig, updateImpactConfig,
} = require('../controllers/recyclingController');
const { protect, adminOnly } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

// Impact config (public read, admin write)
router.get('/config', getImpactConfig);
router.put('/config', protect, adminOnly, updateImpactConfig);

// Companies (public read)
router.get('/companies', getCompanies);
router.get('/companies/:id', getCompany);
router.post('/companies/:id/contact', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('message').trim().notEmpty().withMessage('Message is required'),
], validate, sendContactMessage);

// Admin - company management
router.post('/companies', protect, adminOnly, createCompany);
router.put('/companies/:id', protect, adminOnly, updateCompany);
router.delete('/companies/:id', protect, adminOnly, deleteCompany);

// Requests (protected)
router.use(protect);

router.post(
  '/requests',
  [
    body('numberOfBooks').isInt({ min: 1 }).withMessage('Number of books must be at least 1'),
    body('condition').notEmpty().withMessage('Book condition is required'),
    body('pickupType').notEmpty().withMessage('Pickup type is required'),
    body('address.street').notEmpty().withMessage('Street address is required'),
    body('address.city').notEmpty().withMessage('City is required'),
    body('address.state').notEmpty().withMessage('State is required'),
    body('address.pincode').notEmpty().withMessage('Pincode is required'),
  ],
  validate,
  submitRequest
);

router.get('/requests/my', getMyRequests);
router.get('/requests/:id', getRequest);

// Admin - request management
router.get('/requests', adminOnly, getAllRequests);
router.put('/requests/:id/status', adminOnly, updateRequestStatus);

module.exports = router;
