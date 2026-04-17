import React from 'react'
import { Outlet } from 'react-router-dom'
import { IconButton } from '@mui/material'
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined'
import AdminSidebar from './AdminSidebar'

const AdminHome = () => {
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

        <div className="flex items-center space-x-2">
          <IconButton size="small">
            <NotificationsNoneOutlinedIcon className="text-white" style={{ color: 'white' }} />
          </IconButton>
        </div>
      </nav>

      {/* Main layout */}
      <div className="flex h-[calc(100vh-5rem)] space-x-4">
        <AdminSidebar/>

        {/* Page content */}
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </div>

    </div>
  )
}

export default AdminHome
