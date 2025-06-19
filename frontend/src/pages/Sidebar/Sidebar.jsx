import React from 'react'
import CustomLink from './CustomLink'
import SidebarOption from './SidebarOption'
import AppsOutlinedIcon from '@mui/icons-material/AppsOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { IconButton } from '@mui/material';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import FeedbackOutlinedIcon from '@mui/icons-material/FeedbackOutlined';
import LunchDiningOutlinedIcon from '@mui/icons-material/LunchDiningOutlined';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';
import WindowOutlinedIcon from '@mui/icons-material/WindowOutlined';

const Sidebar = () => {
  return (
	  <div className="flex flex-col items-center justify-between p-5 h-full text-gray-300 bg-slate-900 w-35 rounded-4xl">
		<div class="flex flex-col space-y-3">
			<CustomLink to="/home/dashboard">
				<SidebarOption Icon={WindowOutlinedIcon} text="Home"/>
			</CustomLink>
			
			<CustomLink to="/home/menu">
				<SidebarOption Icon={LunchDiningOutlinedIcon } text="Menu"/>
			</CustomLink>
			
			<CustomLink to="/home/orders">
				<SidebarOption Icon={ ListAltOutlinedIcon} text="Orders"/>
			</CustomLink>
			
			<CustomLink to="/home/feedback">
				<SidebarOption Icon={FeedbackOutlinedIcon } text="Feedback"/>
			</CustomLink>
			
			<CustomLink to="/home/settings">
				<SidebarOption Icon={SettingsOutlinedIcon } text="Settings"/>
			</CustomLink>
		  </div>  
		  
		  <div className="flex space-x-2 items-center hover:text-red-500 cursor-pointer">
			  {/* <IconButton> */}
			  <LogoutOutlinedIcon />
			  <h3>Sign Out</h3>
			  {/* </IconButton> */}
		  </div>

	</div>
  )
}

export default Sidebar
