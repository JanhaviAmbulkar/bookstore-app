require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const authRoutes      = require('./routes/auth');
const bookRoutes      = require('./routes/books');
const cartRoutes      = require('./routes/cart');
const orderRoutes     = require('./routes/orders');
const recyclingRoutes = require('./routes/recycling');
const userRoutes      = require('./routes/users');
const adminRoutes     = require('./routes/admin');

const app = express();
connectDB();

// FIX 2: CORS - allow Vercel frontend to call this Render backend.
// Old code only allowed CLIENT_URL || 'localhost:3000' which blocked Vercel.
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://bookstore-app-delta.vercel.app',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (Postman, curl, server-to-server)
    if (!origin) return callback(null, true);
    // Allow any *.vercel.app or *.onrender.com domain automatically
    if (
      allowedOrigins.includes(origin) ||
      /\.vercel\.app$/.test(origin) ||
      /\.onrender\.com$/.test(origin)
    ) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Bookstore API is running', timestamp: new Date() });
});

app.use('/api/auth',      authRoutes);
app.use('/api/books',     bookRoutes);
app.use('/api/cart',      cartRoutes);
app.use('/api/orders',    orderRoutes);
app.use('/api/recycling', recyclingRoutes);
app.use('/api/users',     userRoutes);
app.use('/api/admin',     adminRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
  console.log(`📖 API: http://localhost:${PORT}/api`);
});

module.exports = app;
