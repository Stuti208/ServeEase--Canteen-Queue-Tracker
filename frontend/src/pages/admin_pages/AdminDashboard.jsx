import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUser } from '../../utils/auth'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'

const STATUS_STYLE = {
  pending:         { bg: 'bg-yellow-400/10', text: 'text-yellow-400', dot: 'bg-yellow-400', label: 'Placed' },
  partially_ready: { bg: 'bg-blue-400/10',   text: 'text-blue-400',   dot: 'bg-blue-400',   label: 'Partial' },
  ready:           { bg: 'bg-green-400/10',  text: 'text-green-400',  dot: 'bg-green-400',  label: 'Ready' },
  completed:       { bg: 'bg-slate-700/40',  text: 'text-slate-400',  dot: 'bg-slate-500',  label: 'Done' },
  cancelled:       { bg: 'bg-red-400/10',    text: 'text-red-400',    dot: 'bg-red-500',    label: 'Cancelled' },
  reassigned:      { bg: 'bg-orange-400/10', text: 'text-orange-400', dot: 'bg-orange-400', label: 'Reassigned' },
}

const PIE_COLORS = ['#d9e8a0', '#93c5fd', '#fca5a5', '#fb923c', '#a78bfa']

const timeAgo = (date) => {
  const diff = Math.floor((Date.now() - new Date(date)) / 1000)
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  return `${Math.floor(diff / 3600)}h ago`
}

const CustomTooltip = ({ active, payload, label, prefix = '' }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs shadow-xl">
      <p className="text-slate-400 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-semibold">
          {p.name}: {prefix}{p.value}
        </p>
      ))}
    </div>
  )
}

const AdminDashboard = () => {
  const navigate = useNavigate()
  const user = getUser()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [chartView, setChartView] = useState('orders') // 'orders' | 'revenue'

  useEffect(() => {
    fetch('http://localhost:3000/api/orders/stats')
      .then(r => r.json())
      .then(data => { setStats(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const v = (val, prefix = '') => loading ? '—' : `${prefix}${val ?? 0}`

  const statusPieData = stats ? [
    { name: 'Pending',   value: stats.today.pending },
    { name: 'Cooking',   value: stats.today.cooking },
    { name: 'Ready',     value: stats.today.ready },
    { name: 'Completed', value: stats.today.completed },
    { name: 'Cancelled', value: stats.today.cancelled },
  ].filter(d => d.value > 0) : []

  return (
    <div className="p-4 space-y-5 pb-10">

      {/* Header */}
      <div>
        <p className="text-slate-500 text-sm">Admin Panel</p>
        <h1 className="text-2xl font-bold text-slate-900 capitalize">
          Welcome, {user?.name} 👋
        </h1>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { emoji: '🧾', label: "Today's Orders", value: v(stats?.today.total), accent: 'text-white',         sub: `${v(stats?.active)} active now` },
          { emoji: '💰', label: "Today's Revenue", value: v(stats?.today.revenue, '₹'), accent: 'text-[#d9e8a0]', sub: 'excl. cancelled' },
          { emoji: '✅', label: 'Completed',        value: v(stats?.today.completed), accent: 'text-green-400',  sub: 'picked up today' },
          { emoji: '❌', label: 'Cancelled',        value: v(stats?.today.cancelled), accent: 'text-red-400',    sub: 'today' },
        ].map(k => (
          <div key={k.label} className="bg-slate-900 rounded-2xl p-5 space-y-3">
            <span className="text-2xl">{k.emoji}</span>
            <div>
              <p className={`text-3xl font-bold ${k.accent}`}>{k.value}</p>
              <p className="text-white text-sm font-medium mt-1">{k.label}</p>
              <p className="text-slate-500 text-xs mt-0.5">{k.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Area chart — 7-day trend */}
        <div className="lg:col-span-2 bg-slate-900 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-white font-semibold text-sm">7-Day Trend</h3>
              <p className="text-slate-500 text-xs">Orders & revenue over the past week</p>
            </div>
            <div className="flex bg-slate-800 rounded-lg p-0.5 gap-0.5">
              {['orders', 'revenue'].map(v => (
                <button
                  key={v}
                  onClick={() => setChartView(v)}
                  className={`px-3 py-1 rounded-md text-xs font-medium capitalize transition-colors ${
                    chartView === v ? 'bg-[#d9e8a0] text-slate-900' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
          {loading ? (
            <div className="h-48 flex items-center justify-center text-slate-600 text-sm">Loading…</div>
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={stats?.dailyData || []} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#d9e8a0" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#d9e8a0" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip prefix={chartView === 'revenue' ? '₹' : ''} />} />
                <Area
                  type="monotone"
                  dataKey={chartView}
                  stroke="#d9e8a0"
                  strokeWidth={2}
                  fill="url(#areaGrad)"
                  dot={{ fill: '#d9e8a0', r: 3, strokeWidth: 0 }}
                  activeDot={{ r: 5 }}
                  name={chartView === 'revenue' ? 'Revenue' : 'Orders'}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Pie chart — today's status split */}
        <div className="bg-slate-900 rounded-2xl p-5">
          <h3 className="text-white font-semibold text-sm mb-1">Order Status</h3>
          <p className="text-slate-500 text-xs mb-4">Today's breakdown</p>
          {loading || statusPieData.length === 0 ? (
            <div className="h-48 flex flex-col items-center justify-center text-slate-600 text-sm gap-2">
              <span className="text-3xl">📊</span>
              {loading ? 'Loading…' : 'No orders today yet'}
            </div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={140}>
                <PieChart>
                  <Pie
                    data={statusPieData}
                    cx="50%" cy="50%"
                    innerRadius={40} outerRadius={65}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {statusPieData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5 mt-2">
                {statusPieData.map((d, i) => (
                  <div key={d.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                      <span className="text-slate-400">{d.name}</span>
                    </div>
                    <span className="text-white font-semibold">{d.value}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Hourly bar chart + Top items */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Hourly orders bar chart */}
        <div className="lg:col-span-2 bg-slate-900 rounded-2xl p-5">
          <h3 className="text-white font-semibold text-sm mb-1">Hourly Orders</h3>
          <p className="text-slate-500 text-xs mb-4">Today's order distribution by hour</p>
          {loading ? (
            <div className="h-40 flex items-center justify-center text-slate-600 text-sm">Loading…</div>
          ) : (
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={stats?.hourlyData || []} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="hour" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} interval={1} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="orders" name="Orders" fill="#d9e8a0" radius={[4, 4, 0, 0]} maxBarSize={28} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Top items */}
        <div className="bg-slate-900 rounded-2xl p-5">
          <h3 className="text-white font-semibold text-sm mb-1">Top Items</h3>
          <p className="text-slate-500 text-xs mb-4">Most ordered today</p>
          {loading ? (
            <div className="space-y-3">
              {[1,2,3].map(i => <div key={i} className="h-6 bg-slate-800 rounded animate-pulse" />)}
            </div>
          ) : !stats?.topItems?.length ? (
            <div className="flex flex-col items-center justify-center h-32 text-slate-600 text-sm gap-2">
              <span className="text-3xl">🍱</span>
              No orders yet
            </div>
          ) : (
            <div className="space-y-3">
              {stats.topItems.map((item, i) => {
                const max = stats.topItems[0].qty
                const pct = Math.round((item.qty / max) * 100)
                return (
                  <div key={item.name}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-300 font-medium truncate max-w-[70%]">{item.name}</span>
                      <span className="text-[#d9e8a0] font-bold">{item.qty}×</span>
                    </div>
                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${pct}%`, background: `${PIE_COLORS[i % PIE_COLORS.length]}` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Bottom row — quick stats + recent orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Mini stat cards */}
        <div className="grid grid-cols-2 gap-3 content-start">
          {[
            { emoji: '⏳', label: 'Active Now',    value: v(stats?.active),        accent: 'text-yellow-400' },
            { emoji: '🍳', label: 'Cooking',       value: v(stats?.today.cooking),  accent: 'text-blue-400' },
            { emoji: '🥘', label: 'Menu Items',    value: v(stats?.menuItems),      accent: 'text-white' },
            { emoji: '💬', label: 'Total Feedback',value: v(stats?.feedbackCount),  accent: 'text-pink-400' },
          ].map(s => (
            <div key={s.label} className="bg-slate-900 rounded-2xl p-4">
              <span className="text-xl">{s.emoji}</span>
              <p className={`text-2xl font-bold mt-2 ${s.accent}`}>{s.value}</p>
              <p className="text-slate-500 text-xs mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Recent orders */}
        <div className="lg:col-span-2 bg-slate-900 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold text-sm">Recent Orders</h3>
            <button onClick={() => navigate('/admin/orders')} className="text-xs text-slate-400 hover:text-white transition-colors">
              View all →
            </button>
          </div>
          {loading ? (
            <div className="space-y-2">
              {[1,2,3].map(i => (
                <div key={i} className="flex gap-3 animate-pulse">
                  <div className="w-8 h-8 bg-slate-800 rounded-xl" />
                  <div className="flex-1 space-y-1.5 pt-1">
                    <div className="h-2.5 bg-slate-800 rounded w-1/3" />
                    <div className="h-2 bg-slate-800 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : !stats?.recentOrders?.length ? (
            <p className="text-slate-500 text-sm text-center py-8">No orders yet</p>
          ) : (
            <div className="space-y-2">
              {stats.recentOrders.map(order => {
                const ss = STATUS_STYLE[order.status] || STATUS_STYLE.pending
                return (
                  <div key={order._id} className="flex items-center gap-3 py-2 border-b border-slate-800 last:border-0">
                    <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center flex-shrink-0">
                      <span className="text-[#d9e8a0] font-bold text-xs">#{order.queueNumber}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium capitalize truncate">{order.customerName}</p>
                      <p className="text-slate-500 text-xs truncate">
                        {order.items.map(i => i.name).join(', ').slice(0, 30)}…
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${ss.bg}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${ss.dot}`} />
                        <span className={`text-[10px] font-medium ${ss.text}`}>{ss.label}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-slate-400 text-[10px]">₹{order.totalAmount}</span>
                        <span className="text-slate-600 text-[10px]">{timeAgo(order.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

    </div>
  )
}

export default AdminDashboard
