import React from 'react'
import CustomLink from './CustomLink'
import SidebarOption from './SidebarOption'
import AppsOutlinedIcon from '@mui/icons-material/AppsOutlined'
import { IconButton } from '@mui/material'
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined'
import FeedbackOutlinedIcon from '@mui/icons-material/FeedbackOutlined'
import LunchDiningOutlinedIcon from '@mui/icons-material/LunchDiningOutlined'

const Sidebar = ({ onLogoutRequest }) => {

  return (
    <div className="flex flex-col items-center justify-between p-5 h-full text-gray-300 bg-slate-900 w-35 rounded-4xl">
      <div className="flex flex-col space-y-3">
        <CustomLink to="/home/dashboard">
          <SidebarOption Icon={AppsOutlinedIcon} text="Home" />
        </CustomLink>

        <CustomLink to="/home/menu">
          <SidebarOption Icon={LunchDiningOutlinedIcon} text="Menu" />
        </CustomLink>

        <CustomLink to="/home/orders">
          <SidebarOption Icon={AppsOutlinedIcon} text="Orders" />
        </CustomLink>

        <CustomLink to="/home/feedback">
          <SidebarOption Icon={FeedbackOutlinedIcon} text="Feedback" />
        </CustomLink>
      </div>

      <IconButton onClick={onLogoutRequest} title="Log out">
        <LogoutOutlinedIcon style={{ color: '#94a3b8' }} />
      </IconButton>
    </div>
  )
}

export default Sidebar
