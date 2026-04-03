import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { booksAPI } from '../api'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { Loader, formatPrice } from '../components/common'
import { ShoppingCart, ArrowLeft, Star, Package, Leaf, Check } from 'lucide-react'

export default function BookDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const { addToCart } = useCart()
  const navigate = useNavigate()
  const [book, setBook]     = useState(null)
  const [loading, setLoading] = useState(true)
  const [qty, setQty]       = useState(1)
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    booksAPI.getOne(id).then(({ data }) => setBook(data.book)).finally(() => setLoading(false))
  }, [id])

  const handleAdd = async () => {
    if (!user) { navigate('/login'); return }
    setAdding(true)
    await addToCart(book._id, qty)
    setAdding(false)
  }

  if (loading) return <div className="flex items-center justify-center min-h-96"><Loader size="lg" /></div>
  if (!book)   return <div className="p-8 text-center"><p className="font-display text-eco-600">Book not found.</p><Link to="/books" className="btn-eco mt-4 inline-flex text-sm">Back to Books</Link></div>

  const discount = book.originalPrice ? Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100) : 0

  return (
    <div className="p-6 lg:p-8 fade-up">
      <Link to="/" className="inline-flex items-center gap-2 text-sm font-body text-eco-500 hover:text-eco-700 mb-6 transition-colors">
        <ArrowLeft size={16} /> Back to Browse
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        {/* Cover */}
        <div className="lg:col-span-2">
          <div className="relative aspect-[3/4] bg-eco-50 rounded-2xl overflow-hidden shadow-eco-lg">
            <img src={book.image} alt={book.title}
              className="w-full h-full object-cover"
              onError={e => e.target.src = 'https://via.placeholder.com/400x533/dcfce7/16a34a?text=📚'} />
            {discount > 0 && (
              <div className="absolute top-4 left-4 bg-eco-600 text-white font-display font-bold text-sm px-3 py-1 rounded-xl">
                {discount}% OFF
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="lg:col-span-3 flex flex-col">
          <span className="inline-block text-xs font-display font-bold text-eco-500 bg-eco-50 border border-eco-200 px-3 py-1 rounded-full mb-3 self-start">
            {book.category}
          </span>
          <h1 className="font-display font-black text-3xl text-eco-900 leading-tight mb-2">{book.title}</h1>
          <p className="font-body text-eco-500 mb-4">by <span className="text-eco-700 font-semibold">{book.author}</span></p>

          {book.numReviews > 0 && (
            <div className="flex items-center gap-2 mb-5">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(s => (
                  <Star key={s} size={14} className={s <= Math.round(book.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'} />
                ))}
              </div>
              <span className="text-sm font-body text-eco-600">{book.rating.toFixed(1)}</span>
              <span className="text-sm font-body text-eco-400">({book.numReviews} reviews)</span>
            </div>
          )}

          <div className="flex items-baseline gap-3 mb-5">
            <span className="font-display font-black text-3xl text-eco-700">{formatPrice(book.price)}</span>
            {book.originalPrice && (
              <span className="text-lg font-body text-eco-300 line-through">{formatPrice(book.originalPrice)}</span>
            )}
          </div>

          {/* Stock */}
          <div className="flex items-center gap-2 mb-5">
            <Package size={15} className={book.stock > 0 ? 'text-eco-500' : 'text-red-400'} />
            <span className={`text-sm font-body ${book.stock > 0 ? 'text-eco-600' : 'text-red-500'}`}>
              {book.stock > 10 ? 'In Stock' : book.stock > 0 ? `Only ${book.stock} left!` : 'Out of Stock'}
            </span>
          </div>

          {book.stock > 0 && (
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center border-2 border-eco-200 rounded-xl overflow-hidden">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-2 text-eco-600 hover:bg-eco-50 font-bold text-lg">−</button>
                <span className="px-4 py-2 font-display font-bold text-eco-800">{qty}</span>
                <button onClick={() => setQty(Math.min(book.stock, qty + 1))} className="px-3 py-2 text-eco-600 hover:bg-eco-50 font-bold text-lg">+</button>
              </div>
              <button onClick={handleAdd} disabled={adding} className="btn-eco flex-1 py-3">
                {adding ? <Loader size="sm" /> : <ShoppingCart size={16} />}
                Add to Cart
              </button>
            </div>
          )}

          {/* COD */}
          <div className="flex items-center gap-2 bg-eco-50 border border-eco-200 rounded-xl px-4 py-3 text-sm font-body text-eco-700 mb-6">
            <Check size={15} className="text-eco-500" />
            Cash on Delivery · Free shipping on orders over ₹500
          </div>

          {/* Eco impact teaser */}
          <div className="flex items-start gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-sm font-body text-emerald-700 mb-6">
            <Leaf size={15} className="text-emerald-500 mt-0.5 flex-shrink-0" />
            Recycling this book saves ~0.5 kg of paper and 3.5 L of water. <Link to="/recycling" className="font-semibold underline ml-1">Recycle it later →</Link>
          </div>

          {/* Description */}
          <h3 className="font-display font-bold text-eco-800 mb-2">About this book</h3>
          <p className="font-body text-eco-500 text-sm leading-relaxed">{book.description}</p>

          {/* Meta */}
          <dl className="grid grid-cols-2 gap-3 mt-5 pt-5 border-t border-eco-100 text-sm font-body">
            {[['Publisher', book.publisher], ['Year', book.publishedYear], ['Language', book.language], ['Pages', book.pages], ['ISBN', book.isbn]]
              .filter(([, v]) => v).map(([l, v]) => (
                <div key={l} className="bg-eco-50 rounded-xl p-3">
                  <dt className="text-eco-400 text-xs">{l}</dt>
                  <dd className="text-eco-700 font-semibold mt-0.5">{v}</dd>
                </div>
              ))}
          </dl>
        </div>
      </div>
    </div>
  )
}
