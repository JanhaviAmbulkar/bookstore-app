const { registerUser, loginUser } = require('../services/authService');
const { successResponse, errorResponse } = require('../utils/response');

const register = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;
    const result = await registerUser({ name, email, password, phone });
    return successResponse(res, 201, 'Registration successful', result);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await loginUser({ email, password });
    return successResponse(res, 200, 'Login successful', result);
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res) => {
  return successResponse(res, 200, 'User fetched', { user: req.user });
};

module.exports = { register, login, getMe };
