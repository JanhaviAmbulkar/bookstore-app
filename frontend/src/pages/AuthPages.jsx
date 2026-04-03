import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ErrorMsg, Loader } from '../components/common'
import { Leaf, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'

function AuthShell({ children, title, subtitle, quote }) {
  return (
    <div className="min-h-screen flex">
      {/* Left green panel */}
      <div className="hidden lg:flex lg:w-2/5 bg-eco-gradient flex-col justify-between p-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full translate-x-20 -translate-y-20 blob"/>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -translate-x-10 translate-y-10 blob" style={{animationDelay:'3s'}}/>
        <Link to="/" className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <Leaf size={20} className="text-white" />
          </div>
          <div>
            <p className="font-display font-black text-white text-lg">EcoReads</p>
            <p className="font-body text-white/50 text-xs">Sustainable Bookstore</p>
          </div>
        </Link>
        <div className="relative z-10">
          <p className="font-display font-bold text-white text-2xl leading-relaxed italic mb-4">"{quote}"</p>
          <div className="flex flex-col gap-3 mt-6">
            {['Shop sustainably','Recycle & earn rewards','Track your eco impact'].map(f=>(
              <div key={f} className="flex items-center gap-2.5 text-white/70 text-sm font-body">
                <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Leaf size={10} className="text-eco-200"/>
                </div>
                {f}
              </div>
            ))}
          </div>
        </div>
        <p className="text-white/30 text-xs font-body relative z-10">© {new Date().getFullYear()} EcoReads</p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-sage-50">
        <div className="w-full max-w-md fade-up">
          {/* Mobile logo */}
          <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 bg-eco-gradient rounded-xl flex items-center justify-center shadow-eco">
              <Leaf size={17} className="text-white"/>
            </div>
            <span className="font-display font-black text-eco-800 text-xl">EcoReads</span>
          </Link>
          <h1 className="font-display font-black text-eco-900 text-3xl mb-1">{title}</h1>
          <p className="font-body text-eco-400 text-sm mb-7">{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  )
}

export function LoginPage() {
  const { login } = useAuth()
  const navigate  = useNavigate()
  const location  = useLocation()
  const from      = location.state?.from?.pathname || '/'
  const [form, setForm]       = useState({ email:'', password:'' })
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [show, setShow]       = useState(false)

  const submit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true)
    try { await login(form.email, form.password); toast.success('Welcome back! 🌿'); navigate(from, {replace:true}) }
    catch (err) { setError(err.response?.data?.message || 'Login failed') }
    finally { setLoading(false) }
  }

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to continue your eco journey"
      quote="Read green, live clean — every page is a step toward sustainability.">
      {error && <div className="mb-4"><ErrorMsg message={error}/></div>}
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="label-eco">Email address</label>
          <input type="email" className="input-eco" placeholder="you@example.com" autoFocus
            value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} required/>
        </div>
        <div>
          <label className="label-eco">Password</label>
          <div className="relative">
            <input type={show?'text':'password'} className="input-eco pr-10" placeholder="••••••••"
              value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))} required/>
            <button type="button" onClick={()=>setShow(!show)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-eco-400 hover:text-eco-600">
              {show?<EyeOff size={16}/>:<Eye size={16}/>}
            </button>
          </div>
        </div>
        <button type="submit" disabled={loading} className="btn-eco w-full py-3 mt-2">
          {loading&&<Loader size="sm"/>} {loading?'Signing in...':'Sign In'}
        </button>
      </form>
      <p className="mt-5 text-center text-sm font-body text-eco-500">
        No account? <Link to="/register" className="text-eco-700 font-semibold hover:underline">Join EcoReads free</Link>
      </p>
      <div className="mt-6 p-4 bg-eco-50 border border-eco-100 rounded-xl">
        <p className="text-xs font-body font-semibold text-eco-500 mb-1.5">Demo accounts:</p>
        <p className="text-xs font-body text-eco-600">User: <strong>john@example.com / password123</strong></p>
        <p className="text-xs font-body text-eco-600 mt-0.5">Admin: <strong>admin@bookstore.com / admin123</strong></p>
      </div>
    </AuthShell>
  )
}

export function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm]       = useState({ name:'', email:'', password:'', phone:'' })
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [show, setShow]       = useState(false)

  const submit = async (e) => {
    e.preventDefault(); setError(''); if(form.password.length<6){setError('Password must be 6+ chars');return} setLoading(true)
    try { await register(form); toast.success('Welcome to EcoReads! 🌿'); navigate('/') }
    catch (err) { setError(err.response?.data?.message||'Registration failed') }
    finally { setLoading(false) }
  }

  return (
    <AuthShell title="Join EcoReads" subtitle="Free account — start your eco reading journey"
      quote="One book recycled can save half a kilogram of paper. Imagine a world full of readers like you.">
      {error && <div className="mb-4"><ErrorMsg message={error}/></div>}
      <form onSubmit={submit} className="space-y-4">
        {[['name','Full Name','text','John Doe'],['email','Email Address','email','you@example.com'],['phone','Phone (optional)','tel','+91 ...']]
          .map(([key,label,type,ph])=>(
          <div key={key}>
            <label className="label-eco">{label}</label>
            <input type={type} className="input-eco" placeholder={ph}
              value={form[key]} onChange={e=>setForm(f=>({...f,[key]:e.target.value}))}
              required={key!=='phone'} autoFocus={key==='name'}/>
          </div>
        ))}
        <div>
          <label className="label-eco">Password</label>
          <div className="relative">
            <input type={show?'text':'password'} className="input-eco pr-10" placeholder="6+ characters"
              value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))} required/>
            <button type="button" onClick={()=>setShow(!show)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-eco-400 hover:text-eco-600">
              {show?<EyeOff size={16}/>:<Eye size={16}/>}
            </button>
          </div>
        </div>
        <button type="submit" disabled={loading} className="btn-eco w-full py-3 mt-2">
          {loading&&<Loader size="sm"/>} {loading?'Creating account...':'Create Free Account'}
        </button>
      </form>
      <p className="mt-5 text-center text-sm font-body text-eco-500">
        Already have an account? <Link to="/login" className="text-eco-700 font-semibold hover:underline">Sign in</Link>
      </p>
    </AuthShell>
  )
}
