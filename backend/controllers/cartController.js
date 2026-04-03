const cartService = require('../services/cartService');
const { successResponse } = require('../utils/response');

const getCart = async (req, res, next) => {
  try {
    const cart = await cartService.getCart(req.user._id);
    return successResponse(res, 200, 'Cart fetched', { cart });
  } catch (error) {
    next(error);
  }
};

const addToCart = async (req, res, next) => {
  try {
    const { bookId, quantity } = req.body;
    const cart = await cartService.addToCart(req.user._id, bookId, quantity);
    return successResponse(res, 200, 'Item added to cart', { cart });
  } catch (error) {
    next(error);
  }
};

const updateCartItem = async (req, res, next) => {
  try {
    const { bookId } = req.params;
    const { quantity } = req.body;
    const cart = await cartService.updateCartItem(req.user._id, bookId, quantity);
    return successResponse(res, 200, 'Cart updated', { cart });
  } catch (error) {
    next(error);
  }
};

const removeFromCart = async (req, res, next) => {
  try {
    const { bookId } = req.params;
    const cart = await cartService.removeFromCart(req.user._id, bookId);
    return successResponse(res, 200, 'Item removed from cart', { cart });
  } catch (error) {
    next(error);
  }
};

const clearCart = async (req, res, next) => {
  try {
    await cartService.clearCart(req.user._id);
    return successResponse(res, 200, 'Cart cleared');
  } catch (error) {
    next(error);
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
