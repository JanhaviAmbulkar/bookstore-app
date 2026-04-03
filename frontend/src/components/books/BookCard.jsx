import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, Star, Leaf } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { formatPrice } from '../common'

export default function BookCard({ book }) {
  const { user } = useAuth()
  const { addToCart } = useCart()
  const navigate = useNavigate()

  const handleAdd = (e) => {
    e.preventDefault()
    if (!user) { navigate('/login'); return }
    addToCart(book._id)
  }

  const discount = book.originalPrice
    ? Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100) : 0

  return (
    <Link to={`/books/${book._id}`} className="group block">
      <div className="card-hover overflow-hidden h-full flex flex-col">
        {/* Cover */}
        <div className="relative aspect-[3/4] bg-eco-50 overflow-hidden">
          <img src={book.image} alt={book.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={e => { e.target.src = 'https://via.placeholder.com/300x400/dcfce7/16a34a?text=📚' }} />

          {/* Eco badge */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {discount > 0 && (
              <span className="bg-eco-600 text-white text-xs font-display font-bold px-2 py-0.5 rounded-lg">
                -{discount}%
              </span>
            )}
            {book.isFeatured && (
              <span className="bg-amber-400 text-white text-xs font-display font-bold px-2 py-0.5 rounded-lg flex items-center gap-1">
                <Leaf size={10} /> Eco Pick
              </span>
            )}
          </div>

          {book.stock === 0 && (
            <div className="absolute inset-0 bg-eco-900/60 flex items-center justify-center">
              <span className="bg-white text-eco-800 font-display font-bold text-xs px-3 py-1 rounded-full">Out of Stock</span>
            </div>
          )}

          {/* Add to cart overlay */}
          {book.stock > 0 && (
            <button onClick={handleAdd}
              className="absolute bottom-0 inset-x-0 bg-eco-600/95 text-white py-2.5 text-xs font-display font-bold
                         translate-y-full group-hover:translate-y-0 transition-transform duration-200
                         flex items-center justify-center gap-1.5 hover:bg-eco-700">
              <ShoppingCart size={14} /> Add to Cart
            </button>
          )}
        </div>

        {/* Info */}
        <div className="p-3.5 flex flex-col flex-1">
          <span className="text-xs font-display font-bold text-eco-500 uppercase tracking-wide mb-1">{book.category}</span>
          <h3 className="font-display font-bold text-sm text-eco-900 leading-snug mb-0.5 line-clamp-2 group-hover:text-eco-700 transition-colors">
            {book.title}
          </h3>
          <p className="text-xs font-body text-eco-400 mb-2">by {book.author}</p>

          {book.numReviews > 0 && (
            <div className="flex items-center gap-1 mb-2">
              <Star size={11} className="text-amber-400 fill-amber-400" />
              <span className="text-xs font-body text-eco-500">{book.rating.toFixed(1)}</span>
              <span className="text-xs font-body text-eco-300">({book.numReviews})</span>
            </div>
          )}

          <div className="mt-auto flex items-baseline gap-1.5">
            <span className="font-display font-bold text-base text-eco-700">{formatPrice(book.price)}</span>
            {book.originalPrice && (
              <span className="text-xs font-body text-eco-300 line-through">{formatPrice(book.originalPrice)}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
