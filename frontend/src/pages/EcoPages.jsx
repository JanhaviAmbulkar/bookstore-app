import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { userAPI } from '../api'
import { useAuth } from '../context/AuthContext'
import { Loader, ErrorMsg } from '../components/common'
import { Leaf, Droplets, Wind, BookOpen, Tag, CheckCircle, User, Lock, TreePine, Globe, Recycle, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'

/* ── IMPACT DASHBOARD ─────────────────────────────────────── */
export function ImpactDashboard() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    userAPI.getProfile().then(({ data }) => setProfile(data.user)).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex items-center justify-center min-h-96"><Loader size="lg" /></div>

  const imp = profile?.environmentalImpact || {}
  const coupons = (profile?.coupons || []).filter(c => !c.isUsed && new Date(c.expiresAt) > new Date())

  const stats = [
    { icon: BookOpen, label: 'Books Recycled', value: imp.totalBooksRecycled || 0, unit: '',     color: 'text-eco-600',   bg: 'bg-eco-50',   border: 'border-eco-200' },
    { icon: Leaf,     label: 'Paper Saved',    value: (imp.paperSavedKg || 0).toFixed(1), unit: 'kg', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
    { icon: Droplets, label: 'Water Saved',    value: (imp.waterSavedLiters || 0).toFixed(0), unit: 'L', color: 'text-blue-600',  bg: 'bg-blue-50',  border: 'border-blue-200' },
    { icon: Wind,     label: 'CO₂ Reduced',   value: (imp.co2ReductionKg || 0).toFixed(1), unit: 'kg', color: 'text-sky-600',   bg: 'bg-sky-50',   border: 'border-sky-200' },
  ]

  return (
    <div className="p-6 lg:p-8 fade-up">
      <div className="bg-eco-gradient rounded-2xl p-6 text-white mb-6 relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-40 h-40 bg-white/5 rounded-full blob" />
        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <Globe size={20} className="text-white" />
          </div>
          <div>
            <h1 className="font-display font-black text-xl text-white">Your Impact Dashboard</h1>
            <p className="text-white/60 text-xs font-body">Cumulative environmental contribution</p>
          </div>
        </div>
        <p className="font-body text-white/70 text-sm mt-3 relative">
          {imp.totalBooksRecycled > 0
            ? `You've recycled ${imp.totalBooksRecycled} books and made a real difference! 🌍`
            : 'Start recycling books to track your environmental impact here.'}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map(({ icon: Icon, label, value, unit, color, bg, border }) => (
          <div key={label} className={`card p-5 border ${border}`}>
            <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
              <Icon size={20} className={color} />
            </div>
            <p className={`font-display font-black text-2xl ${color}`}>{value}<span className="text-base font-bold">{unit}</span></p>
            <p className="font-body text-xs text-eco-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="card p-5">
          <h2 className="font-display font-bold text-eco-800 mb-4 flex items-center gap-2"><TreePine size={16} /> Milestones</h2>
          {[
            { label: 'First Recycle', done: imp.totalBooksRecycled >= 1,  req: 'Recycle 1 book' },
            { label: 'Eco Starter',   done: imp.totalBooksRecycled >= 5,  req: 'Recycle 5 books' },
            { label: 'Green Reader',  done: imp.totalBooksRecycled >= 10, req: 'Recycle 10 books' },
            { label: 'Planet Hero',   done: imp.totalBooksRecycled >= 25, req: 'Recycle 25 books' },
          ].map(({ label, done, req }) => (
            <div key={label} className={`flex items-center gap-3 p-3 rounded-xl mb-2 border ${done ? 'bg-eco-50 border-eco-200' : 'bg-gray-50 border-gray-100'}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${done ? 'bg-eco-500' : 'bg-gray-200'}`}>
                {done ? <CheckCircle size={14} className="text-white" /> : <span className="text-gray-400 text-xs">?</span>}
              </div>
              <div>
                <p className={`font-display font-bold text-sm ${done ? 'text-eco-800' : 'text-gray-400'}`}>{label}</p>
                <p className={`font-body text-xs ${done ? 'text-eco-500' : 'text-gray-400'}`}>{req}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="card p-5">
          <h2 className="font-display font-bold text-eco-800 mb-4 flex items-center gap-2"><Tag size={16} /> Reward Coupons</h2>
          {coupons.length === 0 ? (
            <div className="text-center py-6">
              <Tag size={32} className="text-eco-200 mx-auto mb-2" />
              <p className="font-display font-semibold text-eco-500 text-sm">No coupons yet</p>
              <p className="font-body text-xs text-eco-400 mt-1">Recycle 5+ books to earn discount coupons</p>
              <Link to="/recycling" className="btn-eco text-xs mt-3 inline-flex">Recycle Now <ArrowRight size={12} /></Link>
            </div>
          ) : (
            <div className="space-y-3">
              {coupons.map((c, i) => (
                <div key={i} className="border-2 border-dashed border-eco-300 rounded-xl p-4 bg-eco-50 relative overflow-hidden">
                  <div className="absolute -right-3 -top-3 w-16 h-16 bg-eco-100 rounded-full" />
                  <p className="font-display font-black text-eco-700 text-xl relative">{c.discount}% OFF</p>
                  <p className="font-mono text-sm text-eco-600 font-semibold tracking-wider bg-white border border-eco-200 inline-block px-2 py-0.5 rounded-lg mt-1">{c.code}</p>
                  <p className="font-body text-xs text-eco-400 mt-2">Expires {new Date(c.expiresAt).toLocaleDateString('en-IN')}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ── ECO TIPS ─────────────────────────────────────────────── */
export function EcoTipsPage() {
  const tips = [
    { icon: '📚', title: 'Donate before discarding',  desc: 'Before throwing out old books, donate them to local libraries, schools, or book drives.' },
    { icon: '♻️', title: 'Use the recycling program', desc: 'Submit your old books through EcoReads recycling — we ensure they are properly repurposed.' },
    { icon: '🌿', title: 'Choose secondhand',         desc: 'Buying used books reduces demand for new paper production, saving forests and water.' },
    { icon: '💧', title: 'Every book counts',          desc: 'A single book takes ~10 liters of water to produce. Recycling one conserves this resource.' },
    { icon: '🌍', title: "Share, don't hoard",         desc: 'A book unread is a wasted resource. Share or lend books within your community.' },
    { icon: '🌱', title: 'Track your impact',          desc: 'Use the Impact Dashboard to monitor your cumulative environmental contribution.' },
  ]
  return (
    <div className="p-6 lg:p-8 fade-up">
      <div className="bg-eco-gradient rounded-2xl p-6 text-white mb-8 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-48 h-48 bg-white/5 rounded-full blob" />
        <div className="relative">
          <h1 className="font-display font-black text-2xl mb-2">🌿 Eco Tips</h1>
          <p className="font-body text-white/70 text-sm">Small actions, massive collective impact. Here's how to make every read count.</p>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger">
        {tips.map(({ icon, title, desc }) => (
          <div key={title} className="card-hover p-5">
            <div className="text-3xl mb-3">{icon}</div>
            <h3 className="font-display font-bold text-eco-800 mb-2">{title}</h3>
            <p className="font-body text-sm text-eco-500 leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── PROFILE PAGE ─────────────────────────────────────────── */
export function ProfilePage() {
  const { updateUser } = useAuth()
  const [profile, setProfile]   = useState(null)
  const [loading, setLoading]   = useState(true)
  const [tab, setTab]           = useState('profile')
  const [form, setForm]         = useState({})
  const [pwForm, setPwForm]     = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [saving, setSaving]     = useState(false)
  const [pwSaving, setPwSaving] = useState(false)
  const [error, setError]       = useState('')
  const [pwError, setPwError]   = useState('')

  useEffect(() => {
    userAPI.getProfile().then(({ data }) => {
      setProfile(data.user)
      setForm({
        name: data.user.name || '', phone: data.user.phone || '',
        street: data.user.address?.street || '', city: data.user.address?.city || '',
        state: data.user.address?.state || '', pincode: data.user.address?.pincode || '',
      })
    }).finally(() => setLoading(false))
  }, [])

  const saveProfile = async (e) => {
    e.preventDefault(); setSaving(true); setError('')
    try {
      const { data } = await userAPI.updateProfile({
        name: form.name, phone: form.phone,
        address: { street: form.street, city: form.city, state: form.state, pincode: form.pincode },
      })
      setProfile(data.user); updateUser({ name: data.user.name }); toast.success('Profile saved!')
    } catch (err) { setError(err.response?.data?.message || 'Update failed') }
    finally { setSaving(false) }
  }

  const savePassword = async (e) => {
    e.preventDefault()
    if (pwForm.newPassword !== pwForm.confirmPassword) { setPwError('Passwords do not match'); return }
    setPwSaving(true); setPwError('')
    try {
      await userAPI.changePassword({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword })
      toast.success('Password changed!')
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) { setPwError(err.response?.data?.message || 'Failed') }
    finally { setPwSaving(false) }
  }

  if (loading) return <div className="flex items-center justify-center min-h-96"><Loader size="lg" /></div>

  const TABS = [
    { id: 'profile', label: 'Profile', Icon: User },
    { id: 'password', label: 'Password', Icon: Lock },
    { id: 'impact', label: 'My Impact', Icon: Leaf },
  ]

  return (
    <div className="p-6 lg:p-8 fade-up">
      <div className="flex items-center gap-4 mb-7">
        <div className="w-14 h-14 bg-eco-gradient rounded-2xl flex items-center justify-center shadow-eco">
          <span className="font-display font-black text-white text-xl">{profile?.name?.charAt(0).toUpperCase()}</span>
        </div>
        <div>
          <h1 className="font-display font-black text-2xl text-eco-900">{profile?.name}</h1>
          <p className="font-body text-sm text-eco-400">{profile?.email}</p>
        </div>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {TABS.map(({ id, label, Icon }) => (
          <button key={id} onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-display font-bold transition-all ${
              tab === id ? 'bg-eco-gradient text-white shadow-eco' : 'bg-white text-eco-600 border border-eco-200 hover:border-eco-400'
            }`}>
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>

      {tab === 'profile' && (
        <div className="card p-6 max-w-xl">
          <h2 className="font-display font-bold text-eco-800 mb-5">Personal Info</h2>
          {error && <div className="mb-4"><ErrorMsg message={error} /></div>}
          <form onSubmit={saveProfile} className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2"><label className="label-eco">Full Name</label><input className="input-eco" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required /></div>
            <div className="sm:col-span-2"><label className="label-eco">Email <span className="text-eco-300 font-normal text-xs">(read-only)</span></label><input className="input-eco opacity-50 cursor-not-allowed" value={profile?.email} disabled /></div>
            <div><label className="label-eco">Phone</label><input className="input-eco" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} /></div>
            <div className="sm:col-span-2 border-t border-eco-100 pt-3 mt-1"><p className="font-display font-bold text-sm text-eco-700 mb-3">Default Address</p></div>
            <div className="sm:col-span-2"><label className="label-eco">Street</label><input className="input-eco" value={form.street} onChange={e => setForm(f => ({ ...f, street: e.target.value }))} /></div>
            <div><label className="label-eco">City</label><input className="input-eco" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} /></div>
            <div><label className="label-eco">Pincode</label><input className="input-eco" value={form.pincode} onChange={e => setForm(f => ({ ...f, pincode: e.target.value }))} /></div>
            <div className="sm:col-span-2"><button type="submit" disabled={saving} className="btn-eco text-sm">{saving && <Loader size="sm" />} Save Changes</button></div>
          </form>
        </div>
      )}

      {tab === 'password' && (
        <div className="card p-6 max-w-md">
          <h2 className="font-display font-bold text-eco-800 mb-5">Change Password</h2>
          {pwError && <div className="mb-4"><ErrorMsg message={pwError} /></div>}
          <form onSubmit={savePassword} className="space-y-4">
            {[['currentPassword', 'Current Password'], ['newPassword', 'New Password'], ['confirmPassword', 'Confirm Password']].map(([k, l]) => (
              <div key={k}><label className="label-eco">{l}</label><input type="password" className="input-eco" value={pwForm[k]} onChange={e => setPwForm(f => ({ ...f, [k]: e.target.value }))} required /></div>
            ))}
            <button type="submit" disabled={pwSaving} className="btn-eco text-sm">{pwSaving && <Loader size="sm" />} Update Password</button>
          </form>
        </div>
      )}

      {tab === 'impact' && <ImpactDashboard />}
    </div>
  )
}
