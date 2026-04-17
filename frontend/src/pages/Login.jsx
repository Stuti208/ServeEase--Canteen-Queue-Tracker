import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const navigate = useNavigate()
  const [tab, setTab] = useState('login')

  const [loginData, setLoginData] = useState({ email: '', password: '' })
  const [registerData, setRegisterData] = useState({ name: '', email: '', password: '' })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [registerSuccess, setRegisterSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      })
      const data = await res.json()
      if (!res.ok) { setError(data.message); return }
      localStorage.setItem('token', data.token)
      navigate(data.user.role === 'admin' ? '/admin' : '/home')
    } catch {
      setError('Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerData)
      })
      const data = await res.json()
      if (!res.ok) { setError(data.message); return }
      setRegisterData({ name: '', email: '', password: '' })
      setRegisterSuccess(true)
      setTab('login')
    } catch {
      setError('Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const switchTab = (t) => {
    setTab(t)
    setError('')
    setRegisterSuccess(false)
  }

  const Logo = ({ size = 'md' }) => {
    const isLg = size === 'lg'
    return (
      <div className={`relative flex-shrink-0 ${isLg ? 'w-20 h-20' : 'w-9 h-9'}`}>
        <div className="absolute inset-0 rounded-full" style={{ background: 'conic-gradient(from 180deg, #c9a84c, #f5e27a, #c9a84c, #8b6914, #c9a84c)' }} />
        <div className="absolute rounded-full bg-[#2a2d4a]" style={{ inset: isLg ? '3px' : '2px' }} />
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className={`font-bold tracking-tight select-none ${isLg ? 'text-2xl' : 'text-xs'}`}
            style={{ background: 'linear-gradient(135deg, #f5e27a 0%, #c9a84c 40%, #f5e27a 70%, #8b6914 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', fontFamily: 'Georgia, serif', fontStyle: 'italic' }}
          >
            SE
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex">

      {/* Left panel — branding (desktop only) */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-slate-900 p-12">
        <div className="flex items-center gap-3">
          <Logo size="sm" />
          <span className="text-white text-lg font-bold">ServeEase</span>
        </div>

        <div className="space-y-5">
          <h2 className="text-white text-4xl font-bold leading-tight">
            Skip the queue,<br />not the food.
          </h2>
          <p className="text-slate-400 text-base leading-relaxed max-w-sm">
            Order from your canteen, track your queue in real-time, and pick up when it's ready.
          </p>
        </div>

        <div className="flex gap-3">
          {['Order Online', 'Track Queue', 'Get Notified'].map(tag => (
            <span key={tag} className="bg-slate-800 text-slate-300 text-xs px-3 py-1.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center bg-slate-950 p-6">
        <div className="w-full max-w-sm">

          {/* Mobile brand */}
          <div className="lg:hidden flex flex-col items-center mb-8 space-y-1">
            <h1 className="text-white text-xl font-bold">ServeEase</h1>
            <p className="text-slate-500 text-sm">Skip the queue, not the food.</p>
          </div>

          {/* Desktop heading */}
          <div className="hidden lg:block mb-8">
            <h2 className="text-white text-2xl font-bold">
              {tab === 'login' ? 'Welcome back' : 'Create account'}
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              {tab === 'login' ? 'Sign in to your ServeEase account' : 'Join ServeEase to start ordering'}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex bg-slate-800 rounded-xl p-1 mb-6">
            {['login', 'register'].map(t => (
              <button
                key={t}
                onClick={() => switchTab(t)}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                  tab === t
                    ? 'bg-[#d9e8a0] text-slate-900 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t === 'login' ? 'Sign In' : 'Register'}
              </button>
            ))}
          </div>

          {/* Success banner */}
          {registerSuccess && (
            <div className="mb-5 flex items-center gap-2.5 bg-green-900/30 border border-green-800/60 text-green-400 text-sm px-4 py-3 rounded-xl">
              <span>✓</span>
              Account created — please sign in.
            </div>
          )}

          {/* Error banner */}
          {error && (
            <div className="mb-5 flex items-center gap-2.5 bg-red-900/30 border border-red-800/60 text-red-400 text-sm px-4 py-3 rounded-xl">
              <span>✕</span>
              {error}
            </div>
          )}

          {/* Login Form */}
          {tab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider">Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={loginData.email}
                  onChange={e => setLoginData({ ...loginData, email: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 text-white placeholder-slate-600 border border-slate-700 focus:outline-none focus:border-[#d9e8a0] focus:ring-1 focus:ring-[#d9e8a0]/30 transition-all text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={loginData.password}
                    onChange={e => setLoginData({ ...loginData, password: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-slate-800 text-white placeholder-slate-600 border border-slate-700 focus:outline-none focus:border-[#d9e8a0] focus:ring-1 focus:ring-[#d9e8a0]/30 transition-all text-sm pr-14"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(p => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs transition-colors"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#d9e8a0] text-slate-900 font-bold py-3 rounded-xl hover:bg-yellow-200 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm mt-1"
              >
                {loading ? 'Signing in…' : 'Sign In →'}
              </button>
            </form>
          )}

          {/* Register Form */}
          {tab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  placeholder="Your name"
                  value={registerData.name}
                  onChange={e => setRegisterData({ ...registerData, name: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 text-white placeholder-slate-600 border border-slate-700 focus:outline-none focus:border-[#d9e8a0] focus:ring-1 focus:ring-[#d9e8a0]/30 transition-all text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider">Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={registerData.email}
                  onChange={e => setRegisterData({ ...registerData, email: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 text-white placeholder-slate-600 border border-slate-700 focus:outline-none focus:border-[#d9e8a0] focus:ring-1 focus:ring-[#d9e8a0]/30 transition-all text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={registerData.password}
                    onChange={e => setRegisterData({ ...registerData, password: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-slate-800 text-white placeholder-slate-600 border border-slate-700 focus:outline-none focus:border-[#d9e8a0] focus:ring-1 focus:ring-[#d9e8a0]/30 transition-all text-sm pr-14"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(p => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs transition-colors"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#d9e8a0] text-slate-900 font-bold py-3 rounded-xl hover:bg-yellow-200 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm mt-1"
              >
                {loading ? 'Creating account…' : 'Create Account →'}
              </button>
            </form>
          )}

        </div>
      </div>

    </div>
  )
}

export default Login
