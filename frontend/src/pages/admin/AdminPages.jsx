import { useState, useEffect } from 'react'
import { NavLink, Outlet, Link } from 'react-router-dom'
import { LayoutDashboard, BookOpen, Package, Recycle, Building2, Settings, ArrowLeft, Leaf } from 'lucide-react'
import { adminAPI, booksAPI, ordersAPI, recyclingAPI } from '../../api'
import { Loader, formatPrice, StatusBadge, ErrorMsg } from '../../components/common'
import { Plus, Pencil, Trash2, X, Save, Check } from 'lucide-react'
import toast from 'react-hot-toast'

/* ═══════════════════════ ADMIN LAYOUT ═══════════════════════ */
const ADMIN_NAV = [
  { to: '/admin',           label: 'Dashboard',    Icon: LayoutDashboard, end: true },
  { to: '/admin/books',     label: 'Books',         Icon: BookOpen },
  { to: '/admin/orders',    label: 'Orders',        Icon: Package },
  { to: '/admin/recycling', label: 'Recycling',     Icon: Recycle },
  { to: '/admin/companies', label: 'Companies',     Icon: Building2 },
  { to: '/admin/config',    label: 'Impact Config', Icon: Settings },
]

export function AdminLayout() {
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Admin sidebar */}
      <aside className="w-56 flex-shrink-0 bg-eco-950 flex flex-col h-screen sticky top-0">
        <div className="px-4 py-5 border-b border-white/10">
          <Link to="/" className="flex items-center gap-1.5 text-white/40 hover:text-white/70 text-xs font-body mb-3 transition-colors">
            <ArrowLeft size={13} /> Back to store
          </Link>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-eco-gradient rounded-lg flex items-center justify-center shadow-eco">
              <Leaf size={15} className="text-white" />
            </div>
            <div>
              <p className="font-display font-bold text-white text-sm">EcoReads</p>
              <p className="font-body text-white/40 text-xs">Admin Panel</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {ADMIN_NAV.map(({ to, label, Icon, end }) => (
            <NavLink key={to} to={to} end={end}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-display font-semibold transition-all ${
                  isActive ? 'bg-eco-600 text-white shadow-eco' : 'text-white/50 hover:bg-white/10 hover:text-white'
                }`
              }>
              <Icon size={15} /> {label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="flex-1 min-w-0 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}

/* ═══════════════════════ DASHBOARD ══════════════════════════ */
function DashStatCard({ icon: Icon, label, value, color, bg }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-body text-gray-500">{label}</p>
        <div className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center`}>
          <Icon size={17} className={color} />
        </div>
      </div>
      <p className="font-display font-black text-2xl text-gray-900">{value}</p>
    </div>
  )
}

export function AdminDashboard() {
  const [data, setData]     = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminAPI.getStats().then(({ data }) => setData(data)).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex items-center justify-center h-96"><Loader size="lg" /></div>

  const { stats, recentOrders } = data

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="bg-eco-gradient rounded-2xl p-6 text-white mb-6 relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-40 h-40 bg-white/5 rounded-full" />
        <div className="relative">
          <h1 className="font-display font-black text-2xl mb-1">Admin Dashboard</h1>
          <p className="font-body text-white/60 text-sm">Welcome back! Here's an overview of EcoReads.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <DashStatCard icon={BookOpen}  label="Total Books"         value={stats.totalBooks}             color="text-eco-600"    bg="bg-eco-50" />
        <DashStatCard icon={Package}   label="Total Orders"        value={stats.totalOrders}            color="text-violet-600" bg="bg-violet-50" />
        <DashStatCard icon={Recycle}   label="Recycling Requests"  value={stats.totalRecyclingRequests} color="text-teal-600"   bg="bg-teal-50" />
        <DashStatCard icon={Settings}  label="Total Revenue"       value={formatPrice(stats.totalRevenue)} color="text-amber-600" bg="bg-amber-50" />
      </div>
      <div className="grid grid-cols-2 gap-4 mb-6 max-w-sm">
        <DashStatCard icon={Package}  label="Pending Orders"   value={stats.pendingOrders}   color="text-orange-600" bg="bg-orange-50" />
        <DashStatCard icon={Recycle}  label="Pending Recycle"  value={stats.pendingRecycling} color="text-blue-600"   bg="bg-blue-50" />
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50">
          <h2 className="font-display font-bold text-gray-800">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-body">
            <thead className="bg-gray-50/80">
              <tr>{['Order ID','Customer','Items','Total','Status','Date'].map(h=>(
                <th key={h} className="px-5 py-3 text-left text-xs font-display font-bold text-gray-400 uppercase tracking-wide">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentOrders.map(o=>(
                <tr key={o._id} className="hover:bg-gray-50/50">
                  <td className="px-5 py-3 font-mono text-xs text-gray-400">#{o._id.slice(-8).toUpperCase()}</td>
                  <td className="px-5 py-3"><p className="font-semibold text-gray-800">{o.user?.name}</p><p className="text-xs text-gray-400">{o.user?.email}</p></td>
                  <td className="px-5 py-3 text-gray-500">{o.orderItems?.length}</td>
                  <td className="px-5 py-3 font-bold text-eco-700">{formatPrice(o.totalPrice)}</td>
                  <td className="px-5 py-3"><StatusBadge status={o.orderStatus} /></td>
                  <td className="px-5 py-3 text-xs text-gray-400">{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════ BOOKS CRUD ════════════════════════ */
const CATS = ['Fiction','Non-Fiction','Science','Technology','History','Biography','Self-Help','Children','Romance','Mystery','Fantasy','Horror','Business','Academic','Other']
const EMPTY = { title:'',author:'',description:'',price:'',originalPrice:'',image:'',category:'',stock:'',isbn:'',publisher:'',publishedYear:'',language:'English',pages:'',isFeatured:false }

function BookModal({ book, onClose, onSaved }) {
  const [form, setForm]     = useState(book || EMPTY)
  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState('')
  const set = (k,v) => setForm(f=>({...f,[k]:v}))

  const submit = async (e) => {
    e.preventDefault(); setSaving(true); setError('')
    try {
      const payload = { ...form, price:Number(form.price), stock:Number(form.stock),
        originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
        pages: form.pages ? Number(form.pages) : undefined,
        publishedYear: form.publishedYear ? Number(form.publishedYear) : undefined }
      book?._id ? await booksAPI.update(book._id, payload) : await booksAPI.create(payload)
      toast.success(book ? 'Book updated!' : 'Book created!')
      onSaved()
    } catch (err) { setError(err.response?.data?.message || 'Save failed') }
    finally { setSaving(false) }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-2xl my-8 shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-display font-bold text-xl text-eco-900">{book ? 'Edit Book' : 'Add New Book'}</h2>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-700 rounded-xl hover:bg-gray-100"><X size={18}/></button>
        </div>
        <form onSubmit={submit} className="p-6 grid sm:grid-cols-2 gap-4">
          {error && <div className="sm:col-span-2"><ErrorMsg message={error}/></div>}
          <div className="sm:col-span-2"><label className="label-eco">Title *</label><input className="input-eco" value={form.title} onChange={e=>set('title',e.target.value)} required/></div>
          <div><label className="label-eco">Author *</label><input className="input-eco" value={form.author} onChange={e=>set('author',e.target.value)} required/></div>
          <div><label className="label-eco">Category *</label>
            <select className="select-eco" value={form.category} onChange={e=>set('category',e.target.value)} required>
              <option value="">Select</option>{CATS.map(c=><option key={c}>{c}</option>)}
            </select>
          </div>
          <div><label className="label-eco">Price (₹) *</label><input type="number" min="0" step="0.01" className="input-eco" value={form.price} onChange={e=>set('price',e.target.value)} required/></div>
          <div><label className="label-eco">Original Price (₹)</label><input type="number" min="0" className="input-eco" value={form.originalPrice} onChange={e=>set('originalPrice',e.target.value)}/></div>
          <div><label className="label-eco">Stock *</label><input type="number" min="0" className="input-eco" value={form.stock} onChange={e=>set('stock',e.target.value)} required/></div>
          <div><label className="label-eco">Language</label><input className="input-eco" value={form.language} onChange={e=>set('language',e.target.value)}/></div>
          <div className="sm:col-span-2"><label className="label-eco">Image URL</label><input type="url" className="input-eco" value={form.image} onChange={e=>set('image',e.target.value)} placeholder="https://..."/></div>
          <div className="sm:col-span-2"><label className="label-eco">Description *</label><textarea className="input-eco" rows={3} value={form.description} onChange={e=>set('description',e.target.value)} required/></div>
          <div><label className="label-eco">ISBN</label><input className="input-eco" value={form.isbn} onChange={e=>set('isbn',e.target.value)}/></div>
          <div><label className="label-eco">Publisher</label><input className="input-eco" value={form.publisher} onChange={e=>set('publisher',e.target.value)}/></div>
          <div><label className="label-eco">Year</label><input type="number" className="input-eco" value={form.publishedYear} onChange={e=>set('publishedYear',e.target.value)}/></div>
          <div><label className="label-eco">Pages</label><input type="number" className="input-eco" value={form.pages} onChange={e=>set('pages',e.target.value)}/></div>
          <div className="sm:col-span-2 flex items-center gap-2">
            <input type="checkbox" id="feat" checked={form.isFeatured} onChange={e=>set('isFeatured',e.target.checked)} className="w-4 h-4 accent-eco-600"/>
            <label htmlFor="feat" className="text-sm font-body text-eco-700">Featured / Eco Pick</label>
          </div>
          <div className="sm:col-span-2 flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-ghost flex-1 border border-eco-200">Cancel</button>
            <button type="submit" disabled={saving} className="btn-eco flex-1">
              {saving?<Loader size="sm"/>:<Check size={15}/>} {book?'Update':'Create'} Book
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export function AdminBooks() {
  const [books, setBooks]   = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal]   = useState(null)

  const load = () => { setLoading(true); booksAPI.getAll({ limit:100 }).then(({data})=>setBooks(data.books)).finally(()=>setLoading(false)) }
  useEffect(load, [])

  const del = async (id, title) => {
    if (!confirm(`Delete "${title}"?`)) return
    try { await booksAPI.delete(id); toast.success('Deleted'); load() } catch { toast.error('Failed') }
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display font-black text-2xl text-eco-900">Books</h1>
        <button onClick={()=>setModal('create')} className="btn-eco text-sm"><Plus size={14}/> Add Book</button>
      </div>
      {loading ? <div className="flex justify-center py-20"><Loader size="lg"/></div> : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-body">
              <thead className="bg-gray-50"><tr>
                {['Cover','Title','Category','Price','Stock','Featured','Actions'].map(h=>(
                  <th key={h} className="px-4 py-3 text-left text-xs font-display font-bold text-gray-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr></thead>
              <tbody className="divide-y divide-gray-50">
                {books.map(b=>(
                  <tr key={b._id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3">
                      <img src={b.image} alt={b.title} className="w-9 h-12 object-cover rounded-lg bg-eco-50"
                        onError={e=>e.target.src='https://via.placeholder.com/36x48/dcfce7/16a34a?text=📚'}/>
                    </td>
                    <td className="px-4 py-3 max-w-[180px]">
                      <p className="font-semibold text-gray-900 truncate">{b.title}</p>
                      <p className="text-xs text-gray-400">{b.author}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{b.category}</td>
                    <td className="px-4 py-3 font-bold text-eco-700">{formatPrice(b.price)}</td>
                    <td className="px-4 py-3">
                      <span className={`font-bold ${b.stock===0?'text-red-500':b.stock<5?'text-amber-500':'text-gray-700'}`}>{b.stock}</span>
                    </td>
                    <td className="px-4 py-3">{b.isFeatured?'⭐':'—'}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5">
                        <button onClick={()=>setModal(b)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg"><Pencil size={13}/></button>
                        <button onClick={()=>del(b._id,b.title)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={13}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {modal && <BookModal book={modal==='create'?null:modal} onClose={()=>setModal(null)} onSaved={()=>{setModal(null);load()}}/>}
    </div>
  )
}

/* ═══════════════════════ ORDERS ════════════════════════════ */
export function AdminOrders() {
  const [orders,setOrders]   = useState([])
  const [loading,setLoading] = useState(true)
  const [updating,setUpdating]=useState(null)
  const STATUSES = ['Pending','Processing','Shipped','Delivered','Cancelled']

  useEffect(()=>{ ordersAPI.getAll({limit:100}).then(({data})=>setOrders(data.orders)).finally(()=>setLoading(false)) },[])

  const updateStatus = async (id, status) => {
    setUpdating(id)
    try { await ordersAPI.updateStatus(id,status); setOrders(o=>o.map(x=>x._id===id?{...x,orderStatus:status}:x)); toast.success('Updated') }
    catch { toast.error('Failed') } finally { setUpdating(null) }
  }

  if (loading) return <div className="flex justify-center py-20"><Loader size="lg"/></div>

  return (
    <div className="p-6 lg:p-8">
      <h1 className="font-display font-black text-2xl text-eco-900 mb-6">Orders</h1>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-body">
            <thead className="bg-gray-50"><tr>
              {['Order','Customer','Items','Total','Status','Date','Update'].map(h=>(
                <th key={h} className="px-4 py-3 text-left text-xs font-display font-bold text-gray-400 uppercase tracking-wide">{h}</th>
              ))}
            </tr></thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map(o=>(
                <tr key={o._id} className="hover:bg-gray-50/50">
                  <td className="px-4 py-3 font-mono text-xs text-gray-400">#{o._id.slice(-8).toUpperCase()}</td>
                  <td className="px-4 py-3"><p className="font-semibold text-gray-800">{o.user?.name}</p><p className="text-xs text-gray-400">{o.user?.email}</p></td>
                  <td className="px-4 py-3 text-gray-500">{o.orderItems?.length}</td>
                  <td className="px-4 py-3 font-bold text-eco-700">{formatPrice(o.totalPrice)}</td>
                  <td className="px-4 py-3"><StatusBadge status={o.orderStatus}/></td>
                  <td className="px-4 py-3 text-xs text-gray-400">{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <select value={o.orderStatus} onChange={e=>updateStatus(o._id,e.target.value)} disabled={updating===o._id}
                        className="text-xs border border-eco-200 rounded-lg px-2 py-1.5 bg-white text-eco-700 focus:outline-none focus:ring-1 focus:ring-eco-500">
                        {STATUSES.map(s=><option key={s}>{s}</option>)}
                      </select>
                      {updating===o._id&&<Loader size="sm"/>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════ RECYCLING ══════════════════════════ */
export function AdminRecycling() {
  const [requests,setRequests]=useState([])
  const [loading,setLoading]  =useState(true)
  const [editing,setEditing]  =useState(null)
  const [form,setForm]        =useState({status:'',scheduledDate:'',adminNotes:''})
  const [saving,setSaving]    =useState(false)
  const STATUSES=['Pending','Scheduled','Completed','Cancelled']

  useEffect(()=>{ recyclingAPI.getAllRequests({limit:100}).then(({data})=>setRequests(data.requests)).finally(()=>setLoading(false)) },[])

  const openEdit = (req) => { setEditing(req); setForm({status:req.status,scheduledDate:req.scheduledDate?req.scheduledDate.split('T')[0]:'',adminNotes:req.adminNotes||''}) }

  const save = async (e) => {
    e.preventDefault(); setSaving(true)
    try { const {data}=await recyclingAPI.updateStatus(editing._id,form); setRequests(r=>r.map(x=>x._id===editing._id?data.request:x)); toast.success('Updated!'); setEditing(null) }
    catch { toast.error('Failed') } finally { setSaving(false) }
  }

  if (loading) return <div className="flex justify-center py-20"><Loader size="lg"/></div>

  return (
    <div className="p-6 lg:p-8">
      <h1 className="font-display font-black text-2xl text-eco-900 mb-6">Recycling Requests</h1>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-body">
            <thead className="bg-gray-50"><tr>
              {['ID','User','Books','Condition','Type','Status','Date','Action'].map(h=>(
                <th key={h} className="px-4 py-3 text-left text-xs font-display font-bold text-gray-400 uppercase tracking-wide">{h}</th>
              ))}
            </tr></thead>
            <tbody className="divide-y divide-gray-50">
              {requests.map(r=>(
                <tr key={r._id} className="hover:bg-gray-50/50">
                  <td className="px-4 py-3 font-mono text-xs text-gray-400">#{r._id.slice(-6).toUpperCase()}</td>
                  <td className="px-4 py-3"><p className="font-semibold text-gray-800">{r.user?.name}</p><p className="text-xs text-gray-400">{r.user?.email}</p></td>
                  <td className="px-4 py-3 font-bold text-eco-700">{r.numberOfBooks}</td>
                  <td className="px-4 py-3 text-gray-500">{r.condition}</td>
                  <td className="px-4 py-3 text-gray-500">{r.pickupType}</td>
                  <td className="px-4 py-3"><StatusBadge status={r.status}/></td>
                  <td className="px-4 py-3 text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString('en-IN')}</td>
                  <td className="px-4 py-3"><button onClick={()=>openEdit(r)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg"><Pencil size={13}/></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display font-bold text-xl text-eco-900">Update Request</h2>
              <button onClick={()=>setEditing(null)} className="p-1.5 text-gray-400 hover:text-gray-700 rounded-xl hover:bg-gray-100"><X size={18}/></button>
            </div>
            <form onSubmit={save} className="space-y-4">
              <div><label className="label-eco">Status</label>
                <select className="select-eco" value={form.status} onChange={e=>setForm(f=>({...f,status:e.target.value}))}>
                  {STATUSES.map(s=><option key={s}>{s}</option>)}
                </select>
              </div>
              <div><label className="label-eco">Scheduled Date</label>
                <input type="date" className="input-eco" value={form.scheduledDate} onChange={e=>setForm(f=>({...f,scheduledDate:e.target.value}))}/>
              </div>
              <div><label className="label-eco">Admin Notes</label>
                <textarea className="input-eco" rows={3} value={form.adminNotes} onChange={e=>setForm(f=>({...f,adminNotes:e.target.value}))} placeholder="Visible to user..."/>
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={()=>setEditing(null)} className="btn-ghost flex-1 border border-eco-200">Cancel</button>
                <button type="submit" disabled={saving} className="btn-eco flex-1">
                  {saving?<Loader size="sm"/>:<Save size={14}/>} Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

/* ═══════════════════════ COMPANIES ══════════════════════════ */
const EMPTY_CO = { name:'',description:'',email:'',phone:'',website:'',city:'',state:'',street:'',pincode:'',specializations:'' }

export function AdminCompanies() {
  const [companies,setCompanies]=useState([])
  const [loading,setLoading]   =useState(true)
  const [modal,setModal]       =useState(null)
  const [form,setForm]         =useState(EMPTY_CO)
  const [saving,setSaving]     =useState(false)
  const [error,setError]       =useState('')

  const load = () => recyclingAPI.getCompanies().then(({data})=>setCompanies(data.companies)).finally(()=>setLoading(false))
  useEffect(load,[])

  const openCreate = () => { setForm(EMPTY_CO); setModal('create'); setError('') }
  const openEdit   = c => { setForm({...c,city:c.address?.city||'',state:c.address?.state||'',street:c.address?.street||'',pincode:c.address?.pincode||'',specializations:(c.specializations||[]).join(', ')}); setModal(c); setError('') }

  const save = async (e) => {
    e.preventDefault(); setSaving(true); setError('')
    try {
      const payload = {...form, address:{city:form.city,state:form.state,street:form.street,pincode:form.pincode},
        specializations:form.specializations?form.specializations.split(',').map(s=>s.trim()).filter(Boolean):[]}
      modal==='create' ? await recyclingAPI.createCompany(payload) : await recyclingAPI.updateCompany(modal._id,payload)
      toast.success(modal==='create'?'Company added!':'Updated!'); setModal(null); load()
    } catch (err) { setError(err.response?.data?.message||'Failed') } finally { setSaving(false) }
  }

  const del = async (id,name) => { if(!confirm(`Remove ${name}?`))return; try{await recyclingAPI.deleteCompany(id);toast.success('Removed');load()}catch{toast.error('Failed')} }

  if (loading) return <div className="flex justify-center py-20"><Loader size="lg"/></div>

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display font-black text-2xl text-eco-900">Recycling Companies</h1>
        <button onClick={openCreate} className="btn-eco text-sm"><Plus size={14}/> Add Company</button>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {companies.map(c=>(
          <div key={c._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-display font-bold text-eco-900">{c.name}</h3>
              <div className="flex gap-1">
                <button onClick={()=>openEdit(c)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg"><Pencil size={13}/></button>
                <button onClick={()=>del(c._id,c.name)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={13}/></button>
              </div>
            </div>
            <p className="text-xs font-body text-gray-500">{c.email}</p>
            <p className="text-xs font-body text-gray-500">{c.phone}</p>
            <p className="text-xs font-body text-gray-400 mt-1">{c.address?.city}, {c.address?.state}</p>
          </div>
        ))}
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-lg my-8 p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display font-bold text-xl text-eco-900">{modal==='create'?'Add Company':'Edit Company'}</h2>
              <button onClick={()=>setModal(null)} className="p-1.5 text-gray-400 hover:text-gray-700 rounded-xl hover:bg-gray-100"><X size={18}/></button>
            </div>
            {error&&<div className="mb-4"><ErrorMsg message={error}/></div>}
            <form onSubmit={save} className="grid grid-cols-2 gap-4">
              <div className="col-span-2"><label className="label-eco">Company Name *</label><input className="input-eco" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} required/></div>
              <div><label className="label-eco">Email *</label><input type="email" className="input-eco" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} required/></div>
              <div><label className="label-eco">Phone *</label><input className="input-eco" value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))} required/></div>
              <div className="col-span-2"><label className="label-eco">Website</label><input type="url" className="input-eco" value={form.website} onChange={e=>setForm(f=>({...f,website:e.target.value}))}/></div>
              <div><label className="label-eco">City *</label><input className="input-eco" value={form.city} onChange={e=>setForm(f=>({...f,city:e.target.value}))} required/></div>
              <div><label className="label-eco">State *</label><input className="input-eco" value={form.state} onChange={e=>setForm(f=>({...f,state:e.target.value}))} required/></div>
              <div className="col-span-2"><label className="label-eco">Street</label><input className="input-eco" value={form.street} onChange={e=>setForm(f=>({...f,street:e.target.value}))}/></div>
              <div><label className="label-eco">Pincode</label><input className="input-eco" value={form.pincode} onChange={e=>setForm(f=>({...f,pincode:e.target.value}))}/></div>
              <div className="col-span-2"><label className="label-eco">Description</label><textarea className="input-eco" rows={2} value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))}/></div>
              <div className="col-span-2"><label className="label-eco">Specializations <span className="text-eco-300 font-normal">(comma-separated)</span></label><input className="input-eco" value={form.specializations} onChange={e=>setForm(f=>({...f,specializations:e.target.value}))}/></div>
              <div className="col-span-2 flex gap-3 pt-2">
                <button type="button" onClick={()=>setModal(null)} className="btn-ghost flex-1 border border-eco-200">Cancel</button>
                <button type="submit" disabled={saving} className="btn-eco flex-1">{saving?<Loader size="sm"/>:<Save size={14}/>} Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

/* ═══════════════════════ IMPACT CONFIG ═════════════════════ */
export function AdminConfig() {
  const [config,setConfig]   =useState(null)
  const [loading,setLoading] =useState(true)
  const [saving,setSaving]   =useState(false)
  const [error,setError]     =useState('')

  useEffect(()=>{ recyclingAPI.getConfig().then(({data})=>setConfig(data.config)).finally(()=>setLoading(false)) },[])

  const save = async (e) => {
    e.preventDefault(); setSaving(true); setError('')
    try { const {data}=await recyclingAPI.updateConfig(config); setConfig(data.config); toast.success('Config saved! 🌿') }
    catch (err) { setError(err.response?.data?.message||'Save failed') } finally { setSaving(false) }
  }

  if (loading) return <div className="flex justify-center py-20"><Loader size="lg"/></div>

  const fields = [
    {key:'paperSavedPerBookKg',    label:'Paper Saved per Book',  unit:'kg',   hint:'Default: 0.5 kg'},
    {key:'waterSavedPerBookLiters',label:'Water Saved per Book',  unit:'liters',hint:'Default: 3.5 liters'},
    {key:'co2ReductionPerBookKg',  label:'CO₂ Reduction per Book',unit:'kg',   hint:'Default: 0.8 kg'},
    {key:'couponDiscountPercent',  label:'Coupon Discount',        unit:'%',    hint:'e.g. 10 for 10% off'},
    {key:'minBooksForCoupon',      label:'Min Books for Coupon',   unit:'books',hint:'e.g. 5 minimum'},
    {key:'couponValidDays',        label:'Coupon Valid For',       unit:'days', hint:'e.g. 30 days'},
  ]

  return (
    <div className="p-6 lg:p-8">
      <h1 className="font-display font-black text-2xl text-eco-900 mb-2">Impact Configuration</h1>
      <p className="font-body text-sm text-eco-400 mb-6">Configure constants used to calculate environmental impact when a recycling request is completed.</p>
      <div className="max-w-lg">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          {error && <div className="mb-4"><ErrorMsg message={error}/></div>}
          <form onSubmit={save} className="space-y-5">
            <div>
              <p className="text-xs font-display font-bold text-eco-400 uppercase tracking-widest mb-4 border-b border-eco-50 pb-2">Impact Per Book Recycled</p>
              {fields.slice(0,3).map(({key,label,unit,hint})=>(
                <div key={key} className="mb-4">
                  <label className="label-eco">{label} <span className="text-eco-300 font-normal">({unit})</span></label>
                  <input type="number" step="0.01" min="0" className="input-eco"
                    value={config[key]} onChange={e=>setConfig(c=>({...c,[key]:parseFloat(e.target.value)}))}/>
                  <p className="text-xs font-body text-eco-300 mt-1">{hint}</p>
                </div>
              ))}
            </div>
            <div>
              <p className="text-xs font-display font-bold text-eco-400 uppercase tracking-widest mb-4 border-b border-eco-50 pb-2">Coupon Reward Settings</p>
              {fields.slice(3).map(({key,label,unit,hint})=>(
                <div key={key} className="mb-4">
                  <label className="label-eco">{label} <span className="text-eco-300 font-normal">({unit})</span></label>
                  <input type="number" min="0" className="input-eco"
                    value={config[key]} onChange={e=>setConfig(c=>({...c,[key]:parseFloat(e.target.value)}))}/>
                  <p className="text-xs font-body text-eco-300 mt-1">{hint}</p>
                </div>
              ))}
            </div>
            <button type="submit" disabled={saving} className="btn-eco w-full">
              {saving?<Loader size="sm"/>:<Save size={15}/>} Save Configuration
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
