import api from './axios'

// ─── Auth ────────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login:    (data) => api.post('/auth/login', data),
  getMe:    ()     => api.get('/auth/me'),
}

// ─── Books ───────────────────────────────────────────────────────────────────
export const booksAPI = {
  getAll:      (params) => api.get('/books', { params }),
  getOne:      (id)     => api.get(`/books/${id}`),
  getCategories: ()     => api.get('/books/categories'),
  create:      (data)   => api.post('/books', data),
  update:      (id, data) => api.put(`/books/${id}`, data),
  delete:      (id)     => api.delete(`/books/${id}`),
}

// ─── Cart ────────────────────────────────────────────────────────────────────
export const cartAPI = {
  get:    ()                       => api.get('/cart'),
  add:    (bookId, quantity = 1)   => api.post('/cart/add', { bookId, quantity }),
  update: (bookId, quantity)       => api.put(`/cart/${bookId}`, { quantity }),
  remove: (bookId)                 => api.delete(`/cart/${bookId}`),
  clear:  ()                       => api.delete('/cart/clear'),
}

// ─── Orders ──────────────────────────────────────────────────────────────────
export const ordersAPI = {
  place:       (data)   => api.post('/orders', data),
  getMyOrders: ()       => api.get('/orders/my-orders'),
  getOne:      (id)     => api.get(`/orders/${id}`),
  getAll:      (params) => api.get('/orders', { params }),
  updateStatus:(id, status) => api.put(`/orders/${id}/status`, { status }),
}

// ─── Recycling ───────────────────────────────────────────────────────────────
export const recyclingAPI = {
  submitRequest:   (data)        => api.post('/recycling/requests', data),
  getMyRequests:   ()            => api.get('/recycling/requests/my'),
  getRequest:      (id)          => api.get(`/recycling/requests/${id}`),
  getAllRequests:   (params)      => api.get('/recycling/requests', { params }),
  updateStatus:    (id, data)    => api.put(`/recycling/requests/${id}/status`, data),
  getCompanies:    ()            => api.get('/recycling/companies'),
  getCompany:      (id)          => api.get(`/recycling/companies/${id}`),
  createCompany:   (data)        => api.post('/recycling/companies', data),
  updateCompany:   (id, data)    => api.put(`/recycling/companies/${id}`, data),
  deleteCompany:   (id)          => api.delete(`/recycling/companies/${id}`),
  sendContact:     (id, data)    => api.post(`/recycling/companies/${id}/contact`, data),
  getConfig:       ()            => api.get('/recycling/config'),
  updateConfig:    (data)        => api.put('/recycling/config', data),
}

// ─── User ────────────────────────────────────────────────────────────────────
export const userAPI = {
  getProfile:     ()       => api.get('/users/profile'),
  updateProfile:  (data)   => api.put('/users/profile', data),
  changePassword: (data)   => api.put('/users/change-password', data),
  getAllUsers:     (params) => api.get('/users', { params }),
  toggleStatus:   (id)     => api.put(`/users/${id}/toggle-status`),
}

// ─── Admin ───────────────────────────────────────────────────────────────────
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
}
