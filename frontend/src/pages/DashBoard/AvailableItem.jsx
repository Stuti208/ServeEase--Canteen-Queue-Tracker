import React from 'react'

const AvailableItem = ({Icon,item,price}) => {
  return (
	  <div className='flex items-center justify-between'>
		  <div className='flex items-center space-x-2'>
			  <div className='h-[40px] w-[40px] bg-gray-700 rounded-full grid place-content-center'>
				  <Icon fontSize="small"/>
			  </div>
			  <h2>{item}</h2>
		  </div>

		  <div className='text-green-400'>&#8377; {price }</div>
	</div>
  )
}

export default AvailableItem
