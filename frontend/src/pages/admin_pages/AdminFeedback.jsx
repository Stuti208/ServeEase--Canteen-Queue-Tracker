import React, { useState, useEffect } from 'react'
import { getToken } from '../../utils/auth'

const CATEGORY_LABEL = {
  food: { label: 'Food Quality', emoji: '🍱' },
  service: { label: 'Service', emoji: '🙌' },
  app: { label: 'App Experience', emoji: '📱' },
  other: { label: 'Other', emoji: '💬' },
}

const RATING_LABEL = ['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent']

const timeAgo = (date) => {
  const diff = Math.floor((Date.now() - new Date(date)) / 1000)
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

const StarDisplay = ({ rating }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map(s => (
      <span key={s} className={`text-sm ${s <= rating ? 'text-[#d9e8a0]' : 'text-slate-700'}`}>★</span>
    ))}
  </div>
)

const AdminFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => { fetchFeedback() }, [])

  const fetchFeedback = async () => {
    setLoading(true)
    try {
      const res = await fetch('http://localhost:3000/api/feedback', {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      })
      const data = await res.json()
      setFeedbacks(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const filtered = filter === 'all' ? feedbacks : feedbacks.filter(f => f.category === filter)

  const avgRating = feedbacks.length
    ? (feedbacks.reduce((s, f) => s + f.rating, 0) / feedbacks.length).toFixed(1)
    : '—'

  const ratingCounts = [5, 4, 3, 2, 1].map(r => ({
    rating: r,
    count: feedbacks.filter(f => f.rating === r).length
  }))

  return (
    <div className="p-4 space-y-5">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Feedback</h1>
        <p className="text-slate-500 text-sm">{feedbacks.length} response{feedbacks.length !== 1 ? 's' : ''} total</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="bg-slate-900 rounded-2xl p-4 text-center">
          <p className="text-[#d9e8a0] text-3xl font-bold">{avgRating}</p>
          <p className="text-slate-400 text-xs mt-1">Avg Rating</p>
          <div className="flex justify-center mt-1">
            <StarDisplay rating={Math.round(avgRating)} />
          </div>
        </div>
        {ratingCounts.slice(0, 3).map(({ rating, count }) => (
          <div key={rating} className="bg-slate-900 rounded-2xl p-4 text-center">
            <p className="text-white text-3xl font-bold">{count}</p>
            <div className="flex justify-center mt-1">
              <StarDisplay rating={rating} />
            </div>
            <p className="text-slate-500 text-xs mt-0.5">{RATING_LABEL[rating]}</p>
          </div>
        ))}
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        {['all', 'food', 'service', 'app', 'other'].map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${
              filter === cat
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-700 hover:bg-slate-200'
            }`}
          >
            {cat === 'all' ? 'All' : `${CATEGORY_LABEL[cat].emoji} ${CATEGORY_LABEL[cat].label}`}
            <span className="ml-1.5 text-xs opacity-60">
              {cat === 'all' ? feedbacks.length : feedbacks.filter(f => f.category === cat).length}
            </span>
          </button>
        ))}
      </div>

      {/* Feedback list */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-slate-900 rounded-2xl p-5 animate-pulse space-y-2">
              <div className="h-3 bg-slate-800 rounded w-1/4" />
              <div className="h-2 bg-slate-800 rounded w-full" />
              <div className="h-2 bg-slate-800 rounded w-3/4" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-slate-900 rounded-2xl p-12 flex flex-col items-center justify-center space-y-3 text-center">
          <div className="w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center text-2xl">💬</div>
          <p className="text-white font-medium">No feedback yet</p>
          <p className="text-slate-500 text-sm">Responses will appear here once users submit.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(fb => (
            <div key={fb._id} className="bg-slate-900 rounded-2xl p-5 space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-sm font-bold text-[#d9e8a0]">
                    {fb.userName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">{fb.userName}</p>
                    <p className="text-slate-500 text-xs">{timeAgo(fb.createdAt)}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <StarDisplay rating={fb.rating} />
                  <span className="text-xs text-slate-500">
                    {CATEGORY_LABEL[fb.category]?.emoji} {CATEGORY_LABEL[fb.category]?.label}
                  </span>
                </div>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed border-t border-slate-800 pt-3">
                {fb.message}
              </p>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}

export default AdminFeedback
