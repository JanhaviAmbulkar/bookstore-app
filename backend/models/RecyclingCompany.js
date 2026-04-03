const mongoose = require('mongoose');

const recyclingCompanySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone is required'],
    },
    website: String,
    address: {
      street: String,
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: String,
    },
    logo: String,
    isActive: { type: Boolean, default: true },
    specializations: [String], // e.g., ['Paper recycling', 'Book drives']
    contactMessages: [
      {
        senderName: String,
        senderEmail: String,
        message: String,
        sentAt: { type: Date, default: Date.now },
        isRead: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('RecyclingCompany', recyclingCompanySchema);
