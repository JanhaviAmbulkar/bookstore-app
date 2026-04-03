import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Leaf, BookOpen } from 'lucide-react'

export function Loader({ size = 'md', className = '' }) {
  const s = { sm: 'w-4 h-4 border', md: 'w-8 h-8 border-2', lg: 'w-12 h-12 border-2' }[size]
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`${s} border-eco-200 border-t-eco-600 rounded-full animate-spin`} />
    </div>
  )
}

export function PageLoader() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-sage-50 gap-3">
      <div className="w-14 h-14 bg-eco-gradient rounded-2xl flex items-center justify-center shadow-eco animate-pulse-slow">
        <Leaf size={26} className="text-white" />
      </div>
      <p className="font-body text-eco-600 text-sm">Loading EcoReads...</p>
    </div>
  )
}

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()
  if (loading) return <PageLoader />
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />
  return children
}

export function AdminRoute({ children }) {
  const { user, loading, isAdmin } = useAuth()
  const location = useLocation()
  if (loading) return <PageLoader />
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />
  if (!isAdmin) return <Navigate to="/" replace />
  return children
}

const STATUS_MAP = {
  Pending:    'badge-amber',
  Processing: 'badge-blue',
  Shipped:    'badge-teal',
  Delivered:  'badge-green',
  Cancelled:  'badge-red',
  Scheduled:  'badge-blue',
  Completed:  'badge-green',
}
export function StatusBadge({ status }) {
  return <span className={STATUS_MAP[status] || 'badge-gray'}>{status}</span>
}

export function EmptyState({ icon: Icon = BookOpen, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-4">
      <div className="w-16 h-16 bg-eco-gradient rounded-2xl flex items-center justify-center mb-4 shadow-eco">
        <Icon size={28} className="text-white" />
      </div>
      <h3 className="font-display font-bold text-xl text-eco-800 mb-2">{title}</h3>
      {description && <p className="text-sm font-body text-eco-500 max-w-xs mb-6">{description}</p>}
      {action}
    </div>
  )
}

export function formatPrice(n) {
  return `₹${Number(n).toFixed(0)}`
}

export function ErrorMsg({ message }) {
  if (!message) return null
  return (
    <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm font-body">
      {message}
    </div>
  )
}

/* Stat card for hero / dashboard */
export function StatCard({ icon: Icon, value, label, glass = false }) {
  if (glass) return (
    <div className="glass-card p-5 text-white text-center">
      <Icon size={24} className="mx-auto mb-2 opacity-80" />
      <p className="font-display font-bold text-2xl">{value}</p>
      <p className="font-body text-white/60 text-xs mt-0.5">{label}</p>
    </div>
  )
  return (
    <div className="card p-5 text-center">
      <div className="w-10 h-10 bg-eco-100 rounded-xl flex items-center justify-center mx-auto mb-2">
        <Icon size={18} className="text-eco-600" />
      </div>
      <p className="font-display font-bold text-xl text-eco-800">{value}</p>
      <p className="font-body text-eco-500 text-xs mt-0.5">{label}</p>
    </div>
  )
}
