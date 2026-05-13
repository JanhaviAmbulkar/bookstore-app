import { NavLink, Link, useNavigate } from 'react-router-dom'
import { Home, BookOpen, ShoppingCart, Recycle, RefreshCw, BarChart2, Lightbulb, Settings, LogOut, Leaf, LayoutDashboard } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import toast from 'react-hot-toast'

const NAV_MAIN = [
  { to: '/',               label: 'Home',            Icon: Home,        end: true },
  { to: '/books',          label: 'Browse Books',     Icon: BookOpen },
  { to: '/cart',           label: 'Shopping Cart',    Icon: ShoppingCart, cart: true },
  { to: '/recycling',      label: 'Book Recycling',   Icon: Recycle },
  { to: '/recycling/track',label: 'Book Exchange',    Icon: RefreshCw },
  { to: '/impact',         label: 'Impact Dashboard', Icon: BarChart2 },
  { to: '/eco-tips',       label: 'Eco Tips',         Icon: Lightbulb },
]

const NAV_ADMIN = [
  { to: '/admin', label: 'Admin Dashboard', Icon: LayoutDashboard },
]

export default function Sidebar() {
  const { user, logout, isAdmin } = useAuth()
  const { itemCount } = useCart()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <aside className="w-64 flex-shrink-0 bg-eco-gradient flex flex-col h-screen sticky top-0 shadow-sidebar overflow-hidden">
      {/* Logo */}
      <div className="px-5 pt-6 pb-5 border-b border-white/10">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-colors">
            <Leaf size={20} className="text-white" />
          </div>
          <div>
            <p className="font-display font-bold text-white text-lg leading-none">EcoReads</p>
            <p className="font-body text-white/60 text-xs mt-0.5">Sustainable Bookstore</p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto sidebar-scroll">
        <p className="text-white/40 text-xs font-display font-bold uppercase tracking-widest px-4 mb-3">Navigation</p>

        {NAV_MAIN.map(({ to, label, Icon, end, cart }) => (
          <NavLink key={to} to={to} end={end}
            className={({ isActive }) => isActive ? 'nav-item-active' : 'nav-item-inactive'}>
            {({ isActive }) => (
              <>
                <Icon size={17} className={isActive ? 'text-eco-600' : ''} />
                <span className="flex-1">{label}</span>
                {cart && itemCount > 0 && (
                  <span className="bg-white text-eco-700 text-xs font-display font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}

        {isAdmin && (
          <>
            <div className="pt-4 pb-1">
              <p className="text-white/40 text-xs font-display font-bold uppercase tracking-widest px-4 mb-3">Admin</p>
            </div>
            {NAV_ADMIN.map(({ to, label, Icon }) => (
              <NavLink key={to} to={to}
                className={({ isActive }) => isActive ? 'nav-item-active' : 'nav-item-inactive text-amber-300/80 hover:text-amber-200 hover:bg-white/10'}>
                <Icon size={17} />
                {label}
              </NavLink>
            ))}
          </>
        )}
      </nav>

      {/* Eco badge */}
      <div className="mx-3 mb-3 p-3 rounded-xl bg-white/10 border border-white/15 text-center">
        <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-1.5">
          <Leaf size={16} className="text-white" />
        </div>
        <p className="font-display font-bold text-white text-sm">Going Green!</p>
        <p className="text-white/50 text-xs font-body mt-0.5">Every book helps our planet</p>
      </div>

      {/* User footer */}
      <div className="px-3 pb-4 border-t border-white/10 pt-3">
        {user ? (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <span className="font-display font-bold text-white text-sm">{user.name.charAt(0).toUpperCase()}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-display font-semibold text-white text-sm truncate">{user.name}</p>
              <p className="text-white/50 text-xs font-body capitalize">{user.role}</p>
            </div>
            <div className="flex gap-1">
              <Link to="/profile" className="p-1.5 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                <Settings size={14} />
              </Link>
              <button onClick={handleLogout} className="p-1.5 text-white/50 hover:text-red-300 hover:bg-white/10 rounded-lg transition-colors">
                <LogOut size={14} />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex gap-2">
            <Link to="/login" className="flex-1 btn-eco-outline text-sm py-2">Sign In</Link>
            <Link to="/register" className="flex-1 btn-white text-sm py-2">Join Free</Link>
          </div>
        )}
      </div>
    </aside>
  )
}
