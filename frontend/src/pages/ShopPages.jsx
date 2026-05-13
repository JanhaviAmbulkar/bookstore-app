import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { ordersAPI } from '../api'
import { formatPrice, Loader, EmptyState, StatusBadge, ErrorMsg } from '../components/common'
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, Package, ArrowLeft, MapPin, Check, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const STATES = ['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Delhi','Jammu and Kashmir','Ladakh','Puducherry']

/* ─────────────────────── CART PAGE ─────────────────────── */
export function CartPage() {
  const { cart, loading, updateItem, removeItem } = useCart()
  const navigate = useNavigate()
  const items    = cart?.items || []
  const subtotal = cart?.totalAmount || 0
  const shipping = subtotal > 500 ? 0 : items.length > 0 ? 50 : 0

  if (loading) return <div className="flex items-center justify-center min-h-96"><Loader size="lg" /></div>

  return (
    <div className="p-6 lg:p-8 fade-up">
      <h1 className="page-title mb-6">Shopping Cart</h1>
      {items.length === 0 ? (
        <EmptyState icon={ShoppingCart} title="Your cart is empty"
          description="Add some eco-friendly books to get started."
          action={<Link to="/" className="btn-eco text-sm">Browse Books</Link>} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            {items.map(item => {
              const b = item.book; if (!b) return null
              return (
                <div key={item._id} className="card p-4 flex gap-4">
                  <Link to={`/books/${b._id}`} className="flex-shrink-0">
                    <img src={b.image} alt={b.title}
                      className="w-16 h-22 object-cover rounded-xl bg-eco-50"
                      style={{ height: '88px' }}
                      onError={e => e.target.src = 'https://via.placeholder.com/64x88/dcfce7/16a34a?text=📚'} />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link to={`/books/${b._id}`}>
                      <h3 className="font-display font-bold text-eco-900 text-sm leading-snug hover:text-eco-600 line-clamp-1">{b.title}</h3>
                    </Link>
                    <p className="text-xs font-body text-eco-400 mb-3">by {b.author}</p>
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <div className="flex items-center border-2 border-eco-100 rounded-xl overflow-hidden">
                        <button onClick={() => updateItem(b._id, item.quantity - 1)}
                          className="px-2.5 py-1.5 text-eco-500 hover:bg-eco-50"><Minus size={12} /></button>
                        <span className="px-3 font-display font-bold text-sm text-eco-800">{item.quantity}</span>
                        <button onClick={() => updateItem(b._id, item.quantity + 1)}
                          disabled={item.quantity >= (b.stock || 99)}
                          className="px-2.5 py-1.5 text-eco-500 hover:bg-eco-50 disabled:opacity-40"><Plus size={12} /></button>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-display font-bold text-eco-700">{formatPrice(item.price * item.quantity)}</span>
                        <button onClick={() => removeItem(b._id)}
                          className="p-1.5 text-eco-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="lg:col-span-1">
            <div className="card p-5 sticky top-6">
              <h2 className="font-display font-bold text-eco-800 mb-4">Order Summary</h2>
              <div className="space-y-2.5 text-sm font-body">
                <div className="flex justify-between text-eco-600">
                  <span>Subtotal ({items.reduce((s,i) => s+i.quantity,0)} items)</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-eco-600">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? <span className="text-eco-500 font-semibold">Free 🎉</span> : formatPrice(shipping)}</span>
                </div>
                {subtotal < 500 && subtotal > 0 && (
                  <p className="text-xs text-eco-400 bg-eco-50 rounded-lg px-2.5 py-2">
                    Add {formatPrice(500 - subtotal)} for free shipping
                  </p>
                )}
                <div className="border-t border-eco-100 pt-2.5 flex justify-between font-bold text-eco-900">
                  <span className="font-display">Total</span>
                  <span className="font-display text-eco-700">{formatPrice(subtotal + shipping)}</span>
                </div>
              </div>
              <div className="mt-3 mb-4 bg-eco-50 rounded-xl px-3 py-2 text-xs font-body text-eco-600 flex items-center gap-1.5">
                💵 Cash on Delivery only
              </div>
              <button onClick={() => navigate('/checkout')} className="btn-eco w-full">
                Checkout <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ─────────────────────── CHECKOUT PAGE ──────────────────── */
export function CheckoutPage() {
  const { cart, fetchCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [placing, setPlacing] = useState(false)
  const [error, setError]     = useState('')
  const [form, setForm] = useState({
    fullName: user?.name||'', phone: user?.phone||'',
    street: user?.address?.street||'', city: user?.address?.city||'',
    state: user?.address?.state||'', pincode: user?.address?.pincode||'',
  })

  const items    = cart?.items || []
  const subtotal = cart?.totalAmount || 0
  const shipping = subtotal >= 500 ? 0 : 50

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const submit = async (e) => {
    e.preventDefault(); setError(''); setPlacing(true)
    try {
      const { data } = await ordersAPI.place({
        cartItems: items.map(i => ({ book: i.book._id, quantity: i.quantity })),
        shippingAddress: form,
      })
      await fetchCart()
      toast.success('Order placed! 🎉')
      navigate(`/orders/${data.order._id}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order')
    } finally { setPlacing(false) }
  }

  if (!items.length) return (
    <div className="p-8 text-center">
      <p className="font-display text-eco-600 mb-4">Nothing to checkout.</p>
      <Link to="/" className="btn-eco inline-flex text-sm">Browse Books</Link>
    </div>
  )

  return (
    <div className="p-6 lg:p-8 fade-up">
      <Link to="/cart" className="inline-flex items-center gap-2 text-sm font-body text-eco-400 hover:text-eco-700 mb-6 transition-colors">
        <ArrowLeft size={16} /> Back to Cart
      </Link>
      <h1 className="page-title mb-6">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <form onSubmit={submit} className="lg:col-span-3 space-y-5">
          <div className="card p-6">
            <h2 className="font-display font-bold text-eco-800 mb-4">Shipping Address</h2>
            {error && <div className="mb-4"><ErrorMsg message={error} /></div>}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label className="label-eco">Full Name *</label><input className="input-eco" required value={form.fullName} onChange={e=>set('fullName',e.target.value)} placeholder="John Doe" /></div>
              <div><label className="label-eco">Phone *</label><input className="input-eco" required value={form.phone} onChange={e=>set('phone',e.target.value)} placeholder="+91 ..." /></div>
              <div className="sm:col-span-2"><label className="label-eco">Street *</label><input className="input-eco" required value={form.street} onChange={e=>set('street',e.target.value)} /></div>
              <div><label className="label-eco">City *</label><input className="input-eco" required value={form.city} onChange={e=>set('city',e.target.value)} /></div>
              <div><label className="label-eco">State *</label>
                <select className="select-eco" required value={form.state} onChange={e=>set('state',e.target.value)}>
                  <option value="">Select state</option>
                  {STATES.map(s=><option key={s}>{s}</option>)}
                </select>
              </div>
              <div><label className="label-eco">Pincode *</label><input className="input-eco" required value={form.pincode} onChange={e=>set('pincode',e.target.value)} maxLength={6} /></div>
            </div>
          </div>
          <div className="card p-5">
            <h2 className="font-display font-bold text-eco-800 mb-3">Payment</h2>
            <label className="flex items-center gap-3 p-4 border-2 border-eco-500 rounded-xl bg-eco-50 cursor-pointer">
              <div className="w-5 h-5 rounded-full border-2 border-eco-600 bg-eco-600 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-white" />
              </div>
              <div>
                <p className="font-display font-bold text-eco-800 text-sm">💵 Cash on Delivery</p>
                <p className="font-body text-xs text-eco-500">Pay when your books arrive</p>
              </div>
            </label>
          </div>
          <button type="submit" disabled={placing} className="btn-eco w-full py-3 text-base">
            {placing ? <Loader size="sm" /> : <CheckCircle size={18} />}
            {placing ? 'Placing Order...' : `Place Order — ${formatPrice(subtotal + shipping)}`}
          </button>
        </form>

        <div className="lg:col-span-2">
          <div className="card p-5 sticky top-6">
            <h2 className="font-display font-bold text-eco-800 mb-4">Your Items</h2>
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1 mb-4">
              {items.map(item => (
                <div key={item._id} className="flex items-center gap-3">
                  <img src={item.book?.image} alt={item.book?.title}
                    className="w-10 h-14 object-cover rounded-lg bg-eco-50 flex-shrink-0"
                    onError={e=>e.target.src='https://via.placeholder.com/40x56/dcfce7/16a34a?text=📚'} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-display font-semibold text-eco-800 line-clamp-1">{item.book?.title}</p>
                    <p className="text-xs font-body text-eco-400">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-xs font-display font-bold text-eco-700">{formatPrice(item.price*item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-eco-100 pt-3 space-y-2 text-sm font-body">
              <div className="flex justify-between text-eco-500"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
              <div className="flex justify-between text-eco-500"><span>Shipping</span><span>{shipping===0?'Free':formatPrice(shipping)}</span></div>
              <div className="flex justify-between font-bold text-eco-900 pt-1 border-t border-eco-100">
                <span className="font-display">Total</span><span className="font-display text-eco-700">{formatPrice(subtotal+shipping)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────── ORDERS PAGE ──────────────────────*/
export function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ordersAPI.getMyOrders().then(({data})=>setOrders(data.orders)).finally(()=>setLoading(false))
  }, [])

  if (loading) return <div className="flex items-center justify-center min-h-96"><Loader size="lg" /></div>

  return (
    <div className="p-6 lg:p-8 fade-up">
      <h1 className="page-title mb-6">My Orders</h1>
      {orders.length === 0 ? (
        <EmptyState icon={Package} title="No orders yet"
          description="Your order history will appear here."
          action={<Link to="/" className="btn-eco text-sm">Browse Books</Link>} />
      ) : (
        <div className="space-y-3 stagger">
          {orders.map(order => (
            <Link key={order._id} to={`/orders/${order._id}`} className="card-hover p-5 flex gap-4 items-center block">
              <div className="flex -space-x-2 flex-shrink-0">
                {order.orderItems.slice(0,3).map((item,i)=>(
                  <img key={i} src={item.image||'https://via.placeholder.com/40x56/dcfce7/16a34a?text=📚'} alt={item.title}
                    className="w-9 h-12 object-cover rounded-lg border-2 border-white bg-eco-50" />
                ))}
                {order.orderItems.length>3&&<div className="w-9 h-12 rounded-lg border-2 border-white bg-eco-100 flex items-center justify-center text-xs font-display font-bold text-eco-600">+{order.orderItems.length-3}</div>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <div>
                    <p className="font-body text-xs text-eco-400 mb-0.5">#{order._id.slice(-8).toUpperCase()}</p>
                    <p className="font-display font-bold text-eco-900 text-sm">{order.orderItems.length} item{order.orderItems.length>1?'s':''}</p>
                    <p className="font-body text-xs text-eco-400">{new Date(order.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</p>
                  </div>
                  <div className="text-right">
                    <StatusBadge status={order.orderStatus} />
                    <p className="font-display font-bold text-eco-700 text-base mt-1">{formatPrice(order.totalPrice)}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

/* ─────────────────────── ORDER DETAIL ─────────────────────*/
export function OrderDetailPage() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ordersAPI.getOne(id).then(({data})=>setOrder(data.order)).finally(()=>setLoading(false))
  }, [id])

  if (loading) return <div className="flex items-center justify-center min-h-96"><Loader size="lg" /></div>
  if (!order)  return <div className="p-8 text-center"><p className="font-display text-eco-600">Order not found.</p></div>

  const steps = ['Pending','Processing','Shipped','Delivered']
  const curr  = order.orderStatus==='Cancelled' ? -1 : steps.indexOf(order.orderStatus)

  return (
    <div className="p-6 lg:p-8 fade-up">
      <Link to="/orders" className="inline-flex items-center gap-2 text-sm font-body text-eco-400 hover:text-eco-700 mb-6">
        <ArrowLeft size={16} /> My Orders
      </Link>
      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="page-title">Order #{order._id.slice(-8).toUpperCase()}</h1>
          <p className="font-body text-sm text-eco-400 mt-1">{new Date(order.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'})}</p>
        </div>
        <StatusBadge status={order.orderStatus} />
      </div>

      {order.orderStatus!=='Cancelled' && (
        <div className="card p-5 mb-6">
          <div className="flex items-center justify-between relative py-1">
            <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-eco-100 z-0" />
            <div className="absolute left-0 top-1/2 h-0.5 bg-eco-gradient z-0 transition-all" style={{width:`${(curr/(steps.length-1))*100}%`}} />
            {steps.map((step,i)=>(
              <div key={step} className="flex flex-col items-center z-10">
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs transition-all ${
                  i<=curr ? 'bg-eco-gradient border-eco-600 text-white' : 'bg-white border-eco-200 text-eco-400'
                }`}>
                  {i<curr ? <Check size={14}/> : i+1}
                </div>
                <span className={`text-xs font-display font-semibold mt-2 ${i<=curr?'text-eco-700':'text-eco-300'}`}>{step}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <div className="card p-5">
            <h2 className="font-display font-bold text-eco-800 mb-4">Items</h2>
            <div className="space-y-4">
              {order.orderItems.map((item,i)=>(
                <div key={i} className="flex gap-4 items-center">
                  <img src={item.image} alt={item.title}
                    className="w-12 h-16 object-cover rounded-xl bg-eco-50 flex-shrink-0"
                    onError={e=>e.target.src='https://via.placeholder.com/48x64/dcfce7/16a34a?text=📚'} />
                  <div className="flex-1 min-w-0">
                    <p className="font-display font-bold text-sm text-eco-900 line-clamp-1">{item.title}</p>
                    <p className="font-body text-xs text-eco-400">by {item.author}</p>
                    <p className="font-body text-xs text-eco-400 mt-0.5">Qty: {item.quantity} × {formatPrice(item.price)}</p>
                  </div>
                  <span className="font-display font-bold text-eco-700 flex-shrink-0">{formatPrice(item.price*item.quantity)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="card p-5">
            <h2 className="font-display font-bold text-eco-800 mb-3 flex items-center gap-2"><MapPin size={14}/> Shipping</h2>
            <div className="font-body text-sm text-eco-600 space-y-0.5">
              <p className="font-semibold text-eco-800">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.street}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}</p>
              <p className="text-eco-400 mt-1">{order.shippingAddress.phone}</p>
            </div>
          </div>
          <div className="card p-5">
            <h2 className="font-display font-bold text-eco-800 mb-3">Price</h2>
            <div className="space-y-2 text-sm font-body">
              <div className="flex justify-between text-eco-500"><span>Items</span><span>{formatPrice(order.itemsPrice)}</span></div>
              <div className="flex justify-between text-eco-500"><span>Shipping</span><span>{order.shippingPrice===0?'Free':formatPrice(order.shippingPrice)}</span></div>
              <div className="flex justify-between font-bold text-eco-900 pt-1.5 border-t border-eco-100">
                <span className="font-display">Total</span><span className="font-display text-eco-700">{formatPrice(order.totalPrice)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
