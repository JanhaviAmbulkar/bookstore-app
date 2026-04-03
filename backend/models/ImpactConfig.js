const mongoose = require('mongoose');

const impactConfigSchema = new mongoose.Schema(
  {
    // There should only be one document - the global config
    key: { type: String, default: 'global', unique: true },
    paperSavedPerBookKg: { type: Number, default: 0.5 },
    waterSavedPerBookLiters: { type: Number, default: 3.5 },
    co2ReductionPerBookKg: { type: Number, default: 0.8 },
    // Coupon reward settings
    couponDiscountPercent: { type: Number, default: 10 },
    minBooksForCoupon: { type: Number, default: 5 },
    couponValidDays: { type: Number, default: 30 },
    lastUpdatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ImpactConfig', impactConfigSchema);
