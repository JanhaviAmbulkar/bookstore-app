import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { recyclingAPI } from '../api'
import { Loader, EmptyState, StatusBadge, ErrorMsg } from '../components/common'
import { Recycle, Leaf, Droplets, Wind, CheckCircle, Tag, X, Send, Building2, Mail, Phone, Globe, MapPin, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'

const STATES = ['Andhra Pradesh','Maharashtra','Karnataka','Tamil Nadu','Gujarat','Rajasthan','Uttar Pradesh','West Bengal','Delhi','Kerala','Punjab','Haryana','Telangana','Madhya Pradesh','Bihar','Odisha','Assam','Jharkhand','Chhattisgarh','Uttarakhand','Himachal Pradesh','Goa','Jammu and Kashmir']

/* ─────────────────── RECYCLING SUBMIT ──────────────────── */
export function RecyclingPage() {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError]           = useState('')
  const [form, setForm] = useState({
    numberOfBooks:'', condition:'', pickupType:'',
    street:'', city:'', state:'', pincode:'',
    preferredDate:'', additionalNotes:'',
  })
  const set = (k,v) => setForm(f=>({...f,[k]:v}))

  const submit = async (e) => {
    e.preventDefault(); setError(''); setSubmitting(true)
    try {
      await recyclingAPI.submitRequest({
        numberOfBooks: Number(form.numberOfBooks), condition: form.condition,
        pickupType: form.pickupType,
        address: {street:form.street, city:form.city, state:form.state, pincode:form.pincode},
        preferredDate: form.preferredDate || undefined,
        additionalNotes: form.additionalNotes || undefined,
      })
      toast.success('Recycling request submitted! 🌿')
      navigate('/recycling/track')
    } catch (err) { setError(err.response?.data?.message || 'Submission failed') }
    finally { setSubmitting(false) }
  }

  return (
    <div className="p-6 lg:p-8 fade-up">
      {/* Hero banner */}
      <div className="bg-eco-gradient rounded-2xl p-6 lg:p-8 text-white mb-8 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-48 h-48 bg-white/5 rounded-full blob"/>
        <div className="absolute -left-5 -bottom-10 w-36 h-36 bg-white/5 rounded-full blob" style={{animationDelay:'3s'}}/>
        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/15 px-3 py-1 rounded-full text-xs font-display font-bold mb-4 border border-white/20">
              <Recycle size={12}/> Book Recycling Program
            </div>
            <h1 className="font-display font-black text-3xl mb-2">Recycle Your Books</h1>
            <p className="font-body text-white/70 text-sm leading-relaxed">
              Give your old books a new life. Submit a request for pickup or drop-off and earn eco reward coupons!
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              {icon:Leaf,     label:'~0.5kg paper', color:'bg-white/15'},
              {icon:Droplets, label:'~3.5L water',  color:'bg-white/15'},
              {icon:Wind,     label:'~0.8kg CO₂',   color:'bg-white/15'},
            ].map(({icon:Icon,label,color})=>(
              <div key={label} className={`${color} rounded-xl p-3 text-center border border-white/15`}>
                <Icon size={18} className="mx-auto mb-1 opacity-80"/>
                <p className="text-xs font-body text-white/70">{label} saved</p>
              </div>
            ))}
            <p className="col-span-3 text-center text-xs text-white/40">per book recycled</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl">
        <div className="card p-6">
          <h2 className="font-display font-bold text-eco-800 mb-5">Submit Recycling Request</h2>
          {error && <div className="mb-4"><ErrorMsg message={error}/></div>}
          <form onSubmit={submit} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label-eco">Number of Books *</label>
                <input type="number" min="1" className="input-eco" value={form.numberOfBooks}
                  onChange={e=>set('numberOfBooks',e.target.value)} required placeholder="e.g. 10"/>
              </div>
              <div>
                <label className="label-eco">Book Condition *</label>
                <select className="select-eco" value={form.condition} onChange={e=>set('condition',e.target.value)} required>
                  <option value="">Select condition</option>
                  {['Like New','Good','Fair','Poor'].map(c=><option key={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="label-eco">Pickup Type *</label>
              <div className="grid grid-cols-2 gap-3">
                {['Pickup','Drop-off'].map(type=>(
                  <label key={type} className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    form.pickupType===type?'border-eco-500 bg-eco-50':'border-eco-100 hover:border-eco-300'}`}>
                    <input type="radio" name="pickupType" value={type} checked={form.pickupType===type}
                      onChange={()=>set('pickupType',type)} className="sr-only"/>
                    <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 transition-all ${
                      form.pickupType===type?'border-eco-600 bg-eco-600':'border-eco-300'}`}/>
                    <div>
                      <p className="font-display font-bold text-sm text-eco-800">{type}</p>
                      <p className="font-body text-xs text-eco-400">{type==='Pickup'?'We come to you':'You drop it off'}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="label-eco">Address *</label>
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <input className="input-eco" placeholder="Street address" value={form.street} onChange={e=>set('street',e.target.value)} required/>
                </div>
                <input className="input-eco" placeholder="City" value={form.city} onChange={e=>set('city',e.target.value)} required/>
                <select className="select-eco" value={form.state} onChange={e=>set('state',e.target.value)} required>
                  <option value="">State</option>
                  {STATES.map(s=><option key={s}>{s}</option>)}
                </select>
                <input className="input-eco" placeholder="Pincode" value={form.pincode} onChange={e=>set('pincode',e.target.value)} required maxLength={6}/>
              </div>
            </div>

            <div>
              <label className="label-eco">Preferred Date <span className="text-eco-300 font-normal">(optional)</span></label>
              <input type="date" className="input-eco" value={form.preferredDate}
                min={new Date().toISOString().split('T')[0]} onChange={e=>set('preferredDate',e.target.value)}/>
            </div>

            <div>
              <label className="label-eco">Notes <span className="text-eco-300 font-normal">(optional)</span></label>
              <textarea className="input-eco" rows={3} value={form.additionalNotes}
                onChange={e=>set('additionalNotes',e.target.value)} placeholder="Any special instructions..."/>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-start gap-2 text-sm font-body text-amber-800">
              <Tag size={15} className="flex-shrink-0 mt-0.5 text-amber-600"/>
              <span>Recycle <strong>5+ books</strong> to earn a discount coupon on your next purchase!</span>
            </div>

            <button type="submit" disabled={submitting} className="btn-eco w-full py-3">
              {submitting?<Loader size="sm"/>:<Recycle size={16}/>}
              {submitting?'Submitting...':'Submit Recycling Request'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────── RECYCLING TRACKING ────────────────── */
export function RecyclingTrackPage() {
  const [requests,setRequests]=useState([])
  const [loading,setLoading]  =useState(true)
  const [selected,setSelected]=useState(null)

  useEffect(()=>{
    recyclingAPI.getMyRequests().then(({data})=>setRequests(data.requests)).finally(()=>setLoading(false))
  },[])

  if (loading) return <div className="flex items-center justify-center min-h-96"><Loader size="lg"/></div>

  const steps = ['Pending','Scheduled','Completed']

  return (
    <div className="p-6 lg:p-8 fade-up">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="page-title">My Recycling Requests</h1>
        <Link to="/recycling" className="btn-eco text-sm"><Recycle size={14}/> New Request</Link>
      </div>

      {requests.length===0?(
        <EmptyState icon={Recycle} title="No recycling requests"
          description="Submit your first recycling request to start making an impact."
          action={<Link to="/recycling" className="btn-eco text-sm">Submit Request</Link>}/>
      ):(
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* List */}
          <div className="space-y-2">
            {requests.map(req=>(
              <button key={req._id} onClick={()=>setSelected(req)}
                className={`w-full text-left card p-4 transition-all hover:shadow-card-hover ${selected?._id===req._id?'border-eco-400 shadow-eco':''}`}>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-body text-xs text-eco-400">#{req._id.slice(-6).toUpperCase()}</p>
                    <p className="font-display font-bold text-eco-900 text-sm mt-0.5">{req.numberOfBooks} books</p>
                    <p className="font-body text-xs text-eco-400 mt-0.5">{req.pickupType} · {req.condition}</p>
                  </div>
                  <StatusBadge status={req.status}/>
                </div>
              </button>
            ))}
          </div>

          {/* Detail */}
          <div className="lg:col-span-2">
            {!selected?(
              <div className="card p-10 text-center h-full flex flex-col items-center justify-center">
                <Recycle size={36} className="text-eco-200 mb-3"/>
                <p className="font-body text-eco-400 text-sm">Select a request to view details</p>
              </div>
            ):(
              <div className="card p-6 space-y-5">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-body text-xs text-eco-400">#{selected._id.slice(-8).toUpperCase()}</p>
                    <h2 className="font-display font-black text-xl text-eco-900 mt-0.5">{selected.numberOfBooks} Books</h2>
                  </div>
                  <StatusBadge status={selected.status}/>
                </div>

                {/* Progress */}
                {selected.status!=='Cancelled'&&(
                  <div className="flex items-center justify-between relative py-2">
                    <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-eco-100 z-0"/>
                    <div className="absolute left-0 top-1/2 h-0.5 bg-eco-gradient z-0 transition-all"
                      style={{width:`${(steps.indexOf(selected.status)/(steps.length-1))*100}%`}}/>
                    {steps.map((step,i)=>{
                      const active=i<=steps.indexOf(selected.status)
                      return(
                        <div key={step} className="flex flex-col items-center z-10">
                          <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs transition-all ${active?'bg-eco-gradient border-eco-600 text-white shadow-eco':'bg-white border-eco-200 text-eco-300'}`}>
                            {active&&i<steps.indexOf(selected.status)?<CheckCircle size={14}/>:i+1}
                          </div>
                          <span className={`text-xs font-display font-bold mt-2 ${active?'text-eco-700':'text-eco-300'}`}>{step}</span>
                        </div>
                      )
                    })}
                  </div>
                )}

                {/* Details */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {[['Condition',selected.condition],['Type',selected.pickupType],
                    ['Submitted',new Date(selected.createdAt).toLocaleDateString('en-IN')],
                    selected.scheduledDate&&['Scheduled',new Date(selected.scheduledDate).toLocaleDateString('en-IN')]
                  ].filter(Boolean).map(([l,v])=>(
                    <div key={l} className="bg-eco-50 rounded-xl p-3">
                      <p className="font-body text-xs text-eco-400">{l}</p>
                      <p className="font-display font-bold text-eco-800 text-sm mt-0.5">{v}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-eco-50 rounded-xl p-3 text-sm font-body">
                  <p className="text-eco-400 text-xs mb-1">Address</p>
                  <p className="text-eco-700">{selected.address.street}, {selected.address.city}, {selected.address.state} — {selected.address.pincode}</p>
                </div>

                {/* Completed impact */}
                {selected.status==='Completed'&&selected.impactCalculated&&(
                  <div className="bg-eco-gradient rounded-xl p-5 text-white">
                    <h3 className="font-display font-bold mb-3 flex items-center gap-2"><Leaf size={16}/> Your Impact</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        {icon:Leaf,     label:'Paper',  val:`${selected.environmentalImpact.paperSavedKg}kg`},
                        {icon:Droplets, label:'Water',  val:`${selected.environmentalImpact.waterSavedLiters}L`},
                        {icon:Wind,     label:'CO₂',    val:`${selected.environmentalImpact.co2ReductionKg}kg`},
                      ].map(({icon:Icon,label,val})=>(
                        <div key={label} className="bg-white/15 rounded-xl p-3 text-center border border-white/15">
                          <Icon size={16} className="mx-auto mb-1 opacity-80"/>
                          <p className="font-display font-black text-sm">{val}</p>
                          <p className="text-white/60 text-xs">{label} saved</p>
                        </div>
                      ))}
                    </div>
                    {selected.rewardCouponCode&&(
                      <div className="mt-4 bg-white/15 border border-white/20 rounded-xl p-3 flex items-center gap-3">
                        <Tag size={18} className="text-amber-300 flex-shrink-0"/>
                        <div>
                          <p className="font-display font-bold text-sm">🎉 Reward Coupon Earned!</p>
                          <p className="font-mono text-amber-300 font-bold tracking-wider">{selected.rewardCouponCode}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {selected.adminNotes&&(
                  <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-sm font-body text-blue-700">
                    <strong>Note from team:</strong> {selected.adminNotes}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

/* ─────────────────── COMPANIES PAGE ───────────────────── */
export function CompaniesPage() {
  const [companies,setCompanies]=useState([])
  const [loading,setLoading]    =useState(true)
  const [selected,setSelected]  =useState(null)
  const [form,setForm]          =useState({name:'',email:'',message:''})
  const [sending,setSending]    =useState(false)
  const [error,setError]        =useState('')

  useEffect(()=>{
    recyclingAPI.getCompanies().then(({data})=>setCompanies(data.companies)).finally(()=>setLoading(false))
  },[])

  const sendMsg = async (e) => {
    e.preventDefault();setError('');setSending(true)
    try{await recyclingAPI.sendContact(selected._id,form);toast.success('Message sent! 🌿');setSelected(null);setForm({name:'',email:'',message:''})}
    catch(err){setError(err.response?.data?.message||'Failed')}finally{setSending(false)}
  }

  if(loading) return <div className="flex items-center justify-center min-h-96"><Loader size="lg"/></div>

  return(
    <div className="p-6 lg:p-8 fade-up">
      <div className="bg-eco-gradient rounded-2xl p-6 text-white mb-8 relative overflow-hidden">
        <div className="absolute -right-10 top-0 w-40 h-40 bg-white/5 rounded-full blob"/>
        <div className="relative">
          <h1 className="font-display font-black text-2xl mb-1">Recycling Partners</h1>
          <p className="font-body text-white/70 text-sm">Trusted companies that ensure your books find new purpose.</p>
        </div>
      </div>

      {companies.length===0?(
        <EmptyState icon={Building2} title="No partners yet" description="Partner companies coming soon!"/>
      ):(
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger">
          {companies.map(c=>(
            <div key={c._id} className="card-hover p-5 flex flex-col">
              <div className="w-12 h-12 bg-eco-gradient rounded-xl flex items-center justify-center mb-4 shadow-eco">
                <Building2 size={20} className="text-white"/>
              </div>
              <h3 className="font-display font-bold text-eco-900 mb-1">{c.name}</h3>
              {c.description&&<p className="font-body text-sm text-eco-500 mb-3 line-clamp-2">{c.description}</p>}
              {c.specializations?.length>0&&(
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {c.specializations.map(s=>(
                    <span key={s} className="text-xs font-display font-bold bg-eco-50 text-eco-600 border border-eco-100 px-2 py-0.5 rounded-full">{s}</span>
                  ))}
                </div>
              )}
              <div className="space-y-1.5 text-sm font-body text-eco-600 mt-auto mb-4">
                <div className="flex items-center gap-2"><Mail size={13} className="text-eco-400"/>{c.email}</div>
                <div className="flex items-center gap-2"><Phone size={13} className="text-eco-400"/>{c.phone}</div>
                {c.website&&<div className="flex items-center gap-2"><Globe size={13} className="text-eco-400"/>{c.website.replace(/^https?:\/\//,'')}</div>}
                <div className="flex items-center gap-2"><MapPin size={13} className="text-eco-400"/>{c.address?.city}, {c.address?.state}</div>
              </div>
              <button onClick={()=>setSelected(c)} className="btn-eco text-sm w-full">
                <Mail size={14}/> Contact
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Contact modal */}
      {selected&&(
        <div className="fixed inset-0 bg-eco-950/60 z-50 flex items-center justify-center p-4" onClick={()=>setSelected(null)}>
          <div className="bg-white rounded-2xl shadow-eco-lg w-full max-w-md p-6 fade-up" onClick={e=>e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-display font-bold text-xl text-eco-900">Contact {selected.name}</h2>
                <p className="font-body text-sm text-eco-400 mt-0.5">Send them a message about your recycling needs</p>
              </div>
              <button onClick={()=>setSelected(null)} className="p-1.5 text-eco-400 hover:text-eco-700 rounded-xl hover:bg-eco-50"><X size={18}/></button>
            </div>
            {error&&<div className="mb-4"><ErrorMsg message={error}/></div>}
            <form onSubmit={sendMsg} className="space-y-4">
              <div><label className="label-eco">Your Name *</label><input className="input-eco" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} required placeholder="John Doe"/></div>
              <div><label className="label-eco">Email *</label><input type="email" className="input-eco" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} required placeholder="you@example.com"/></div>
              <div><label className="label-eco">Message *</label><textarea className="input-eco" rows={4} value={form.message} onChange={e=>setForm(f=>({...f,message:e.target.value}))} required placeholder="Tell them about your recycling needs..."/></div>
              <div className="flex gap-3">
                <button type="button" onClick={()=>setSelected(null)} className="btn-ghost flex-1 border border-eco-200">Cancel</button>
                <button type="submit" disabled={sending} className="btn-eco flex-1">
                  {sending?<Loader size="sm"/>:<Send size={14}/>} {sending?'Sending...':'Send'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
