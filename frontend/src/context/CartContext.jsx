import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { cartAPI } from '../api'
import { useAuth } from './AuthContext'
import toast from 'react-hot-toast'

const CartContext = createContext(null)

export const CartProvider = ({ children }) => {
  const { user } = useAuth()
  const [cart, setCart]       = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchCart = useCallback(async () => {
    if (!user) { setCart(null); return }
    try {
      setLoading(true)
      const { data } = await cartAPI.get()
      setCart(data.cart)
    } catch {
      // silently fail
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => { fetchCart() }, [fetchCart])

  const addToCart = useCallback(async (bookId, quantity = 1) => {
    try {
      const { data } = await cartAPI.add(bookId, quantity)
      setCart(data.cart)
      toast.success('Added to cart!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to cart')
    }
  }, [])

  const updateItem = useCallback(async (bookId, quantity) => {
    try {
      const { data } = await cartAPI.update(bookId, quantity)
      setCart(data.cart)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update cart')
    }
  }, [])

  const removeItem = useCallback(async (bookId) => {
    try {
      const { data } = await cartAPI.remove(bookId)
      setCart(data.cart)
      toast.success('Removed from cart')
    } catch {
      toast.error('Failed to remove item')
    }
  }, [])

  const clearCart = useCallback(async () => {
    try {
      await cartAPI.clear()
      setCart((prev) => prev ? { ...prev, items: [], totalAmount: 0 } : prev)
    } catch {}
  }, [])

  const itemCount = cart?.items?.reduce((sum, i) => sum + i.quantity, 0) ?? 0

  return (
    <CartContext.Provider value={{ cart, loading, fetchCart, addToCart, updateItem, removeItem, clearCart, itemCount }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
