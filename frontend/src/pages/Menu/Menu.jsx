import React, { useState, useEffect } from 'react'
import { useNotifications } from '../../context/NotificationContext'

const Menu = () => {

  const [items, setItems] = useState([])
  const [cart, setCart] = useState({})
  const [activeCategory, setActiveCategory] = useState('all')
  const [search, setSearch] = useState('')

  const { joinOrderRoom } = useNotifications()
  const [showModal, setShowModal] = useState(false)
  const [customerName, setCustomerName] = useState('')
  const [placingOrder, setPlacingOrder] = useState(false)
  const [orderError, setOrderError] = useState('')
  const [orderConfirmation, setOrderConfirmation] = useState(null)  // { queueNumber, estimatedTime }

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    const res = await fetch('http://localhost:3000/api/menu')
    const data = await res.json()
    setItems(data.filter(item => item.isAvailable))
  }

  const increment = (id) => setCart({ ...cart, [id]: (cart[id] || 0) + 1 })

  const decrement = (id) => {
    if (!cart[id] || cart[id] === 0) return
    setCart({ ...cart, [id]: cart[id] - 1 })
  }

  const categories = ['all', 'food', 'drinks', 'snacks']

  const filteredItems = (activeCategory === 'all' ? items : items.filter(item => item.category === activeCategory))
    .filter(item => item.name.toLowerCase().includes(search.toLowerCase()))

  const cartItems = items.filter(item => cart[item._id] > 0)

  const cartTotal = cartItems.reduce((total, item) => total + item.price * cart[item._id], 0)

  const totalQty = cartItems.reduce((total, item) => total + cart[item._id], 0)

  const handlePlaceOrder = async () => {
    if (!customerName.trim()) return

    setPlacingOrder(true)
    setOrderError('')

    try {
      const res = await fetch('http://localhost:3000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: customerName.trim(),
          source: 'online',
          items: cartItems.map(item => ({
            menuItemId: item._id,
            name: item.name,
            price: item.price,
            quantity: cart[item._id],
            prepTime: item.prepTime
          }))
        })
      })

      const data = await res.json()

      if (!res.ok) {
        setOrderError(data.message || 'Failed to place order. Try again.')
        return
      }

      // success — clear cart, show confirmation
      localStorage.setItem('customerName', customerName.trim())
      const existingIds = JSON.parse(localStorage.getItem('orderIds') || '[]')
      localStorage.setItem('orderIds', JSON.stringify([...existingIds, data._id]))
      joinOrderRoom(data._id)
      setCart({})
      setShowModal(false)
      setCustomerName('')
      setOrderConfirmation({ queueNumber: data.queueNumber, estimatedTime: data.estimatedTime })

    } catch (err) {
      setOrderError('Something went wrong. Check your connection.')
    } finally {
      setPlacingOrder(false)
    }
  }

  const openModal = () => {
    setOrderError('')
    setShowModal(true)
  }

  return (
    <div className="p-4 flex flex-col md:flex-row gap-4 h-full pb-20 md:pb-4">

      {/* Order Confirmation Banner */}
      {orderConfirmation && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-2xl p-8 max-w-sm w-full text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#d9e8a0] flex items-center justify-center text-3xl mx-auto">
              ✓
            </div>
            <h2 className="text-white text-xl font-bold">Order Placed!</h2>
            <div className="bg-slate-800 rounded-xl p-4 space-y-3">
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Queue Number</p>
                <p className="text-[#d9e8a0] text-4xl font-bold">#{orderConfirmation.queueNumber}</p>
              </div>
              <div className="border-t border-slate-700 pt-3">
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Estimated Wait</p>
                <p className="text-white text-2xl font-semibold">{orderConfirmation.estimatedTime} min</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm">We'll notify you when your order is ready.</p>
            <button
              onClick={() => setOrderConfirmation(null)}
              className="w-full bg-[#d9e8a0] text-slate-900 font-semibold py-3 rounded-xl hover:bg-yellow-200 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Customer Name Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-2xl p-6 max-w-sm w-full space-y-4">
            <h2 className="text-white font-semibold text-lg">Confirm Your Order</h2>

            {/* Cart summary inside modal */}
            <div className="bg-slate-800 rounded-xl p-3 space-y-2 max-h-40 overflow-y-auto">
              {cartItems.map(item => (
                <div key={item._id} className="flex justify-between text-sm">
                  <span className="text-gray-300">{item.name} × {cart[item._id]}</span>
                  <span className="text-[#d9e8a0]">₹{item.price * cart[item._id]}</span>
                </div>
              ))}
              <div className="border-t border-slate-700 pt-2 flex justify-between text-white font-semibold text-sm">
                <span>Total</span>
                <span>₹{cartTotal}</span>
              </div>
            </div>

            <input
              type="text"
              placeholder="Enter your name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handlePlaceOrder()}
              autoFocus
              className="w-full bg-slate-800 text-white placeholder-gray-400 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d9e8a0]"
            />

            {orderError && (
              <p className="text-red-400 text-sm">{orderError}</p>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => { setShowModal(false); setOrderError('') }}
                disabled={placingOrder}
                className="flex-1 bg-slate-700 text-white py-3 rounded-xl hover:bg-slate-600 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handlePlaceOrder}
                disabled={!customerName.trim() || placingOrder}
                className="flex-1 bg-[#d9e8a0] text-slate-900 font-semibold py-3 rounded-xl hover:bg-yellow-200 transition-colors text-sm disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {placingOrder ? 'Placing...' : 'Place Order'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Left — Menu Items */}
      <div className="flex-1 overflow-y-auto">

        {/* Category Tabs + Search */}
        <div className="flex flex-wrap items-center gap-2 mb-5">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${
                activeCategory === cat
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat === 'all' ? 'All Items' : cat}
            </button>
          ))}

          <input
            type="text"
            placeholder="Search item..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="ml-auto bg-slate-900 text-white placeholder-gray-400 px-4 py-1.5 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-slate-600"
          />
        </div>

        {/* Items Grid */}
        {filteredItems.length === 0 ? (
          <div className="flex items-center justify-center h-48">
            <p className="text-slate-500">
              {search ? `No items found for "${search}"` : 'No items available in this category.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map(item => (
              <div key={item._id} className="bg-slate-900 rounded-2xl overflow-hidden">

                {/* Image */}
                <div className="aspect-video bg-slate-800 relative overflow-hidden">
                  {item.image
                    ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">No image</div>
                  }
                  <span className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full capitalize">
                    {item.category}
                  </span>
                </div>

                {/* Card Body */}
                <div className="p-3">
                  <h3 className="text-white font-semibold text-sm mb-1">{item.name}</h3>
                  <p className="text-[#d9e8a0] font-bold text-lg mb-3">₹{item.price}</p>

                  {cart[item._id] > 0 ? (
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => decrement(item._id)}
                        className="w-8 h-8 rounded-full bg-slate-700 text-white hover:bg-slate-600 transition-colors flex items-center justify-center"
                      >
                        −
                      </button>
                      <span className="text-white font-semibold flex-1 text-center">{cart[item._id]}</span>
                      <button
                        onClick={() => increment(item._id)}
                        className="w-8 h-8 rounded-full bg-[#d9e8a0] text-slate-900 hover:bg-yellow-200 transition-colors flex items-center justify-center font-bold"
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => increment(item._id)}
                      className="w-full bg-[#d9e8a0] text-slate-900 text-sm font-semibold py-1.5 rounded-xl hover:bg-yellow-200 transition-colors"
                    >
                      + Add
                    </button>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right — Cart (Desktop only) */}
      <div className="hidden md:flex w-72 bg-slate-900 rounded-2xl p-5 flex-col justify-between">
        <div>
          <h2 className="text-white font-semibold text-lg mb-4">Your Cart</h2>

          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 space-y-3">
              <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center text-3xl">
                🛒
              </div>
              <p className="text-gray-400 text-sm text-center">
                Your cart is empty.<br />Add items to get started.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map(item => (
                <div key={item._id} className="flex items-center gap-3">
                  {item.image
                    ? <img src={item.image} alt={item.name} className="w-11 h-11 rounded-xl object-cover" />
                    : <div className="w-11 h-11 rounded-xl bg-slate-700 flex-shrink-0" />
                  }
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{item.name}</p>
                    <p className="text-gray-400 text-xs">₹{item.price} × {cart[item._id]}</p>
                  </div>
                  <span className="text-[#d9e8a0] text-sm font-semibold">
                    ₹{item.price * cart[item._id]}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Price Breakdown + Button */}
        <div>
          <div className="border-t border-slate-700 pt-4 mt-4 space-y-2">
            <div className="flex justify-between text-gray-400 text-sm">
              <span>Items</span>
              <span>{cartItems.length}</span>
            </div>
            <div className="flex justify-between text-gray-400 text-sm">
              <span>Subtotal</span>
              <span>₹{cartTotal}</span>
            </div>
            <div className="flex justify-between text-white font-bold text-base pt-1">
              <span>Total</span>
              <span>₹{cartTotal}</span>
            </div>
          </div>

          <button
            onClick={openModal}
            disabled={cartItems.length === 0}
            className="w-full mt-4 bg-[#d9e8a0] text-slate-900 font-semibold py-3 rounded-xl hover:bg-yellow-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Place Order →
          </button>
        </div>
      </div>

      {/* Sticky Bottom Bar — Mobile only */}
      {cartItems.length > 0 && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900 px-4 py-3 flex items-center justify-between border-t border-slate-700 z-40">
          <div>
            <p className="text-white font-semibold text-sm">{totalQty} items in cart</p>
            <p className="text-[#d9e8a0] font-bold">₹{cartTotal}</p>
          </div>
          <button
            onClick={openModal}
            className="bg-[#d9e8a0] text-slate-900 font-semibold px-6 py-2 rounded-xl hover:bg-yellow-200 transition-colors text-sm"
          >
            Place Order →
          </button>
        </div>
      )}

    </div>
  )
}

export default Menu
