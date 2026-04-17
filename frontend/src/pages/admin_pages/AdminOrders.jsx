import React, { useState, useEffect } from 'react'

const statusColors = {
  pending: 'bg-yellow-900 text-yellow-400',
  partially_ready: 'bg-blue-900 text-blue-400',
  ready: 'bg-green-900 text-green-400',
  completed: 'bg-slate-700 text-slate-400',
  cancelled: 'bg-red-900 text-red-400'
}

const itemStatusColors = {
  pending: 'bg-yellow-900 text-yellow-400',
  cooking: 'bg-blue-900 text-blue-400',
  ready: 'bg-green-900 text-green-400',
  picked_up: 'bg-slate-700 text-slate-400',
  reassigned: 'bg-orange-900 text-orange-400'
}

const timeAgo = (dateStr) => {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000)
  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  return `${Math.floor(diff / 3600)}h ago`
}

const FILTER_TABS = ['all', 'pending', 'partially_ready', 'ready', 'completed', 'cancelled']

const AdminOrders = () => {

  const [orders, setOrders] = useState([])
  const [menuItems, setMenuItems] = useState([])
  const [showOfflinePanel, setShowOfflinePanel] = useState(false)
  const [offlineCart, setOfflineCart] = useState({})
  const [placingOffline, setPlacingOffline] = useState(false)
  const [expandedOrder, setExpandedOrder] = useState(null)
  const [activeFilter, setActiveFilter] = useState('all')

  useEffect(() => {
    fetchOrders()
    fetchMenuItems()
  }, [])

  const fetchOrders = async () => {
    const res = await fetch('http://localhost:3000/api/orders')
    const data = await res.json()
    setOrders(data)
  }

  const fetchMenuItems = async () => {
    const res = await fetch('http://localhost:3000/api/menu')
    const data = await res.json()
    setMenuItems(data.filter(item => item.isAvailable))
  }

  const offlineIncrement = (id) => setOfflineCart({ ...offlineCart, [id]: (offlineCart[id] || 0) + 1 })
  const offlineDecrement = (id) => {
    if (!offlineCart[id]) return
    setOfflineCart({ ...offlineCart, [id]: offlineCart[id] - 1 })
  }

  const offlineCartItems = menuItems.filter(item => offlineCart[item._id] > 0)
  const offlineTotal = offlineCartItems.reduce((sum, item) => sum + item.price * offlineCart[item._id], 0)

  const handleOfflineOrder = async () => {
    if (offlineCartItems.length === 0) return
    setPlacingOffline(true)
    try {
      const res = await fetch('http://localhost:3000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'offline',
          items: offlineCartItems.map(item => ({
            menuItemId: item._id,
            name: item.name,
            price: item.price,
            quantity: offlineCart[item._id],
            prepTime: item.prepTime
          }))
        })
      })
      const newOrder = await res.json()
      setOrders([newOrder, ...orders])
      setOfflineCart({})
      setShowOfflinePanel(false)
    } catch (err) {
      console.error(err)
    } finally {
      setPlacingOffline(false)
    }
  }

  const handleCancel = async (orderId) => {
    const res = await fetch(`http://localhost:3000/api/orders/${orderId}/cancel`, { method: 'PATCH' })
    const updated = await res.json()
    setOrders(orders.map(o => o._id === orderId ? updated : o))
  }

  const toggleExpand = (orderId) => setExpandedOrder(expandedOrder === orderId ? null : orderId)

  const handleItemStatus = async (orderId, itemId, newStatus) => {
    const res = await fetch(`http://localhost:3000/api/orders/${orderId}/items/${itemId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    })
    const updated = await res.json()
    setOrders(orders.map(o => o._id === orderId ? updated : o))
  }

  const nextStatus = { pending: 'cooking', cooking: 'ready', ready: 'picked_up' }
  const nextLabel = { pending: 'Start Cooking', cooking: 'Mark Ready', ready: 'Picked Up' }

  // stats
  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    ready: orders.filter(o => ['ready', 'partially_ready'].includes(o.status)).length,
    completed: orders.filter(o => o.status === 'completed').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
  }

  const filteredOrders = activeFilter === 'all' ? orders : orders.filter(o => o.status === activeFilter)

  return (
    <div className="p-4 space-y-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Orders</h1>
        <button
          onClick={() => { setShowOfflinePanel(!showOfflinePanel); setOfflineCart({}) }}
          className="bg-slate-900 text-white px-4 py-2 rounded-full text-sm hover:bg-slate-700 transition-colors"
        >
          {showOfflinePanel ? 'Close Panel' : '+ Walk-in Order'}
        </button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total', value: stats.total, color: 'text-white' },
          { label: 'Pending', value: stats.pending, color: 'text-yellow-400' },
          { label: 'Ready', value: stats.ready, color: 'text-green-400' },
          { label: 'Completed', value: stats.completed, color: 'text-slate-400' },
        ].map(stat => (
          <div key={stat.label} className="bg-slate-900 rounded-2xl px-4 py-3">
            <p className="text-gray-400 text-xs mb-1">{stat.label}</p>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Walk-in Panel */}
      {showOfflinePanel && (
        <div className="bg-slate-900 rounded-2xl p-5 space-y-4">
          <h2 className="text-white font-semibold">New Walk-in Order</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
            {menuItems.map(item => (
              <div key={item._id} className="flex items-center gap-3 bg-slate-800 rounded-xl px-4 py-3">
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{item.name}</p>
                  <p className="text-gray-400 text-xs">₹{item.price} · {item.prepTime} min</p>
                </div>
                {offlineCart[item._id] > 0 ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => offlineDecrement(item._id)}
                      className="w-7 h-7 rounded-full bg-slate-700 text-white hover:bg-slate-600 transition-colors flex items-center justify-center text-sm"
                    >−</button>
                    <span className="text-white font-semibold w-5 text-center text-sm">{offlineCart[item._id]}</span>
                    <button
                      onClick={() => offlineIncrement(item._id)}
                      className="w-7 h-7 rounded-full bg-[#d9e8a0] text-slate-900 hover:bg-yellow-200 transition-colors flex items-center justify-center font-bold text-sm"
                    >+</button>
                  </div>
                ) : (
                  <button
                    onClick={() => offlineIncrement(item._id)}
                    className="bg-[#d9e8a0] text-slate-900 text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-yellow-200 transition-colors"
                  >+ Add</button>
                )}
              </div>
            ))}
          </div>

          {offlineCartItems.length > 0 && (
            <div className="flex items-center justify-between border-t border-slate-700 pt-4">
              <div>
                <p className="text-gray-400 text-xs">{offlineCartItems.length} item(s) selected</p>
                <p className="text-white font-bold text-lg">₹{offlineTotal}</p>
              </div>
              <button
                onClick={handleOfflineOrder}
                disabled={placingOffline}
                className="bg-[#d9e8a0] text-slate-900 font-semibold px-6 py-2.5 rounded-xl hover:bg-yellow-200 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {placingOffline ? 'Placing...' : 'Place Walk-in Order'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {FILTER_TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${
              activeFilter === tab
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-700 hover:bg-slate-200'
            }`}
          >
            {tab === 'all' ? 'All' : tab.replace('_', ' ')}
            {tab !== 'all' && (
              <span className="ml-1.5 text-xs opacity-60">
                {orders.filter(o => o.status === tab).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-3">
        {filteredOrders.length === 0 ? (
          <div className="bg-slate-900 rounded-2xl p-8 text-center text-gray-400 text-sm">
            No orders in this category.
          </div>
        ) : (
          filteredOrders.map(order => (
            <div
              key={order._id}
              className={`bg-slate-900 rounded-2xl overflow-hidden transition-opacity ${
                order.status === 'cancelled' ? 'opacity-50' : 'opacity-100'
              }`}
            >
              {/* Main Order Row */}
              <div className="flex items-center gap-4 px-5 py-4">

                {/* Queue Badge */}
                <div className="w-12 h-12 rounded-2xl bg-slate-800 flex flex-col items-center justify-center flex-shrink-0">
                  <span className="text-gray-400 text-[9px] uppercase tracking-wider">Queue</span>
                  <span className="text-[#d9e8a0] font-bold text-base leading-none">#{order.queueNumber}</span>
                </div>

                {/* Order Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-white font-semibold text-sm truncate">{order.customerName}</p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${
                      order.source === 'offline' ? 'bg-purple-900 text-purple-400' : 'bg-sky-900 text-sky-400'
                    }`}>
                      {order.source === 'offline' ? 'Walk-in' : 'Online'}
                    </span>
                  </div>
                  <p className="text-gray-400 text-xs">
                    {order.items.length} item(s) · ₹{order.totalAmount} · ~{order.estimatedTime} min wait · {timeAgo(order.createdAt)}
                  </p>
                </div>

                {/* Status */}
                <span className={`text-xs px-3 py-1 rounded-full font-medium capitalize flex-shrink-0 ${statusColors[order.status]}`}>
                  {order.status.replace('_', ' ')}
                </span>

                {/* Actions */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  <button
                    onClick={() => toggleExpand(order._id)}
                    className="text-gray-400 hover:text-white text-xs transition-colors"
                  >
                    {expandedOrder === order._id ? 'Hide ▲' : 'Details ▼'}
                  </button>
                  {order.status !== 'cancelled' && order.status !== 'completed' && (
                    <>
                      <span className="text-slate-700">|</span>
                      <button
                        onClick={() => handleCancel(order._id)}
                        className="text-red-400 hover:text-red-300 text-xs transition-colors"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </div>

              </div>

              {/* Expanded — Item Details */}
              {expandedOrder === order._id && (
                <div className="border-t border-slate-800 px-5 py-4 space-y-2">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-white text-sm font-medium truncate">{item.name}</span>
                        <span className="text-gray-500 text-xs flex-shrink-0">× {item.quantity}</span>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-gray-400 text-xs">₹{item.price * item.quantity}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${itemStatusColors[item.status]}`}>
                          {item.status.replace('_', ' ')}
                        </span>
                        {nextStatus[item.status] && order.status !== 'cancelled' && (
                          <button
                            onClick={() => handleItemStatus(order._id, item._id, nextStatus[item.status])}
                            className="text-xs px-3 py-1 rounded-full bg-[#d9e8a0] text-slate-900 font-semibold hover:bg-yellow-200 transition-colors"
                          >
                            {nextLabel[item.status]}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          ))
        )}
      </div>

    </div>
  )
}

export default AdminOrders
