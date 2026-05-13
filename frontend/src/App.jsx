import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Layout from './components/layout/Layout'
import { ProtectedRoute, AdminRoute } from './components/common'

// Pages
import HomePage          from './pages/HomePage'
import BookDetailPage    from './pages/BookDetailPage'
import { CartPage, CheckoutPage, OrdersPage, OrderDetailPage } from './pages/ShopPages'
import { LoginPage, RegisterPage } from './pages/AuthPages'
import { ImpactDashboard, EcoTipsPage, ProfilePage } from './pages/EcoPages'
import { RecyclingPage, RecyclingTrackPage, CompaniesPage } from './pages/RecyclingPages'

// Admin
import { AdminLayout, AdminDashboard, AdminBooks, AdminOrders, AdminRecycling, AdminCompanies, AdminConfig } from './pages/admin/AdminPages'

// Wrapper: pages that use the sidebar layout
function WithLayout({ children }) {
  return <Layout>{children}</Layout>
}

export default function App() {
  return (
    <>
      <Toaster position="top-right" toastOptions={{
        style: { fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize:'14px', borderRadius:'12px', border:'1px solid #dcfce7' },
        success: { iconTheme: { primary:'#16a34a', secondary:'#fff' } },
      }} />

      <Routes>
        {/* Auth — no sidebar */}
        <Route path="/login"    element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Admin — own dark sidebar */}
        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route index                element={<AdminDashboard />} />
          <Route path="books"         element={<AdminBooks />} />
          <Route path="orders"        element={<AdminOrders />} />
          <Route path="recycling"     element={<AdminRecycling />} />
          <Route path="companies"     element={<AdminCompanies />} />
          <Route path="config"        element={<AdminConfig />} />
        </Route>

        {/* Public store — green sidebar */}
        <Route path="/" element={<WithLayout><HomePage /></WithLayout>} />
        <Route path="/books" element={<WithLayout><HomePage /></WithLayout>} />
        <Route path="/books/:id" element={<WithLayout><BookDetailPage /></WithLayout>} />
        <Route path="/companies" element={<WithLayout><CompaniesPage /></WithLayout>} />
        <Route path="/eco-tips"  element={<WithLayout><EcoTipsPage /></WithLayout>} />

        {/* Protected */}
        <Route path="/cart"     element={<WithLayout><ProtectedRoute><CartPage /></ProtectedRoute></WithLayout>} />
        <Route path="/checkout" element={<WithLayout><ProtectedRoute><CheckoutPage /></ProtectedRoute></WithLayout>} />
        <Route path="/orders"   element={<WithLayout><ProtectedRoute><OrdersPage /></ProtectedRoute></WithLayout>} />
        <Route path="/orders/:id" element={<WithLayout><ProtectedRoute><OrderDetailPage /></ProtectedRoute></WithLayout>} />
        <Route path="/profile"  element={<WithLayout><ProtectedRoute><ProfilePage /></ProtectedRoute></WithLayout>} />
        <Route path="/recycling" element={<WithLayout><ProtectedRoute><RecyclingPage /></ProtectedRoute></WithLayout>} />
        <Route path="/recycling/track" element={<WithLayout><ProtectedRoute><RecyclingTrackPage /></ProtectedRoute></WithLayout>} />
        <Route path="/impact"   element={<WithLayout><ProtectedRoute><ImpactDashboard /></ProtectedRoute></WithLayout>} />

        {/* 404 */}
        <Route path="*" element={
          <WithLayout>
            <div className="flex flex-col items-center justify-center min-h-screen text-center p-8">
              <p className="font-display font-black text-8xl text-eco-100 mb-2">404</p>
              <h2 className="font-display font-bold text-2xl text-eco-700 mb-4">Page not found</h2>
              <a href="/" className="btn-eco text-sm">Go Home</a>
            </div>
          </WithLayout>
        } />
      </Routes>
    </>
  )
}
