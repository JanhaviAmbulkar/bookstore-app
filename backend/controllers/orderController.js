const orderService = require('../services/orderService');
const { successResponse } = require('../utils/response');

const placeOrder = async (req, res, next) => {
  try {
    const order = await orderService.placeOrder(req.user._id, req.body);
    return successResponse(res, 201, 'Order placed successfully', { order });
  } catch (error) {
    next(error);
  }
};

const getMyOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getUserOrders(req.user._id);
    return successResponse(res, 200, 'Orders fetched', { orders });
  } catch (error) {
    next(error);
  }
};

const getOrder = async (req, res, next) => {
  try {
    const order = await orderService.getOrderById(
      req.params.id,
      req.user._id,
      req.user.role
    );
    return successResponse(res, 200, 'Order fetched', { order });
  } catch (error) {
    next(error);
  }
};

const getAllOrders = async (req, res, next) => {
  try {
    const result = await orderService.getAllOrders(req.query);
    return successResponse(res, 200, 'All orders fetched', result);
  } catch (error) {
    next(error);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const order = await orderService.updateOrderStatus(
      req.params.id,
      req.body.status
    );
    return successResponse(res, 200, 'Order status updated', { order });
  } catch (error) {
    next(error);
  }
};

module.exports = { placeOrder, getMyOrders, getOrder, getAllOrders, updateOrderStatus };
