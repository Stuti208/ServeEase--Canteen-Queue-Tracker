import React, { useState, useEffect } from 'react'

const Menu = () => {

  const [items, setItems] = useState([])
  const [cart, setCart] = useState({})
  const [activeCategory, setActiveCategory] = useState('all')
  const [search, setSearch] = useState('')

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

  // first filter by category, then filter by search
  const filteredItems = (activeCategory === 'all' ? items : items.filter(item => item.category === activeCategory))
    .filter(item => item.name.toLowerCase().includes(search.toLowerCase()))

  const cartItems = items.filter(item => cart[item._id] > 0)

  const cartTotal = cartItems.reduce((total, item) => {
    return total + item.price * cart[item._id]
  }, 0)

  const totalQty = cartItems.reduce((total, item) => total + cart[item._id], 0)

  return (
    <div className="p-4 flex flex-col md:flex-row gap-4 h-full pb-20 md:pb-4">

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
            disabled={cartItems.length === 0}
            className="w-full mt-4 bg-[#d9e8a0] text-slate-900 font-semibold py-3 rounded-xl hover:bg-yellow-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Place Order →
          </button>
        </div>
      </div>

      {/* Sticky Bottom Bar — Mobile only, shows when cart has items */}
      {cartItems.length > 0 && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900 px-4 py-3 flex items-center justify-between border-t border-slate-700 z-50">
          <div>
            <p className="text-white font-semibold text-sm">{totalQty} items in cart</p>
            <p className="text-[#d9e8a0] font-bold">₹{cartTotal}</p>
          </div>
          <button className="bg-[#d9e8a0] text-slate-900 font-semibold px-6 py-2 rounded-xl hover:bg-yellow-200 transition-colors text-sm">
            Place Order →
          </button>
        </div>
      )}

    </div>
  )
}

export default Menu
