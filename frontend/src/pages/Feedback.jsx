import React, { useState } from 'react'
import { getToken, getUser } from '../utils/auth'

const CATEGORIES = [
  { value: 'food', label: 'Food Quality', emoji: '🍱' },
  { value: 'service', label: 'Service', emoji: '🙌' },
  { value: 'app', label: 'App Experience', emoji: '📱' },
  { value: 'other', label: 'Other', emoji: '💬' },
]

const Feedback = () => {
  const user = getUser()
  const [rating, setRating] = useState(0)
  const [hovered, setHovered] = useState(0)
  const [category, setCategory] = useState('food')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (rating === 0) { setError('Please select a star rating.'); return }
    if (!message.trim()) { setError('Please write a message.'); return }
    setError('')
    setLoading(true)
    try {
      const res = await fetch('http://localhost:3000/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({ rating, category, message: message.trim() })
      })
      const data = await res.json()
      if (!res.ok) { setError(data.message || 'Failed to submit.'); return }
      setSubmitted(true)
    } catch {
      setError('Something went wrong. Check your connection.')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setRating(0)
    setHovered(0)
    setCategory('food')
    setMessage('')
    setSubmitted(false)
    setError('')
  }

  if (submitted) {
    return (
      <div className="p-4 flex items-center justify-center h-full">
        <div className="bg-slate-900 rounded-2xl p-10 max-w-sm w-full text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#d9e8a0] flex items-center justify-center text-3xl mx-auto">✓</div>
          <h2 className="text-white text-xl font-bold">Thanks for your feedback!</h2>
          <p className="text-slate-400 text-sm">Your response helps us improve ServeEase.</p>
          <button
            onClick={resetForm}
            className="w-full bg-slate-800 text-white py-3 rounded-xl hover:bg-slate-700 transition-colors text-sm font-medium"
          >
            Submit another
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 max-w-lg">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Feedback</h1>
        <p className="text-slate-500 text-sm mt-1">Help us make ServeEase better</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-slate-900 rounded-2xl p-6 space-y-6">

        {/* Star rating */}
        <div>
          <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-3">How would you rate us?</p>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHovered(star)}
                onMouseLeave={() => setHovered(0)}
                className="text-3xl transition-transform hover:scale-110 focus:outline-none"
              >
                <span className={(hovered || rating) >= star ? 'text-[#d9e8a0]' : 'text-slate-700'}>★</span>
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p className="text-[#d9e8a0] text-xs mt-2">
              {['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent!'][rating]}
            </p>
          )}
        </div>

        {/* Category */}
        <div>
          <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-3">Category</p>
          <div className="grid grid-cols-2 gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat.value}
                type="button"
                onClick={() => setCategory(cat.value)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  category === cat.value
                    ? 'bg-[#d9e8a0] text-slate-900'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                <span>{cat.emoji}</span>
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Message */}
        <div>
          <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-3">Your message</p>
          <textarea
            rows={4}
            placeholder="Tell us what you think..."
            value={message}
            onChange={e => setMessage(e.target.value)}
            className="w-full bg-slate-800 text-white placeholder-slate-600 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#d9e8a0] resize-none border border-slate-700 transition-colors"
          />
          <p className="text-slate-600 text-xs mt-1 text-right">{message.length}/500</p>
        </div>

        {error && (
          <p className="text-red-400 text-sm bg-red-900/20 px-4 py-2 rounded-xl">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#d9e8a0] text-slate-900 font-bold py-3 rounded-xl hover:bg-yellow-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Submitting…' : 'Submit Feedback'}
        </button>
      </form>
    </div>
  )
}

export default Feedback;
