const Cart = require('../models/Cart');
const Book = require('../models/Book');

const getCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId }).populate(
    'items.book',
    'title author image price stock isActive'
  );
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }
  return cart;
};

const addToCart = async (userId, bookId, quantity = 1) => {
  const book = await Book.findOne({ _id: bookId, isActive: true });
  if (!book) {
    const error = new Error('Book not found');
    error.statusCode = 404;
    throw error;
  }
  if (book.stock < quantity) {
    const error = new Error(`Only ${book.stock} copies available`);
    error.statusCode = 400;
    throw error;
  }

  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = new Cart({ user: userId, items: [] });
  }

  const existingIndex = cart.items.findIndex(
    (item) => item.book.toString() === bookId
  );

  if (existingIndex > -1) {
    const newQty = cart.items[existingIndex].quantity + quantity;
    if (newQty > book.stock) {
      const error = new Error(`Only ${book.stock} copies available`);
      error.statusCode = 400;
      throw error;
    }
    cart.items[existingIndex].quantity = newQty;
    cart.items[existingIndex].price = book.price;
  } else {
    cart.items.push({ book: bookId, quantity, price: book.price });
  }

  await cart.save();
  return cart.populate('items.book', 'title author image price stock isActive');
};

const updateCartItem = async (userId, bookId, quantity) => {
  if (quantity < 1) {
    return removeFromCart(userId, bookId);
  }

  const book = await Book.findById(bookId);
  if (!book) {
    const error = new Error('Book not found');
    error.statusCode = 404;
    throw error;
  }
  if (book.stock < quantity) {
    const error = new Error(`Only ${book.stock} copies available`);
    error.statusCode = 400;
    throw error;
  }

  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    const error = new Error('Cart not found');
    error.statusCode = 404;
    throw error;
  }

  const itemIndex = cart.items.findIndex(
    (item) => item.book.toString() === bookId
  );
  if (itemIndex === -1) {
    const error = new Error('Item not in cart');
    error.statusCode = 404;
    throw error;
  }

  cart.items[itemIndex].quantity = quantity;
  cart.items[itemIndex].price = book.price;
  await cart.save();
  return cart.populate('items.book', 'title author image price stock isActive');
};

const removeFromCart = async (userId, bookId) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    const error = new Error('Cart not found');
    error.statusCode = 404;
    throw error;
  }
  cart.items = cart.items.filter((item) => item.book.toString() !== bookId);
  await cart.save();
  return cart.populate('items.book', 'title author image price stock isActive');
};

const clearCart = async (userId) => {
  const cart = await Cart.findOne({ user: userId });
  if (cart) {
    cart.items = [];
    await cart.save();
  }
  return cart;
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
