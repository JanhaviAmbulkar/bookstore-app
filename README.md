# 📚 PageTurn — Bookstore & Book Recycling System

A full-stack MERN application featuring a complete bookstore e-commerce system with an integrated book recycling program, environmental impact tracking, and a full admin panel.

---

## ✨ Features

### 🛒 Bookstore
- Browse books with search, category filters, price range, and sorting
- Detailed book pages with ratings, metadata, and stock status
- Shopping cart with quantity management
- Cash on Delivery checkout
- Order history with real-time status tracking (Pending → Processing → Shipped → Delivered)
- Free shipping on orders over ₹500

### ♻️ Book Recycling
- Submit recycling requests (pickup or drop-off)
- Track request status (Pending → Scheduled → Completed)
- Automatic environmental impact calculation on completion:
  - Paper saved (kg)
  - Water saved (liters)
  - CO₂ reduction (kg)
- Cumulative impact stored in user profile
- Reward coupons issued for recycling 5+ books
- Recycling partner company directory with contact form

### 👤 User Features
- JWT-based authentication (register/login)
- Profile management with default address
- Password change
- Environmental impact dashboard
- Reward coupon wallet
- Order history

### 🔧 Admin Panel
- Dashboard with key stats (books, users, orders, revenue, recycling)
- Full CRUD for books (create, edit, delete, feature)
- Order management with status updates
- Recycling request management (schedule, complete, add notes)
- Recycling company CRUD
- Environmental impact constants configuration
- Coupon reward settings

---

## 🗂️ Project Structure

```
bookstore/
├── backend/
│   ├── config/          # DB connection
│   ├── controllers/     # Route handlers
│   ├── middleware/       # Auth, validation, error handler
│   ├── models/          # Mongoose schemas
│   ├── routes/          # Express routers
│   ├── services/        # Business logic
│   ├── utils/           # JWT, response helpers, seeder, coupon gen
│   ├── server.js        # Express app entry point
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── api/         # Axios instance + all API modules
    │   ├── components/  # Reusable UI components
    │   ├── context/     # AuthContext, CartContext
    │   └── pages/       # All page components + admin/
    ├── tailwind.config.js
    └── vite.config.js
```

---

## 🚀 Setup & Run

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)

### 1. Backend

```bash
cd backend
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/bookstore_db
JWT_SECRET=your_super_secret_jwt_key_at_least_32_chars
JWT_EXPIRE=7d
NODE_ENV=development
```

```bash
npm install
npm run seed      # Seeds 12 books, admin user, test user, companies
npm run dev       # Starts on http://localhost:5000
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev       # Starts on http://localhost:3000
```

The Vite dev server proxies `/api` → `http://localhost:5000`.

---

## 👥 Demo Accounts

| Role  | Email                   | Password     |
|-------|-------------------------|--------------|
| Admin | admin@bookstore.com     | admin123     |
| User  | john@example.com        | password123  |

---

## 📡 API Reference

### Auth
| Method | Endpoint           | Description       | Auth |
|--------|--------------------|-------------------|------|
| POST   | /api/auth/register | Register user     | ─    |
| POST   | /api/auth/login    | Login             | ─    |
| GET    | /api/auth/me       | Get current user  | ✓    |

### Books
| Method | Endpoint        | Description          | Auth  |
|--------|-----------------|----------------------|-------|
| GET    | /api/books      | Get all (w/ filters) | ─     |
| GET    | /api/books/:id  | Get single book      | ─     |
| GET    | /api/books/categories | Get categories | ─     |
| POST   | /api/books      | Create book          | Admin |
| PUT    | /api/books/:id  | Update book          | Admin |
| DELETE | /api/books/:id  | Delete book          | Admin |

### Cart
| Method | Endpoint          | Description       | Auth |
|--------|-------------------|-------------------|------|
| GET    | /api/cart         | Get user cart     | ✓    |
| POST   | /api/cart/add     | Add item          | ✓    |
| PUT    | /api/cart/:bookId | Update qty        | ✓    |
| DELETE | /api/cart/:bookId | Remove item       | ✓    |
| DELETE | /api/cart/clear   | Clear cart        | ✓    |

### Orders
| Method | Endpoint                | Description        | Auth  |
|--------|-------------------------|--------------------|-------|
| POST   | /api/orders             | Place order (COD)  | ✓     |
| GET    | /api/orders/my-orders   | User's orders      | ✓     |
| GET    | /api/orders/:id         | Single order       | ✓     |
| GET    | /api/orders             | All orders         | Admin |
| PUT    | /api/orders/:id/status  | Update status      | Admin |

### Recycling
| Method | Endpoint                            | Description              | Auth  |
|--------|-------------------------------------|--------------------------|-------|
| POST   | /api/recycling/requests             | Submit request           | ✓     |
| GET    | /api/recycling/requests/my          | User's requests          | ✓     |
| GET    | /api/recycling/requests/:id         | Single request           | ✓     |
| GET    | /api/recycling/requests             | All requests             | Admin |
| PUT    | /api/recycling/requests/:id/status  | Update + calc impact     | Admin |
| GET    | /api/recycling/companies            | List companies           | ─     |
| POST   | /api/recycling/companies/:id/contact| Send contact message     | ─     |
| GET    | /api/recycling/config               | Get impact constants     | ─     |
| PUT    | /api/recycling/config               | Update impact constants  | Admin |

### User / Admin
| Method | Endpoint                | Description       | Auth  |
|--------|-------------------------|-------------------|-------|
| GET    | /api/users/profile      | Get profile       | ✓     |
| PUT    | /api/users/profile      | Update profile    | ✓     |
| PUT    | /api/users/change-password | Change password| ✓     |
| GET    | /api/users              | All users         | Admin |
| GET    | /api/admin/stats        | Dashboard stats   | Admin |

---

## 🧩 Tech Stack

**Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs, express-validator  
**Frontend:** React 18, React Router v6, Axios, Tailwind CSS, Lucide React, React Hot Toast  
**Build:** Vite

---

## 🌱 Environmental Impact Formula

When a recycling request is marked **Completed**, the backend calculates:

```
paperSavedKg      = numberOfBooks × paperSavedPerBookKg      (default: 0.5)
waterSavedLiters  = numberOfBooks × waterSavedPerBookLiters  (default: 3.5)
co2ReductionKg    = numberOfBooks × co2ReductionPerBookKg    (default: 0.8)
```

Constants are **admin-configurable** at `/admin/config`. Completed impact is added cumulatively to the user's profile and visible in their dashboard.
