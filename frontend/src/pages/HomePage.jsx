import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { booksAPI } from '../api'
import BookCard from '../components/books/BookCard'
import { Loader, StatCard, EmptyState } from '../components/common'
import { BookOpen, Recycle, Leaf, Droplets, Wind, ArrowRight, Search, ChevronLeft, ChevronRight, TreePine, Globe } from 'lucide-react'

const CATEGORIES = ['All','Fiction','Non-Fiction','Science','Technology','History','Biography','Self-Help','Fantasy','Business','Academic']

export default function HomePage() {
  const [books, setBooks]           = useState([])
  const [pagination, setPagination] = useState(null)
  const [loading, setLoading]       = useState(true)
  const [search, setSearch]         = useState('')
  const [category, setCategory]     = useState('All')
  const [page, setPage]             = useState(1)
  const [globalStats, setGlobalStats] = useState({ books: 0, reused: 0, paper: 0, co2: 0 })

  const fetchBooks = useCallback(async () => {
    setLoading(true)
    try {
      const params = { page, limit: 8 }
      if (search)              params.search   = search
      if (category !== 'All') params.category = category
      const { data } = await booksAPI.getAll(params)
      setBooks(data.books)
      setPagination(data.pagination)
      setGlobalStats(s => ({ ...s, books: data.pagination.totalBooks }))
    } catch { setBooks([]) }
    finally { setLoading(false) }
  }, [search, category, page])

  useEffect(() => { fetchBooks() }, [fetchBooks])
  useEffect(() => { setPage(1) }, [search, category])

  return (
    <div className="min-h-screen">
      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative bg-eco-gradient overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-[-60px] right-[-60px] w-64 h-64 bg-white/5 rounded-full blob" />
        <div className="absolute bottom-[-40px] left-[10%] w-48 h-48 bg-white/5 rounded-full blob" style={{ animationDelay: '3s' }} />

        <div className="relative px-8 py-10 lg:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Left: text */}
            <div className="fade-up">
              <div className="inline-flex items-center gap-2 bg-white/15 text-white/90 text-xs font-display font-bold px-3 py-1.5 rounded-full mb-5 border border-white/20">
                <Leaf size={12} className="text-eco-300" />
                Sustainable Reading Platform
              </div>
              <h1 className="font-display font-black text-white text-4xl lg:text-5xl leading-tight mb-3">
                Read Green,<br />
                <span className="text-eco-300">Live Clean</span>
              </h1>
              <p className="font-body text-white/75 text-base leading-relaxed mb-7 max-w-sm">
                Discover sustainable books, recycle old ones, and track your environmental impact. Join our community of eco-conscious readers making a difference.
              </p>
              <div className="flex gap-3 flex-wrap">
                <button onClick={() => document.getElementById('browse').scrollIntoView({ behavior: 'smooth' })}
                  className="btn-white shadow-eco-lg text-sm">
                  <BookOpen size={16} /> Browse Books
                </button>
                <Link to="/recycling" className="btn-eco-outline text-sm">
                  <Recycle size={16} /> Recycle Books
                </Link>
              </div>
            </div>

            {/* Right: stat cards grid (glassmorphism) */}
            <div className="grid grid-cols-2 gap-4 fade-up" style={{ animationDelay: '0.15s' }}>
              {[
                { icon: BookOpen,  value: globalStats.books || 12,   label: 'Books Available' },
                { icon: Recycle,   value: 8,                          label: 'Books Reused' },
                { icon: TreePine,  value: '10.6kg',                   label: 'Paper Saved' },
                { icon: Globe,     value: '12.7kg',                   label: 'CO₂ Reduced' },
              ].map(s => (
                <StatCard key={s.label} {...s} glass />
              ))}
            </div>
          </div>
        </div>

        {/* Wave bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 40" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path d="M0 40L1440 40L1440 10C1200 40 960 0 720 20C480 40 240 10 0 30L0 40Z" fill="#f8faf8"/>
          </svg>
        </div>
      </section>

      {/* ── THREE WAYS ───────────────────────────────────── */}
      <section className="px-8 py-12 text-center">
        <h2 className="font-display font-bold text-2xl text-eco-900 mb-1">Three Ways to Go Green</h2>
        <p className="font-body text-eco-500 text-sm mb-8 max-w-md mx-auto">Every action you take with EcoReads helps reduce environmental impact and promotes sustainable reading habits.</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-3xl mx-auto stagger">
          {[
            { icon: BookOpen, title: 'Shop Sustainably',  desc: 'Buy second-hand and eco-printed books at great prices.', color: 'bg-eco-500', to: '/books' },
            { icon: Recycle,  title: 'Recycle Old Books', desc: 'Submit books for recycling and earn reward coupons.',      color: 'bg-emerald-600', to: '/recycling' },
            { icon: Leaf,     title: 'Track Your Impact', desc: 'See exactly how much paper, water, and CO₂ you\'ve saved.', color: 'bg-teal-600', to: '/impact' },
          ].map(({ icon: Icon, title, desc, color, to }) => (
            <Link key={title} to={to} className="card-hover p-6 text-left group">
              <div className={`w-11 h-11 ${color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <Icon size={20} className="text-white" />
              </div>
              <h3 className="font-display font-bold text-eco-800 mb-1.5">{title}</h3>
              <p className="font-body text-eco-500 text-sm leading-relaxed">{desc}</p>
              <div className="flex items-center gap-1 text-eco-600 text-sm font-display font-semibold mt-4 group-hover:gap-2 transition-all">
                Learn more <ArrowRight size={14} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── BROWSE BOOKS ─────────────────────────────────── */}
      <section id="browse" className="px-8 pb-12">
        <div className="flex items-center justify-between mb-5 flex-wrap gap-4">
          <h2 className="section-title">Browse Books</h2>
          <div className="flex items-center gap-3 flex-wrap">
            {/* Search */}
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-eco-400" />
              <input
                value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search books..."
                className="input-eco pl-9 w-52 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Category pills */}
        <div className="flex gap-2 flex-wrap mb-6">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)}
              className={`text-xs font-display font-bold px-4 py-1.5 rounded-full border transition-all duration-150 ${
                category === cat
                  ? 'bg-eco-gradient text-white border-transparent shadow-eco'
                  : 'bg-white text-eco-600 border-eco-200 hover:border-eco-400'
              }`}>
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="rounded-2xl bg-eco-100/50 animate-pulse aspect-[3/5]" />
            ))}
          </div>
        ) : books.length === 0 ? (
          <EmptyState icon={BookOpen} title="No books found" description="Try a different search or category."
            action={<button onClick={() => { setSearch(''); setCategory('All') }} className="btn-eco text-sm">Clear filters</button>} />
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 stagger">
              {books.map(book => <BookCard key={book._id} book={book} />)}
            </div>
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-8">
                <button onClick={() => setPage(p => p - 1)} disabled={!pagination.hasPrev}
                  className="p-2 rounded-xl border border-eco-200 hover:bg-eco-50 disabled:opacity-40 transition-colors">
                  <ChevronLeft size={18} className="text-eco-600" />
                </button>
                <span className="font-display font-semibold text-sm text-eco-600">
                  {pagination.currentPage} / {pagination.totalPages}
                </span>
                <button onClick={() => setPage(p => p + 1)} disabled={!pagination.hasNext}
                  className="p-2 rounded-xl border border-eco-200 hover:bg-eco-50 disabled:opacity-40 transition-colors">
                  <ChevronRight size={18} className="text-eco-600" />
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* ── ECO IMPACT STRIP ─────────────────────────────── */}
      <section className="mx-8 mb-10 rounded-2xl bg-eco-gradient p-6 lg:p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full translate-x-10 -translate-y-10 blob" />
        <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          <div className="lg:col-span-2">
            <h2 className="font-display font-bold text-2xl mb-2">Start your eco journey today</h2>
            <p className="font-body text-white/70 text-sm leading-relaxed">
              Every book you recycle saves paper, conserves water, and reduces CO₂. Track your cumulative impact right from your dashboard.
            </p>
          </div>
          <div className="flex gap-3">
            <Link to="/recycling" className="btn-white flex-1 text-sm">
              <Recycle size={15} /> Recycle Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
