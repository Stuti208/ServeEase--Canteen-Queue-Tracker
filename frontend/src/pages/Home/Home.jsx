import React from 'react'
import { Outlet } from 'react-router-dom';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { IconButton } from '@mui/material';
import Sidebar from '../Sidebar/Sidebar';

const Home = () => {
  return (
	<div className="bg-yellow-200 p-2 h-screen"> 
		  <div className="overflow-hidden">
			  <nav className="w-full h-10 rounded-3xl flex items-center justify-between bg-slate-900 mb-4">
				  <div className="flex items-center space-x-2">
					  <div>
						  <img src=""></img>
					  </div>
					  <h2 className="text-white">Canteen Queue Tracker</h2>
				  </div>

				  <div class="flex items-center space-x-2">
					  <IconButton><NotificationsNoneIcon class="text-white"/></IconButton>
					  
				  </div>

			     
			  </nav> 

			  <div className="flex h-140 space-x-5">
				  <Sidebar/>
				  <Outlet/>
			  </div>

		  </div>     
	</div>
  )
}

export default Home
