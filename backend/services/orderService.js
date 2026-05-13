const Order = require('../models/Order');
const Book = require('../models/Book');
const { clearCart } = require('./cartService');

const SHIPPING_THRESHOLD = 500;
const SHIPPING_CHARGE = 50;

const placeOrder = async (userId, { cartItems, shippingAddress, orderNotes }) => {
  if (!cartItems || cartItems.length === 0) {
    const error = new Error('No items in order');
    error.statusCode = 400;
    throw error;
  }

  // Validate stock and build order items
  const orderItems = [];
  let itemsPrice = 0;

  for (const item of cartItems) {
    const book = await Book.findById(item.book);
    if (!book || !book.isActive) {
      const error = new Error(`Book "${item.title || item.book}" is no longer available`);
      error.statusCode = 400;
      throw error;
    }
    if (book.stock < item.quantity) {
      const error = new Error(`Insufficient stock for "${book.title}". Only ${book.stock} available.`);
      error.statusCode = 400;
      throw error;
    }

    orderItems.push({
      book: book._id,
      title: book.title,
      author: book.author,
      image: book.image,
      quantity: item.quantity,
      price: book.price,
    });
    itemsPrice += book.price * item.quantity;
  }

  const shippingPrice = itemsPrice >= SHIPPING_THRESHOLD ? 0 : SHIPPING_CHARGE;
  const totalPrice = itemsPrice + shippingPrice;

  const order = await Order.create({
    user: userId,
    orderItems,
    shippingAddress,
    paymentMethod: 'Cash on Delivery',
    itemsPrice,
    shippingPrice,
    totalPrice,
    orderNotes,
  });

  // Deduct stock
  for (const item of orderItems) {
    await Book.findByIdAndUpdate(item.book, {
      $inc: { stock: -item.quantity },
    });
  }

  // Clear user's cart
  await clearCart(userId);

  return order;
};

const getUserOrders = async (userId) => {
  return Order.find({ user: userId })
    .sort({ createdAt: -1 })
    .populate('orderItems.book', 'title image');
};

const getOrderById = async (orderId, userId, role) => {
  const query = { _id: orderId };
  if (role !== 'admin') query.user = userId;

  const order = await Order.findOne(query).populate('user', 'name email');
  if (!order) {
    const error = new Error('Order not found');
    error.statusCode = 404;
    throw error;
  }
  return order;
};

const getAllOrders = async (query) => {
  const { page = 1, limit = 20, status } = query;
  const filter = {};
  if (status) filter.orderStatus = status;

  const skip = (Number(page) - 1) * Number(limit);
  const [orders, total] = await Promise.all([
    Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate('user', 'name email'),
    Order.countDocuments(filter),
  ]);

  return {
    orders,
    pagination: {
      currentPage: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      total,
    },
  };
};

const updateOrderStatus = async (orderId, status) => {
  const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
  if (!validStatuses.includes(status)) {
    const error = new Error('Invalid status');
    error.statusCode = 400;
    throw error;
  }

  const update = { orderStatus: status };
  if (status === 'Delivered') {
    update.isDelivered = true;
    update.deliveredAt = new Date();
  }

  const order = await Order.findByIdAndUpdate(orderId, update, { new: true });
  if (!order) {
    const error = new Error('Order not found');
    error.statusCode = 404;
    throw error;
  }
  return order;
};

module.exports = { placeOrder, getUserOrders, getOrderById, getAllOrders, updateOrderStatus };
