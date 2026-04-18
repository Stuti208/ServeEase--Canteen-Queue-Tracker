import React, { useRef, useState, useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import { IconButton } from '@mui/material'
import Sidebar from '../Sidebar/Sidebar'
import { useNotifications } from '../../context/NotificationContext'
import { getUser, logout } from '../../utils/auth'

const timeAgo = (date) => {
  const diff = Math.floor((Date.now() - new Date(date)) / 1000)
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  return `${Math.floor(diff / 3600)}h ago`
}

const notifIcon = {
  order_ready: '✅',
  item_ready: '🔔',
  reassigned: '⚠️',
  received: '🎉'
}

const Home = () => {
  const navigate = useNavigate()
  const user = getUser()
  const { notifications, unreadCount, markAllRead } = useNotifications()
  const [showNotifs, setShowNotifs] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const panelRef = useRef(null)
  const profileRef = useRef(null)

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U'

  useEffect(() => {
    const handleClick = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) setShowNotifs(false)
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleBellClick = () => {
    setShowNotifs(prev => !prev)
    setShowProfile(false)
    if (!showNotifs) markAllRead()
  }

  const handleProfileClick = () => {
    setShowProfile(prev => !prev)
    setShowNotifs(false)
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="bg-[#d9e8a0] p-2 h-screen">

      {/* Logout confirmation modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-slate-900 rounded-2xl p-6 max-w-xs w-full shadow-2xl space-y-4 border border-slate-700">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-red-400/10 flex items-center justify-center text-2xl">👋</div>
              <h3 className="text-white font-bold text-lg">Log out?</h3>
              <p className="text-slate-400 text-sm">Are you sure you want to log out of ServeEase?</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 bg-slate-800 text-white py-2.5 rounded-xl hover:bg-slate-700 transition-colors text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 bg-red-500 text-white py-2.5 rounded-xl hover:bg-red-600 transition-colors text-sm font-semibold"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navbar */}
      <nav className="w-full h-10 rounded-3xl flex items-center justify-between bg-slate-900 mb-4 px-4">
        <div className="flex items-center space-x-2">
          <div className="relative w-7 h-7 flex-shrink-0">
            <div className="absolute inset-0 rounded-full" style={{ background: 'conic-gradient(from 180deg, #c9a84c, #f5e27a, #c9a84c, #8b6914, #c9a84c)' }} />
            <div className="absolute rounded-full bg-[#2a2d4a]" style={{ inset: '2px' }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[9px] font-bold italic select-none" style={{ background: 'linear-gradient(135deg, #f5e27a 0%, #c9a84c 50%, #f5e27a 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', fontFamily: 'Georgia, serif' }}>SE</span>
            </div>
          </div>
          <h2 className="text-white font-semibold">ServeEase</h2>
        </div>

        <div className="flex items-center gap-1">

          {/* Bell */}
          <div className="relative" ref={panelRef}>
            <div className="relative">
              <IconButton size="small" onClick={handleBellClick}>
                <NotificationsNoneIcon style={{ color: 'white' }} />
              </IconButton>
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-white text-[9px] flex items-center justify-center font-bold pointer-events-none">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </div>

            {showNotifs && (
              <div className="absolute right-0 top-10 w-80 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl z-50 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700">
                  <h3 className="text-white font-semibold text-sm">Notifications</h3>
                  {notifications.length > 0 && (
                    <button onClick={markAllRead} className="text-slate-400 hover:text-white text-xs transition-colors">
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 space-y-2">
                      <span className="text-2xl">🔕</span>
                      <p className="text-slate-400 text-xs">No notifications yet</p>
                    </div>
                  ) : (
                    notifications.map(notif => (
                      <div key={notif.id} className={`flex items-start gap-3 px-4 py-3 border-b border-slate-800 last:border-0 ${!notif.read ? 'bg-slate-800/60' : ''}`}>
                        <span className="text-lg flex-shrink-0 mt-0.5">{notifIcon[notif.type]}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-xs font-medium leading-snug">{notif.message}</p>
                          <p className="text-slate-400 text-[10px] mt-0.5">{notif.sub}</p>
                          <p className="text-slate-600 text-[10px] mt-0.5">{timeAgo(notif.timestamp)}</p>
                        </div>
                        {!notif.read && <div className="w-1.5 h-1.5 rounded-full bg-[#d9e8a0] flex-shrink-0 mt-1.5" />}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={handleProfileClick}
              className="w-7 h-7 rounded-full bg-[#d9e8a0] flex items-center justify-center hover:bg-yellow-200 transition-colors ml-1"
            >
              <span className="text-slate-900 font-bold text-[10px]">{initials}</span>
            </button>

            {showProfile && (
              <div className="absolute right-0 top-10 w-56 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl z-50 overflow-hidden">
                {/* User info */}
                <div className="px-4 py-4 border-b border-slate-700">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#d9e8a0] flex items-center justify-center flex-shrink-0">
                      <span className="text-slate-900 font-bold text-sm">{initials}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-white font-semibold text-sm capitalize truncate">{user?.name}</p>
                      <p className="text-slate-400 text-xs truncate">{user?.email}</p>
                      <p className="text-slate-600 text-[10px] capitalize mt-0.5">{user?.role}</p>
                    </div>
                  </div>
                </div>
                {/* Actions */}
                <div className="p-2">
                  <button
                    onClick={() => { setShowProfile(false); setShowLogoutConfirm(true) }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-400/10 transition-colors text-sm font-medium"
                  >
                    <span>→</span>
                    Log Out
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </nav>

      {/* Main layout */}
      <div className="flex h-[calc(100vh-5rem)] space-x-4">
        <Sidebar onLogoutRequest={() => setShowLogoutConfirm(true)} />
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </div>

    </div>
  )
}

export default Home;
