import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUser, getToken } from '../utils/auth'

const getGreeting = () => {
  const h = new Date().getHours()
  if (h < 12) return { text: 'Good morning', emoji: '☀️', bg: 'from-amber-900/60 to-slate-900' }
  if (h < 17) return { text: 'Good afternoon', emoji: '🌤️', bg: 'from-sky-900/60 to-slate-900' }
  return { text: 'Good evening', emoji: '🌙', bg: 'from-indigo-900/60 to-slate-900' }
}

const STATUS_META = {
  pending:         { color: '#facc15', label: 'Order Placed',      step: 0 },
  partially_ready: { color: '#60a5fa', label: 'Partially Ready',   step: 1 },
  ready:           { color: '#4ade80', label: 'Ready for Pickup!', step: 2 },
  completed:       { color: '#94a3b8', label: 'Picked Up',         step: 3 },
  cancelled:       { color: '#f87171', label: 'Cancelled',         step: -1 },
}

const SLIDES = [
  { img: 'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=900&auto=format&fit=crop', title: 'Fresh & Hot', sub: 'Made to order, every time', accent: '#d9e8a0' },
  { img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=900&auto=format&fit=crop', title: 'Skip the Line', sub: 'Order online, pick up when ready', accent: '#93c5fd' },
  { img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=900&auto=format&fit=crop', title: 'Eat Healthy', sub: 'Nutritious canteen meals daily', accent: '#86efac' },
  { img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&auto=format&fit=crop', title: 'Delicious Variety', sub: 'Something for everyone', accent: '#fca5a5' },
]

const INTERVAL = 4500

const HeroSlider = ({ onOrder }) => {
  const [current, setCurrent] = useState(0)
  const [progress, setProgress] = useState(0)
  const timerRef = useRef(null)
  const progRef = useRef(null)

  const go = (idx) => {
    setCurrent((idx + SLIDES.length) % SLIDES.length)
    setProgress(0)
  }

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCurrent(c => (c + 1) % SLIDES.length)
      setProgress(0)
    }, INTERVAL)
    progRef.current = setInterval(() => {
      setProgress(p => Math.min(p + (100 / (INTERVAL / 50)), 100))
    }, 50)
    return () => { clearInterval(timerRef.current); clearInterval(progRef.current) }
  }, [])

  const slide = SLIDES[current]

  return (
    <div className="relative rounded-3xl overflow-hidden h-52 select-none shadow-2xl">
      {SLIDES.map((s, i) => (
        <div key={i} className="absolute inset-0 transition-opacity duration-700" style={{ opacity: i === current ? 1 : 0 }}>
          <img src={s.img} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/10" />
        </div>
      ))}

      {/* Content */}
      <div className="relative h-full flex flex-col justify-between p-6">
        <div className="space-y-1">
          <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: slide.accent }}>ServeEase Canteen</span>
          <h2 className="text-3xl font-black leading-tight text-white drop-shadow">{slide.title}</h2>
          <p className="text-white/70 text-sm">{slide.sub}</p>
        </div>

        <div className="space-y-3">
          {/* Progress bar */}
          <div className="h-0.5 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-none" style={{ width: `${progress}%`, background: slide.accent }} />
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={onOrder}
              className="text-sm font-bold px-5 py-2 rounded-full shadow-lg active:scale-95 transition-all"
              style={{ background: slide.accent, color: '#0f172a' }}
            >
              Order Now →
            </button>
            <div className="flex gap-1.5">
              {SLIDES.map((_, i) => (
                <button key={i} onClick={() => go(i)}
                  className="rounded-full transition-all duration-300"
                  style={{ width: i === current ? 20 : 8, height: 8, background: i === current ? slide.accent : 'rgba(255,255,255,0.3)' }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <button onClick={() => go(current - 1)} className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors flex items-center justify-center text-lg font-light">‹</button>
      <button onClick={() => go(current + 1)} className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors flex items-center justify-center text-lg font-light">›</button>
    </div>
  )
}

const OrderSteps = ['Placed', 'Cooking', 'Ready', 'Done']

const ActiveOrderCard = ({ order, onNavigate }) => {
  const sc = STATUS_META[order.status] || STATUS_META.pending
  const isReady = order.status === 'ready'
  const stepIdx = sc.step

  return (
    <div
      onClick={onNavigate}
      className="bg-slate-900 rounded-2xl overflow-hidden cursor-pointer hover:bg-slate-800 transition-colors"
      style={{ border: `1px solid ${sc.color}25` }}
    >
      {isReady && (
        <div className="bg-green-400 px-4 py-1.5 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-green-900 animate-pulse" />
          <span className="text-green-900 text-xs font-bold">🎉 Your order is ready for pickup!</span>
        </div>
      )}
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: `${sc.color}15`, border: `1px solid ${sc.color}30` }}>
              <span className="font-black text-lg" style={{ color: sc.color }}>#{order.queueNumber}</span>
            </div>
            <div>
              <p className="text-white text-sm font-semibold leading-snug">
                {order.items.map(i => i.name).join(', ').slice(0, 30)}{order.items.map(i => i.name).join(', ').length > 30 ? '…' : ''}
              </p>
              <p className="text-slate-500 text-xs mt-0.5">{order.items.length} item{order.items.length !== 1 ? 's' : ''} · ₹{order.totalAmount}</p>
            </div>
          </div>
          <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full flex-shrink-0" style={{ color: sc.color, background: `${sc.color}15` }}>{sc.label}</span>
        </div>

        {/* Step progress */}
        {stepIdx >= 0 && stepIdx < 3 && (
          <div className="flex items-center gap-1 mt-2">
            {OrderSteps.slice(0, 3).map((step, i) => (
              <React.Fragment key={step}>
                <div className="flex flex-col items-center gap-0.5">
                  <div className="w-2 h-2 rounded-full transition-colors" style={{ background: i <= stepIdx ? sc.color : '#334155' }} />
                  <span className="text-[9px] whitespace-nowrap" style={{ color: i <= stepIdx ? sc.color : '#475569' }}>{step}</span>
                </div>
                {i < 2 && <div className="flex-1 h-px mb-3 transition-colors" style={{ background: i < stepIdx ? sc.color : '#334155' }} />}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const DashBoard = () => {
  const navigate = useNavigate()
  const user = getUser()
  const greeting = getGreeting()
  const [orders, setOrders] = useState([])
  const [menuItems, setMenuItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [ordersRes, menuRes] = await Promise.all([
          fetch(`http://localhost:3000/api/orders/user/${user.id}`, { headers: { Authorization: `Bearer ${getToken()}` } }),
          fetch('http://localhost:3000/api/menu')
        ])
        const [ordersData, menuData] = await Promise.all([ordersRes.json(), menuRes.json()])
        setOrders(Array.isArray(ordersData) ? ordersData : [])
        setMenuItems(Array.isArray(menuData) ? menuData.filter(i => i.isAvailable).slice(0, 8) : [])
      } catch { /* ignore */ } finally { setLoading(false) }
    }
    if (user) fetchAll()
  }, [])

  const activeOrders = orders.filter(o => ['pending', 'partially_ready', 'ready'].includes(o.status))
  const completedOrders = orders.filter(o => o.status === 'completed')
  const totalSpent = orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.totalAmount, 0)
  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U'

  return (
    <div className="p-4 space-y-5 pb-10">

      {/* Greeting card */}
      <div className={`relative bg-gradient-to-br ${greeting.bg} rounded-3xl p-5 overflow-hidden border border-slate-800`}>
        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5 blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-white/3 blur-xl pointer-events-none" />
        <div className="relative flex items-center justify-between">
          <div>
            <p className="text-white/50 text-xs">{greeting.emoji} {greeting.text}</p>
            <h1 className="text-2xl font-black text-white mt-0.5 capitalize tracking-tight">{user?.name}</h1>
            <p className="text-white/40 text-xs mt-1">
              {activeOrders.length > 0
                ? `${activeOrders.length} order${activeOrders.length > 1 ? 's' : ''} being prepared`
                : 'Ready to order something?'}
            </p>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="w-14 h-14 rounded-2xl bg-[#d9e8a0] flex items-center justify-center shadow-lg shadow-[#d9e8a0]/20 flex-shrink-0">
              <span className="text-slate-900 font-black text-xl">{initials}</span>
            </div>
            {activeOrders.length > 0 && (
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-green-400 text-[9px] font-semibold">Live</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hero slider */}
      <HeroSlider onOrder={() => navigate('/home/menu')} />

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total Orders', value: orders.length,          icon: '🧾', color: '#d9e8a0',  bg: 'from-[#d9e8a0]/10' },
          { label: 'Completed',    value: completedOrders.length,  icon: '✅', color: '#4ade80',  bg: 'from-green-400/10' },
          { label: 'Total Spent',  value: `₹${totalSpent}`,        icon: '💰', color: '#fb923c',  bg: 'from-orange-400/10' },
        ].map(s => (
          <div key={s.label} className={`relative bg-slate-900 rounded-2xl p-4 overflow-hidden border border-slate-800`}>
            <div className={`absolute inset-0 bg-gradient-to-br ${s.bg} to-transparent pointer-events-none`} />
            <div className="relative flex flex-col gap-1.5">
              <span className="text-xl">{s.icon}</span>
              <p className="text-xl font-black" style={{ color: s.color }}>{loading ? '—' : s.value}</p>
              <p className="text-slate-500 text-[10px] leading-tight">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Active orders */}
      {!loading && activeOrders.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <h2 className="text-slate-600 text-xs font-semibold uppercase tracking-wider">Live Orders</h2>
            </div>
            <button onClick={() => navigate('/home/orders')} className="text-xs text-[#d9e8a0] hover:text-yellow-200 transition-colors font-medium">Track all →</button>
          </div>
          {activeOrders.map(order => (
            <ActiveOrderCard key={order._id} order={order} onNavigate={() => navigate('/home/orders')} />
          ))}
        </div>
      )}

      {/* Available now — horizontal scroll */}
      {menuItems.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-slate-800 text-xs font-bold uppercase tracking-wider">🍱 Available Now</h2>
            <button onClick={() => navigate('/home/menu')} className="text-xs text-slate-600 hover:text-slate-900 transition-colors font-semibold">Browse all →</button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
            {menuItems.map(item => (
              <button key={item._id} onClick={() => navigate('/home/menu')}
                className="flex-shrink-0 w-56 text-left group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                style={{ background: '#0f172a' }}
              >
                {/* Full bleed image with gradient overlay */}
                <div className="relative w-full h-36 overflow-hidden">
                  {item.image
                    ? <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    : <div className="w-full h-full bg-slate-800 flex items-center justify-center text-5xl">🍱</div>
                  }
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                  {/* Price badge — top right */}
                  <div className="absolute top-2 right-2 bg-[#d9e8a0] rounded-xl px-2 py-0.5 shadow">
                    <span className="text-slate-900 text-xs font-black">₹{item.price}</span>
                  </div>

                  {/* Name + category pinned to bottom of image */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 pb-2">
                    <p className="text-white text-sm font-bold leading-tight truncate drop-shadow">{item.name}</p>
                    <span className="inline-block mt-1 text-[9px] font-semibold capitalize px-1.5 py-0.5 rounded-md bg-white/15 text-white/80 backdrop-blur-sm">{item.category}</span>
                  </div>
                </div>

                {/* Bottom action bar */}
                <div className="flex items-center justify-between px-3 py-2.5">
                  <span className="text-slate-400 text-[10px]">Tap to order</span>
                  <div className="w-7 h-7 rounded-full bg-[#d9e8a0] flex items-center justify-center shadow group-hover:scale-110 transition-transform">
                    <span className="text-slate-900 text-sm font-black leading-none">+</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quick actions — 3 equal columns */}
      <div className="space-y-2">
        <h2 className="text-slate-800 text-xs font-bold uppercase tracking-wider">Explore</h2>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Menu', sub: 'Order food', img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop', path: '/home/menu' },
            { label: 'Orders', sub: 'Track your queue', img: 'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=600&auto=format&fit=crop', path: '/home/orders' },
            { label: 'Feedback', sub: 'Rate us', img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&auto=format&fit=crop', path: '/home/feedback' },
          ].map(a => (
            <button key={a.label} onClick={() => navigate(a.path)} className="relative rounded-2xl overflow-hidden h-24 group text-left">
              <img src={a.img} alt={a.label} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 p-3">
                <p className="text-white font-bold text-sm">{a.label}</p>
                <p className="text-white/60 text-[10px]">{a.sub}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Recent history */}
      {!loading && completedOrders.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-slate-600 text-xs font-semibold uppercase tracking-wider">📋 Recent History</h2>
            <button onClick={() => navigate('/home/orders')} className="text-xs text-slate-400 hover:text-white transition-colors">See all →</button>
          </div>
          <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800">
            {completedOrders.slice(0, 3).map((order, i) => (
              <div key={order._id} className={`px-4 py-3 flex items-center justify-between ${i !== 0 ? 'border-t border-slate-800' : ''}`}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center flex-shrink-0 border border-slate-700">
                    <span className="text-slate-400 text-[10px] font-bold">#{order.queueNumber}</span>
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium truncate max-w-[160px]">{order.items.map(i => i.name).join(', ')}</p>
                    <p className="text-slate-500 text-xs">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[#d9e8a0] font-bold text-sm">₹{order.totalAmount}</p>
                  <div className="flex items-center justify-end gap-1 mt-0.5">
                    <div className="w-1 h-1 rounded-full bg-slate-600" />
                    <span className="text-slate-600 text-[9px]">Done</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && orders.length === 0 && (
        <div className="relative rounded-3xl overflow-hidden shadow-xl">
          <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=900&auto=format&fit=crop" alt="" className="w-full h-48 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/10" />
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-7 text-center px-6">
            <p className="text-white font-black text-xl">Start your first order!</p>
            <p className="text-white/50 text-sm mt-1 mb-4">Browse the canteen menu and skip the queue</p>
            <button onClick={() => navigate('/home/menu')} className="bg-[#d9e8a0] text-slate-900 font-black px-8 py-2.5 rounded-full hover:bg-yellow-200 active:scale-95 transition-all text-sm shadow-lg shadow-[#d9e8a0]/30">
              Browse Menu →
            </button>
          </div>
        </div>
      )}

    </div>
  )
}

export default DashBoard
