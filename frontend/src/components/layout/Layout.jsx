import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import Sidebar from './Sidebar'

export default function Layout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="relative w-64 h-full">
            <Sidebar />
            <button onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-white/60 hover:text-white">
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Mobile topbar */}
        <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-eco-gradient shadow-eco">
          <button onClick={() => setMobileOpen(true)} className="p-2 text-white">
            <Menu size={20} />
          </button>
          <span className="font-display font-bold text-white text-lg">EcoReads</span>
          <div className="w-8" />
        </div>

        <main className="flex-1 bg-sage-50">
          {children}
        </main>
      </div>
    </div>
  )
}
