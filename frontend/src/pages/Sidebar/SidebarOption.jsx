import React from 'react'

const SidebarOption = ({Icon,text}) => {
  return (
	<div className="flex items-center space-x-2 hover:bg-gray-800 p-2 rounded-xl active:text-white">
		  <Icon />
		  <h3>{text}</h3>
	</div>
  )
}

export default SidebarOption