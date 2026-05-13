const bookService = require('../services/bookService');
const { successResponse } = require('../utils/response');

const getBooks = async (req, res, next) => {
  try {
    const result = await bookService.getBooks(req.query);
    return successResponse(res, 200, 'Books fetched', result);
  } catch (error) {
    next(error);
  }
};

const getBook = async (req, res, next) => {
  try {
    const book = await bookService.getBookById(req.params.id);
    return successResponse(res, 200, 'Book fetched', { book });
  } catch (error) {
    next(error);
  }
};

const createBook = async (req, res, next) => {
  try {
    const book = await bookService.createBook(req.body);
    return successResponse(res, 201, 'Book created successfully', { book });
  } catch (error) {
    next(error);
  }
};

const updateBook = async (req, res, next) => {
  try {
    const book = await bookService.updateBook(req.params.id, req.body);
    return successResponse(res, 200, 'Book updated successfully', { book });
  } catch (error) {
    next(error);
  }
};

const deleteBook = async (req, res, next) => {
  try {
    await bookService.deleteBook(req.params.id);
    return successResponse(res, 200, 'Book deleted successfully');
  } catch (error) {
    next(error);
  }
};

const getCategories = async (req, res) => {
  const categories = bookService.getCategories();
  return successResponse(res, 200, 'Categories fetched', { categories });
};

module.exports = { getBooks, getBook, createBook, updateBook, deleteBook, getCategories };
