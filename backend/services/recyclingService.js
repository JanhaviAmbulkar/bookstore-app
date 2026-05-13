const RecyclingRequest = require('../models/RecyclingRequest');
const RecyclingCompany = require('../models/RecyclingCompany');
const ImpactConfig = require('../models/ImpactConfig');
const User = require('../models/User');
const { generateCouponCode } = require('../utils/coupon');

const getOrCreateConfig = async () => {
  let config = await ImpactConfig.findOne({ key: 'global' });
  if (!config) {
    config = await ImpactConfig.create({ key: 'global' });
  }
  return config;
};

const submitRequest = async (userId, requestData) => {
  const request = await RecyclingRequest.create({
    user: userId,
    ...requestData,
  });
  return request;
};

const getUserRequests = async (userId) => {
  return RecyclingRequest.find({ user: userId }).sort({ createdAt: -1 });
};

const getRequestById = async (requestId, userId, role) => {
  const query = { _id: requestId };
  if (role !== 'admin') query.user = userId;

  const request = await RecyclingRequest.findOne(query).populate('user', 'name email');
  if (!request) {
    const error = new Error('Recycling request not found');
    error.statusCode = 404;
    throw error;
  }
  return request;
};

const getAllRequests = async (query) => {
  const { page = 1, limit = 20, status } = query;
  const filter = {};
  if (status) filter.status = status;

  const skip = (Number(page) - 1) * Number(limit);
  const [requests, total] = await Promise.all([
    RecyclingRequest.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate('user', 'name email'),
    RecyclingRequest.countDocuments(filter),
  ]);

  return {
    requests,
    pagination: {
      currentPage: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      total,
    },
  };
};

const updateRequestStatus = async (requestId, { status, scheduledDate, adminNotes }) => {
  const request = await RecyclingRequest.findById(requestId);
  if (!request) {
    const error = new Error('Recycling request not found');
    error.statusCode = 404;
    throw error;
  }

  const validStatuses = ['Pending', 'Scheduled', 'Completed', 'Cancelled'];
  if (!validStatuses.includes(status)) {
    const error = new Error('Invalid status');
    error.statusCode = 400;
    throw error;
  }

  request.status = status;
  if (scheduledDate) request.scheduledDate = scheduledDate;
  if (adminNotes) request.adminNotes = adminNotes;

  // Calculate impact when marking as Completed
  if (status === 'Completed' && !request.impactCalculated) {
    const config = await getOrCreateConfig();
    const n = request.numberOfBooks;

    const paperSaved = parseFloat((n * config.paperSavedPerBookKg).toFixed(2));
    const waterSaved = parseFloat((n * config.waterSavedPerBookLiters).toFixed(2));
    const co2Reduction = parseFloat((n * config.co2ReductionPerBookKg).toFixed(2));

    request.environmentalImpact = {
      paperSavedKg: paperSaved,
      waterSavedLiters: waterSaved,
      co2ReductionKg: co2Reduction,
    };
    request.impactCalculated = true;
    request.completedAt = new Date();

    // Update user's cumulative impact
    await User.findByIdAndUpdate(request.user, {
      $inc: {
        'environmentalImpact.totalBooksRecycled': n,
        'environmentalImpact.paperSavedKg': paperSaved,
        'environmentalImpact.waterSavedLiters': waterSaved,
        'environmentalImpact.co2ReductionKg': co2Reduction,
      },
    });

    // Issue coupon if eligible
    if (n >= config.minBooksForCoupon) {
      const couponCode = generateCouponCode();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + config.couponValidDays);

      await User.findByIdAndUpdate(request.user, {
        $push: {
          coupons: {
            code: couponCode,
            discount: config.couponDiscountPercent,
            expiresAt,
          },
        },
      });

      request.rewardCouponCode = couponCode;
    }
  }

  await request.save();
  return request;
};

// Recycling Companies
const getCompanies = async () => {
  return RecyclingCompany.find({ isActive: true }).select('-contactMessages');
};

const getCompanyById = async (id) => {
  const company = await RecyclingCompany.findById(id).select('-contactMessages');
  if (!company) {
    const error = new Error('Company not found');
    error.statusCode = 404;
    throw error;
  }
  return company;
};

const createCompany = async (data) => {
  return RecyclingCompany.create(data);
};

const updateCompany = async (id, data) => {
  const company = await RecyclingCompany.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!company) {
    const error = new Error('Company not found');
    error.statusCode = 404;
    throw error;
  }
  return company;
};

const deleteCompany = async (id) => {
  const company = await RecyclingCompany.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true }
  );
  if (!company) {
    const error = new Error('Company not found');
    error.statusCode = 404;
    throw error;
  }
  return company;
};

const sendContactMessage = async (companyId, { name, email, message }) => {
  const company = await RecyclingCompany.findById(companyId);
  if (!company) {
    const error = new Error('Company not found');
    error.statusCode = 404;
    throw error;
  }
  company.contactMessages.push({ senderName: name, senderEmail: email, message });
  await company.save();
  return { success: true };
};

const getImpactConfig = async () => {
  return getOrCreateConfig();
};

const updateImpactConfig = async (data, adminId) => {
  const config = await ImpactConfig.findOneAndUpdate(
    { key: 'global' },
    { ...data, lastUpdatedBy: adminId },
    { new: true, upsert: true, runValidators: true }
  );
  return config;
};

module.exports = {
  submitRequest,
  getUserRequests,
  getRequestById,
  getAllRequests,
  updateRequestStatus,
  getCompanies,
  getCompanyById,
  createCompany,
  updateCompany,
  deleteCompany,
  sendContactMessage,
  getImpactConfig,
  updateImpactConfig,
};
