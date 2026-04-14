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
          <div className="bg-[#d9e8a0] rounded-full w-7 h-7 flex items-center justify-center">
            <span className="text-black text-sm font-bold">W</span>
          </div>
          <h2 className="text-white font-semibold">Canteen Queue Tracker</h2>
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
