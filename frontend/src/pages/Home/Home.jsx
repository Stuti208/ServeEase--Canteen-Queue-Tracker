import React, { useRef, useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import { IconButton } from '@mui/material'
import Sidebar from '../Sidebar/Sidebar'
import { useNotifications } from '../../context/NotificationContext'

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

  const { notifications, unreadCount, markAllRead } = useNotifications()
  const [showNotifs, setShowNotifs] = useState(false)
  const panelRef = useRef(null)

  // close dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setShowNotifs(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleBellClick = () => {
    setShowNotifs(prev => !prev)
    if (!showNotifs) markAllRead()
  }

  return (
    <div className="bg-[#d9e8a0] p-2 h-screen">

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

        {/* Bell icon + dropdown */}
        <div className="relative flex items-center space-x-2" ref={panelRef}>
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

          {/* Notification Panel */}
          {showNotifs && (
            <div className="absolute right-0 top-10 w-80 bg-slate-900 rounded-2xl shadow-2xl z-50 overflow-hidden">

              {/* Panel header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700">
                <h3 className="text-white font-semibold text-sm">Notifications</h3>
                {notifications.length > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-gray-400 hover:text-white text-xs transition-colors"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              {/* Notification list */}
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 space-y-2">
                    <span className="text-2xl">🔕</span>
                    <p className="text-gray-400 text-xs">No notifications yet</p>
                  </div>
                ) : (
                  notifications.map(notif => (
                    <div
                      key={notif.id}
                      className={`flex items-start gap-3 px-4 py-3 border-b border-slate-800 last:border-0 ${
                        !notif.read ? 'bg-slate-800/60' : ''
                      }`}
                    >
                      <span className="text-lg flex-shrink-0 mt-0.5">{notifIcon[notif.type]}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-xs font-medium leading-snug">{notif.message}</p>
                        <p className="text-gray-400 text-[10px] mt-0.5">{notif.sub}</p>
                        <p className="text-gray-600 text-[10px] mt-0.5">{timeAgo(notif.timestamp)}</p>
                      </div>
                      {!notif.read && (
                        <div className="w-1.5 h-1.5 rounded-full bg-[#d9e8a0] flex-shrink-0 mt-1.5" />
                      )}
                    </div>
                  ))
                )}
              </div>

            </div>
          )}
        </div>
      </nav>

      {/* Main layout */}
      <div className="flex h-[calc(100vh-5rem)] space-x-4">
        <Sidebar />
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </div>

    </div>
  )
}

export default Home
