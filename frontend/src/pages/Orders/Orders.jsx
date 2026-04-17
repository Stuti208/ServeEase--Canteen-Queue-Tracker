import React, { useState, useEffect } from 'react'
import { useNotifications } from '../../context/NotificationContext'
import { getUser, getToken } from '../../utils/auth'

const STATUS_STEPS = ['pending', 'cooking', 'ready', 'completed']

const STATUS_BORDER = {
  pending: 'border-t-yellow-400',
  partially_ready: 'border-t-blue-400',
  ready: 'border-t-green-400',
  completed: 'border-t-slate-500',
  cancelled: 'border-t-red-500',
  reassigned: 'border-t-orange-400'
}

const STATUS_LABEL = {
  pending: 'Order Placed',
  partially_ready: 'Partially Ready',
  ready: 'Ready for Pickup!',
  completed: 'Picked Up',
  cancelled: 'Cancelled',
  reassigned: 'Items Reassigned'
}

const ITEM_STATUS_COLORS = {
  pending: { chip: 'bg-yellow-900 text-yellow-400', dot: 'bg-yellow-400' },
  cooking: { chip: 'bg-blue-900 text-blue-400', dot: 'bg-blue-400' },
  ready: { chip: 'bg-green-900 text-green-400', dot: 'bg-green-400' },
  picked_up: { chip: 'bg-slate-700 text-slate-400', dot: 'bg-slate-400' },
  reassigned: { chip: 'bg-orange-900 text-orange-400', dot: 'bg-orange-400' }
}

const getStepIndex = (status) => {
  if (status === 'partially_ready') return 1
  return STATUS_STEPS.indexOf(status)
}

const ProgressStepper = ({ status }) => {
  if (status === 'cancelled') {
    return (
      <div className="flex items-center gap-2 py-1">
        <div className="w-2 h-2 rounded-full bg-red-400" />
        <span className="text-red-400 text-xs font-medium">Order Cancelled</span>
      </div>
    )
  }

  if (status === 'reassigned') {
    return (
      <div className="flex items-center gap-2 py-1">
        <div className="w-2 h-2 rounded-full bg-orange-400" />
        <span className="text-orange-400 text-xs font-medium">Items were not picked up and reassigned to others</span>
      </div>
    )
  }

  const steps = [
    { key: 'pending', label: 'Placed' },
    { key: 'cooking', label: 'Cooking' },
    { key: 'ready', label: 'Ready' },
    { key: 'completed', label: 'Done' },
  ]

  const currentIdx = getStepIndex(status)

  return (
    <div className="flex items-center gap-1 w-full">
      {steps.map((step, idx) => {
        const done = idx <= currentIdx
        const active = idx === currentIdx
        return (
          <React.Fragment key={step.key}>
            <div className="flex flex-col items-center gap-1">
              <div className={`w-2 h-2 rounded-full transition-colors ${
                done ? (active ? 'bg-[#d9e8a0] ring-2 ring-[#d9e8a0]/30' : 'bg-[#d9e8a0]') : 'bg-slate-700'
              }`} />
              <span className={`text-[9px] whitespace-nowrap ${done ? 'text-[#d9e8a0]' : 'text-slate-600'}`}>
                {step.label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div className={`flex-1 h-px mb-3 ${idx < currentIdx ? 'bg-[#d9e8a0]' : 'bg-slate-700'}`} />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

const getRemainingTime = (order) => {
  if (['ready', 'completed', 'cancelled'].includes(order.status)) return null
  const minutesPassed = Math.floor((Date.now() - new Date(order.createdAt)) / 60000)
  const remaining = order.estimatedTime - minutesPassed
  return Math.max(5, remaining)   // freeze at 5 min minimum
}

const Orders = () => {

  const user = getUser()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [expandedOrder, setExpandedOrder] = useState(null)
  const [tick, setTick] = useState(0)
  const { joinOrderRoom } = useNotifications()

  useEffect(() => {
    if (user) fetchOrders()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 60000)
    return () => clearInterval(interval)
  }, [])

  // join socket rooms once orders are loaded
  useEffect(() => {
    orders.forEach(order => joinOrderRoom(order._id))
  }, [orders.length])

  // listen for real-time order updates from NotificationContext
  useEffect(() => {
    const handler = (e) => {
      const updatedOrder = e.detail
      setOrders(prev => prev.map(o => o._id === updatedOrder._id ? updatedOrder : o))
    }
    window.addEventListener('serveease:order:updated', handler)
    return () => window.removeEventListener('serveease:order:updated', handler)
  }, [])

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const res = await fetch(`http://localhost:3000/api/orders/user/${user.id}`, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      })
      const data = await res.json()
      setOrders(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const toggleExpand = (id) => setExpandedOrder(expandedOrder === id ? null : id)

  return (
    <div className="p-4 space-y-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Orders</h1>
          <p className="text-slate-500 text-sm">Hey, <span className="font-medium text-slate-700">{user?.name}</span></p>
        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2].map(i => (
            <div key={i} className="bg-slate-900 rounded-2xl p-5 space-y-3 animate-pulse">
              <div className="flex gap-4">
                <div className="w-14 h-14 rounded-2xl bg-slate-800" />
                <div className="flex-1 space-y-2 pt-1">
                  <div className="h-3 bg-slate-800 rounded w-1/3" />
                  <div className="h-2 bg-slate-800 rounded w-1/2" />
                </div>
              </div>
              <div className="h-2 bg-slate-800 rounded w-full" />
            </div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-slate-900 rounded-2xl p-12 flex flex-col items-center justify-center space-y-3 text-center">
          <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center text-3xl">🍽️</div>
          <p className="text-white font-medium">No orders yet</p>
          <p className="text-gray-400 text-sm">Head to the menu and place your first order.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map(order => (
            <div
              key={order._id}
              className={`bg-slate-900 rounded-2xl overflow-hidden border-t-4 ${STATUS_BORDER[order.status]} ${
                order.status === 'cancelled' ? 'opacity-60' : ''
              }`}
            >
              {/* Card Body */}
              <div className="p-5">

                {/* Top row — queue + ETA */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    {/* Queue number */}
                    <div className="text-center">
                      <p className="text-gray-500 text-[10px] uppercase tracking-widest">Queue</p>
                      <p className="text-[#d9e8a0] font-bold text-3xl leading-tight">#{order.queueNumber}</p>
                    </div>
                    <div className="w-px h-10 bg-slate-700" />
                    {/* ETA */}
                    <div>
                      <p className="text-gray-500 text-[10px] uppercase tracking-widest">Est. Wait</p>
                      {order.status === 'ready' ? (
                        <p className="text-green-400 font-bold text-2xl leading-tight">Ready!</p>
                      ) : order.status === 'completed' ? (
                        <p className="text-slate-400 font-bold text-2xl leading-tight">Done</p>
                      ) : order.status === 'cancelled' ? (
                        <p className="text-red-400 font-bold text-2xl leading-tight">—</p>
                      ) : (
                        <>
                          <p className="text-white font-bold text-2xl leading-tight">
                            {getRemainingTime(order)}
                            <span className="text-sm font-normal text-gray-400 ml-1">min</span>
                          </p>
                          {getRemainingTime(order) === 5 && (
                            <p className="text-[#d9e8a0] text-[10px] mt-0.5">Almost ready!</p>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Status label */}
                  <div className="text-right">
                    <p className={`text-sm font-semibold ${
                      order.status === 'ready' ? 'text-green-400' :
                      order.status === 'cancelled' ? 'text-red-400' :
                      order.status === 'completed' ? 'text-slate-400' :
                      order.status === 'reassigned' ? 'text-orange-400' :
                      'text-[#d9e8a0]'
                    }`}>
                      {STATUS_LABEL[order.status]}
                    </p>
                    <p className="text-gray-500 text-xs mt-0.5">₹{order.totalAmount}</p>
                  </div>
                </div>

                {/* Progress stepper */}
                <ProgressStepper status={order.status} />

                {/* Details toggle */}
                <button
                  onClick={() => toggleExpand(order._id)}
                  className="mt-4 w-full text-center text-gray-500 hover:text-gray-300 text-xs transition-colors"
                >
                  {expandedOrder === order._id ? '▲ Hide items' : '▼ Show items'}
                </button>

              </div>

              {/* Expanded — item breakdown */}
              {expandedOrder === order._id && (
                <div className="border-t border-slate-800 px-5 pb-4 pt-3 space-y-2">
                  {order.items.map((item, idx) => {
                    const s = ITEM_STATUS_COLORS[item.status] || ITEM_STATUS_COLORS.pending
                    return (
                      <div key={idx} className="flex items-center justify-between py-1">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${s.dot}`} />
                          <span className="text-white text-sm">{item.name}</span>
                          <span className="text-gray-500 text-xs">× {item.quantity}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-gray-400 text-xs">₹{item.price * item.quantity}</span>
                          <span className={`text-xs px-2.5 py-0.5 rounded-full capitalize font-medium ${s.chip}`}>
                            {item.status.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

            </div>
          ))}
        </div>
      )}

    </div>
  )
}

export default Orders
