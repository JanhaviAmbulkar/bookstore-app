const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Book title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    author: {
      type: String,
      required: [true, 'Author is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    originalPrice: {
      type: Number,
      min: [0, 'Original price cannot be negative'],
    },
    image: {
      type: String,
      default: 'https://via.placeholder.com/300x400?text=Book+Cover',
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Fiction',
        'Non-Fiction',
        'Science',
        'Technology',
        'History',
        'Biography',
        'Self-Help',
        'Children',
        'Romance',
        'Mystery',
        'Fantasy',
        'Horror',
        'Business',
        'Academic',
        'Other',
      ],
    },
    stock: {
      type: Number,
      required: [true, 'Stock is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    isbn: {
      type: String,
      trim: true,
    },
    publisher: {
      type: String,
      trim: true,
    },
    publishedYear: {
      type: Number,
    },
    language: {
      type: String,
      default: 'English',
    },
    pages: {
      type: Number,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    // Per-book environmental impact constants (overrides global defaults)
    recyclingImpact: {
      paperSavedKg: { type: Number },
      waterSavedLiters: { type: Number },
      co2ReductionKg: { type: Number },
    },
  },
  { timestamps: true }
);

// Index for search
bookSchema.index({ title: 'text', author: 'text', description: 'text' });

module.exports = mongoose.model('Book', bookSchema);
