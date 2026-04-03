const mongoose = require('mongoose');

const recyclingRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    numberOfBooks: {
      type: Number,
      required: [true, 'Number of books is required'],
      min: [1, 'At least 1 book is required'],
    },
    condition: {
      type: String,
      required: [true, 'Book condition is required'],
      enum: ['Like New', 'Good', 'Fair', 'Poor'],
    },
    pickupType: {
      type: String,
      required: [true, 'Pickup type is required'],
      enum: ['Pickup', 'Drop-off'],
    },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
    },
    preferredDate: {
      type: Date,
    },
    additionalNotes: String,
    status: {
      type: String,
      enum: ['Pending', 'Scheduled', 'Completed', 'Cancelled'],
      default: 'Pending',
    },
    scheduledDate: Date,
    completedAt: Date,
    // Impact calculated upon completion
    impactCalculated: {
      type: Boolean,
      default: false,
    },
    environmentalImpact: {
      paperSavedKg: { type: Number, default: 0 },
      waterSavedLiters: { type: Number, default: 0 },
      co2ReductionKg: { type: Number, default: 0 },
    },
    // Reward issued
    rewardCouponCode: String,
    adminNotes: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('RecyclingRequest', recyclingRequestSchema);
