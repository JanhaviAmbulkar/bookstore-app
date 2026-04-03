require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');
const User = require('../models/User');
const Book = require('../models/Book');
const RecyclingCompany = require('../models/RecyclingCompany');
const ImpactConfig = require('../models/ImpactConfig');

const books = [
  {
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    description: 'A classic novel set in the Jazz Age, exploring themes of wealth, class, love, and the American Dream through the story of Jay Gatsby.',
    price: 299,
    originalPrice: 399,
    image: 'https://covers.openlibrary.org/b/id/8432553-L.jpg',
    category: 'Fiction',
    stock: 25,
    isbn: '978-0-7432-7356-5',
    publisher: 'Scribner',
    publishedYear: 1925,
    pages: 180,
    rating: 4.5,
    numReviews: 1289,
    isFeatured: true,
  },
  {
    title: 'Atomic Habits',
    author: 'James Clear',
    description: 'An easy and proven way to build good habits and break bad ones. Tiny changes, remarkable results.',
    price: 499,
    originalPrice: 599,
    image: 'https://covers.openlibrary.org/b/id/10527843-L.jpg',
    category: 'Self-Help',
    stock: 50,
    isbn: '978-0-7352-1129-2',
    publisher: 'Avery',
    publishedYear: 2018,
    pages: 320,
    rating: 4.8,
    numReviews: 3421,
    isFeatured: true,
  },
  {
    title: 'Sapiens: A Brief History of Humankind',
    author: 'Yuval Noah Harari',
    description: 'A groundbreaking narrative of humanity\'s creation and evolution that explores how biology and history have defined us.',
    price: 449,
    originalPrice: 549,
    image: 'https://covers.openlibrary.org/b/id/8739161-L.jpg',
    category: 'History',
    stock: 30,
    isbn: '978-0-06-231609-7',
    publisher: 'Harper',
    publishedYear: 2015,
    pages: 443,
    rating: 4.7,
    numReviews: 2876,
    isFeatured: true,
  },
  {
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    description: 'A Pulitzer Prize-winning masterwork of honor and injustice in the deep South—and the heroism of one man in the face of blind and violent hatred.',
    price: 349,
    image: 'https://covers.openlibrary.org/b/id/8739132-L.jpg',
    category: 'Fiction',
    stock: 20,
    isbn: '978-0-06-112008-4',
    publisher: 'HarperCollins',
    publishedYear: 1960,
    pages: 281,
    rating: 4.6,
    numReviews: 1954,
    isFeatured: false,
  },
  {
    title: 'The Lean Startup',
    author: 'Eric Ries',
    description: 'How constant innovation creates radically successful businesses. A new approach to continuous innovation.',
    price: 399,
    originalPrice: 499,
    image: 'https://covers.openlibrary.org/b/id/7897156-L.jpg',
    category: 'Business',
    stock: 40,
    isbn: '978-0-30-788891-7',
    publisher: 'Crown Business',
    publishedYear: 2011,
    pages: 336,
    rating: 4.4,
    numReviews: 1632,
    isFeatured: true,
  },
  {
    title: 'Clean Code',
    author: 'Robert C. Martin',
    description: 'A handbook of agile software craftsmanship. Even bad code can function, but if code isn\'t clean, it can bring a development organization to its knees.',
    price: 599,
    image: 'https://covers.openlibrary.org/b/id/8741282-L.jpg',
    category: 'Technology',
    stock: 35,
    isbn: '978-0-13-235088-4',
    publisher: 'Prentice Hall',
    publishedYear: 2008,
    pages: 431,
    rating: 4.7,
    numReviews: 2103,
    isFeatured: false,
  },
  {
    title: 'Harry Potter and the Philosopher\'s Stone',
    author: 'J.K. Rowling',
    description: 'The first novel in the Harry Potter series, following a young wizard on his first year at Hogwarts School of Witchcraft and Wizardry.',
    price: 399,
    originalPrice: 450,
    image: 'https://covers.openlibrary.org/b/id/10110415-L.jpg',
    category: 'Fantasy',
    stock: 60,
    isbn: '978-0-7475-3269-9',
    publisher: 'Bloomsbury',
    publishedYear: 1997,
    pages: 223,
    rating: 4.9,
    numReviews: 5621,
    isFeatured: true,
  },
  {
    title: 'The Psychology of Money',
    author: 'Morgan Housel',
    description: 'Timeless lessons on wealth, greed, and happiness. Doing well with money has little to do with how smart you are.',
    price: 349,
    originalPrice: 399,
    image: 'https://covers.openlibrary.org/b/id/10395602-L.jpg',
    category: 'Business',
    stock: 45,
    isbn: '978-0-85-719769-9',
    publisher: 'Harriman House',
    publishedYear: 2020,
    pages: 256,
    rating: 4.8,
    numReviews: 2987,
    isFeatured: true,
  },
  {
    title: 'Dune',
    author: 'Frank Herbert',
    description: 'Set in the distant future amidst a feudal interstellar society, Dune tells the story of young Paul Atreides on the desert planet Arrakis.',
    price: 449,
    image: 'https://covers.openlibrary.org/b/id/8442981-L.jpg',
    category: 'Fiction',
    stock: 28,
    isbn: '978-0-44-101718-8',
    publisher: 'Ace',
    publishedYear: 1965,
    pages: 412,
    rating: 4.6,
    numReviews: 1876,
    isFeatured: false,
  },
  {
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    description: 'A magical story about following your dream. Santiago, an Andalusian shepherd boy, journeys from Spain to the Egyptian desert in search of treasure.',
    price: 249,
    originalPrice: 299,
    image: 'https://covers.openlibrary.org/b/id/8356852-L.jpg',
    category: 'Fiction',
    stock: 55,
    isbn: '978-0-06-231500-7',
    publisher: 'HarperOne',
    publishedYear: 1988,
    pages: 197,
    rating: 4.5,
    numReviews: 4213,
    isFeatured: false,
  },
  {
    title: 'Introduction to Algorithms',
    author: 'Thomas H. Cormen',
    description: 'A comprehensive introduction to the modern study of computer algorithms. Widely used as a textbook for algorithms courses at universities.',
    price: 899,
    image: 'https://covers.openlibrary.org/b/id/8284985-L.jpg',
    category: 'Academic',
    stock: 15,
    isbn: '978-0-26-204630-5',
    publisher: 'MIT Press',
    publishedYear: 2009,
    pages: 1292,
    rating: 4.7,
    numReviews: 876,
    isFeatured: false,
  },
  {
    title: 'Thinking, Fast and Slow',
    author: 'Daniel Kahneman',
    description: 'A groundbreaking book on the two systems that drive the way we think and make choices.',
    price: 399,
    originalPrice: 499,
    image: 'https://covers.openlibrary.org/b/id/7965574-L.jpg',
    category: 'Non-Fiction',
    stock: 32,
    isbn: '978-0-37-453355-7',
    publisher: 'Farrar, Straus and Giroux',
    publishedYear: 2011,
    pages: 499,
    rating: 4.6,
    numReviews: 2341,
    isFeatured: false,
  },
];

const recyclingCompanies = [
  {
    name: 'GreenPages Recycling',
    description: 'Leading book recycling company dedicated to giving old books a new life.',
    email: 'contact@greenpages.in',
    phone: '+91 98765 43210',
    website: 'https://greenpages.in',
    address: { street: '12 Eco Park Road', city: 'Pune', state: 'Maharashtra', pincode: '411001' },
    specializations: ['Book drives', 'School donations', 'Paper recycling'],
    isActive: true,
  },
  {
    name: 'EcoReads Foundation',
    description: 'Non-profit organization that redistributes recycled books to underprivileged communities.',
    email: 'hello@ecoreads.org',
    phone: '+91 87654 32109',
    website: 'https://ecoreads.org',
    address: { street: '45 Green Street', city: 'Mumbai', state: 'Maharashtra', pincode: '400001' },
    specializations: ['Community libraries', 'Rural schools', 'Environmental education'],
    isActive: true,
  },
  {
    name: 'BookCycle India',
    description: 'Pan-India book recycling network with 50+ drop-off centers across major cities.',
    email: 'info@bookcycle.in',
    phone: '+91 76543 21098',
    website: 'https://bookcycle.in',
    address: { street: '7 Recycleway', city: 'Bengaluru', state: 'Karnataka', pincode: '560001' },
    specializations: ['Mass recycling', 'Corporate drives', 'E-waste + paper'],
    isActive: true,
  },
];

const seedData = async () => {
  await connectDB();

  try {
    console.log('🗑️  Clearing existing data...');
    await Promise.all([
      User.deleteMany({}),
      Book.deleteMany({}),
      RecyclingCompany.deleteMany({}),
      ImpactConfig.deleteMany({}),
    ]);

    console.log('👤 Creating admin user...');
    await User.create({
      name: 'Admin User',
      email: 'admin@bookstore.com',
      password: 'admin123',
      role: 'admin',
    });

    console.log('👤 Creating test user...');
    await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      role: 'user',
    });

    console.log('📚 Seeding books...');
    await Book.insertMany(books);

    console.log('♻️  Seeding recycling companies...');
    await RecyclingCompany.insertMany(recyclingCompanies);

    console.log('⚙️  Creating impact config...');
    await ImpactConfig.create({ key: 'global' });

    console.log('\n✅ Database seeded successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Admin:  admin@bookstore.com / admin123');
    console.log('User:   john@example.com / password123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedData();
