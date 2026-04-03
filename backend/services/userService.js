const User = require('../models/User');

const getProfile = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }
  return user;
};

const updateProfile = async (userId, data) => {
  const { name, phone, address } = data;
  const user = await User.findByIdAndUpdate(
    userId,
    { name, phone, address },
    { new: true, runValidators: true }
  );
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }
  return user;
};

const changePassword = async (userId, { currentPassword, newPassword }) => {
  const user = await User.findById(userId).select('+password');
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    const error = new Error('Current password is incorrect');
    error.statusCode = 400;
    throw error;
  }
  user.password = newPassword;
  await user.save();
  return { message: 'Password updated successfully' };
};

const getAllUsers = async (query) => {
  const { page = 1, limit = 20, role } = query;
  const filter = {};
  if (role) filter.role = role;

  const skip = (Number(page) - 1) * Number(limit);
  const [users, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    User.countDocuments(filter),
  ]);

  return {
    users,
    pagination: {
      currentPage: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      total,
    },
  };
};

const toggleUserStatus = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }
  user.isActive = !user.isActive;
  await user.save();
  return user;
};

module.exports = { getProfile, updateProfile, changePassword, getAllUsers, toggleUserStatus };
