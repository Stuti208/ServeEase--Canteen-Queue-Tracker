import React from 'react'
import { useNavigate } from 'react-router-dom'
import { IconButton } from '@mui/material'
import CustomLink from '../Sidebar/CustomLink'
import SidebarOption from '../Sidebar/SidebarOption'
import AppsOutlinedIcon from '@mui/icons-material/AppsOutlined'
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined'
import LunchDiningOutlinedIcon from '@mui/icons-material/LunchDiningOutlined'
import FeedbackOutlinedIcon from '@mui/icons-material/FeedbackOutlined'
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined'
import { logout } from '../../utils/auth'

const AdminSidebar = () => {
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="flex flex-col items-center justify-between p-5 h-full text-gray-300 bg-slate-900 w-30 rounded-4xl">
      <div className="flex flex-col space-y-4">
        <CustomLink to="/admin/dashboard">
          <SidebarOption Icon={AppsOutlinedIcon} text='Home' />
        </CustomLink>

        <CustomLink to="/admin/orders">
          <SidebarOption Icon={ReceiptLongOutlinedIcon} text='Orders' />
        </CustomLink>

        <CustomLink to="/admin/menu">
          <SidebarOption Icon={LunchDiningOutlinedIcon} text='Menu' />
        </CustomLink>

        <CustomLink to="/admin/feedback">
          <SidebarOption Icon={FeedbackOutlinedIcon} text='Feedback' />
        </CustomLink>
      </div>

      <IconButton onClick={handleLogout} title="Log out">
        <LogoutOutlinedIcon style={{ color: '#94a3b8' }} />
      </IconButton>
    </div>
  )
}

export default AdminSidebar