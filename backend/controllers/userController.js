const userService = require('../services/userService');
const { successResponse } = require('../utils/response');

const getProfile = async (req, res, next) => {
  try {
    const user = await userService.getProfile(req.user._id);
    return successResponse(res, 200, 'Profile fetched', { user });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const user = await userService.updateProfile(req.user._id, req.body);
    return successResponse(res, 200, 'Profile updated', { user });
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const result = await userService.changePassword(req.user._id, req.body);
    return successResponse(res, 200, result.message);
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const result = await userService.getAllUsers(req.query);
    return successResponse(res, 200, 'Users fetched', result);
  } catch (error) {
    next(error);
  }
};

const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await userService.toggleUserStatus(req.params.id);
    return successResponse(res, 200, `User ${user.isActive ? 'activated' : 'deactivated'}`, { user });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProfile, updateProfile, changePassword, getAllUsers, toggleUserStatus };
