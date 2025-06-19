import React from 'react'
import { Outlet } from 'react-router-dom';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';import { IconButton } from '@mui/material';
import Sidebar from '../Sidebar/Sidebar';
import logo from '../../assets/Images/logo3.PNG'
import WalletOutlinedIcon from '@mui/icons-material/WalletOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import { Avatar } from '@mui/material'


const HomeManagement = () => {
  return (
	<div className="bg-yellow-200 p-2 h-screen overflow-hidden"> 
		  <div className="flex flex-col h-full mb-2">
			  
			  {/* navbar */}
			  <nav className="w-full h-10 rounded-3xl flex items-center justify-between bg-slate-900 mb-3 p-3">
				  <div className="flex items-center space-x-3 ml-1">
					  <div className='h-[34px] w-[31px] rounded-full object-cover grid place-content-center'>
						  <img className="rounded-full" src={logo}></img>
					  </div>
					  <h2 className="text-white text-[20px] font-medium">ServeEase</h2>
				  </div>

				  <div className="flex items-center space-x-5 text-white">
					  <NotificationsOutlinedIcon />
					  <div className='flex items-center space-x-3 rounded-2xl bg-gray-800 px-2 py-1'>
					      <WalletOutlinedIcon fontSize='smaller'/>
						  <h3 className='text-[14px]'>Wallet</h3>
					  </div>
					  <Avatar sx={{ width: 28, height: 28 }}/>
					  
				  </div>   
			  </nav> 
 
			  <div className="flex space-x-6 w-full flex-grow">
				  <Sidebar/>
				  <Outlet/>
			  </div>

		  </div>     
	</div>
  )
}

export default HomeManagement
