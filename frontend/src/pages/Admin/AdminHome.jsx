import React, { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { IconButton } from '@mui/material'
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined'
import AdminSidebar from './AdminSidebar'
import { getUser, logout } from '../../utils/auth'

const AdminHome = () => {
  const navigate = useNavigate()
  const user = getUser()
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'A'

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
          <span className="text-[10px] bg-[#d9e8a0] text-slate-900 font-bold px-2 py-0.5 rounded-full">Admin</span>
        </div>

        <div className="flex items-center gap-1">
          <IconButton size="small">
            <NotificationsNoneOutlinedIcon style={{ color: 'white' }} />
          </IconButton>

          {/* Profile badge */}
          <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center ml-1 border border-slate-600">
            <span className="text-white font-bold text-[10px]">{initials}</span>
          </div>
        </div>
      </nav>

      {/* Main layout */}
      <div className="flex h-[calc(100vh-5rem)] space-x-4">
        <AdminSidebar onLogoutRequest={() => setShowLogoutConfirm(true)} />
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </div>

    </div>
  )
}

export default AdminHome
