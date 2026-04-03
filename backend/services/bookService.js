const Book = require('../models/Book');

const getBooks = async (query) => {
  const {
    search,
    category,
    minPrice,
    maxPrice,
    page = 1,
    limit = 12,
    sortBy = 'createdAt',
    order = 'desc',
    featured,
  } = query;

  const filter = { isActive: true };

  // Text search
  if (search) {
    filter.$text = { $search: search };
  }

  // Category filter
  if (category && category !== 'All') {
    filter.category = category;
  }

  // Price range filter
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  // Featured filter
  if (featured === 'true') {
    filter.isFeatured = true;
  }

  const skip = (Number(page) - 1) * Number(limit);
  const sortOrder = order === 'asc' ? 1 : -1;

  const [books, total] = await Promise.all([
    Book.find(filter)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(Number(limit)),
    Book.countDocuments(filter),
  ]);

  return {
    books,
    pagination: {
      currentPage: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      totalBooks: total,
      hasNext: skip + books.length < total,
      hasPrev: Number(page) > 1,
    },
  };
};

const getBookById = async (id) => {
  const book = await Book.findOne({ _id: id, isActive: true });
  if (!book) {
    const error = new Error('Book not found');
    error.statusCode = 404;
    throw error;
  }
  return book;
};

const createBook = async (bookData) => {
  return await Book.create(bookData);
};

const updateBook = async (id, bookData) => {
  const book = await Book.findByIdAndUpdate(id, bookData, {
    new: true,
    runValidators: true,
  });
  if (!book) {
    const error = new Error('Book not found');
    error.statusCode = 404;
    throw error;
  }
  return book;
};

const deleteBook = async (id) => {
  const book = await Book.findByIdAndUpdate(id, { isActive: false }, { new: true });
  if (!book) {
    const error = new Error('Book not found');
    error.statusCode = 404;
    throw error;
  }
  return book;
};

const getCategories = () => {
  return Book.schema.path('category').enumValues;
};

module.exports = { getBooks, getBookById, createBook, updateBook, deleteBook, getCategories };
