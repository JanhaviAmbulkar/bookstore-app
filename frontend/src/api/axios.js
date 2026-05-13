import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
  timeout: 30000,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      // FIX: Only force-redirect if it's NOT the /auth/me restore call.
      // Without this check, every page load with an expired/missing token
      // triggers a redirect loop: load -> /auth/me 401 -> redirect /login ->
      // load -> /auth/me 401 -> redirect /login -> ...
      const url = err.config?.url || ''
      const isRestoreCall = url.includes('/auth/me')
      if (!isRestoreCall) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = '/login'
      }
    }
    return Promise.reject(err)
  }
)

export default api
