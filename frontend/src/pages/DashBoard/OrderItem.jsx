import React from 'react'

const OrderItem = ({key,item,deadline,paymentStatus,showBorder}) => {
	return (
	  <>
	  <div className="flex items-center space-x-44.5">
		  <div className='flex items-center'>
	         <div className="w-8 h-8 border-4 border-yellow-400  border-b-gray-600 border-l-gray-600 rounded-full mr-4"></div>
			  <div>  
				  <h2 className='text-white text-[15px]'>{item}</h2>
				  <h3 className='text-gray-400 text-[12px]'>Deadline: { deadline}</h3>
			  </div>
		  </div>

		  <div>
			  <h2 className='text-gray-400 text-[12px]'>Payment Status</h2>
			  <h3 className='text-white text-[15px]'>{ paymentStatus}</h3>
		  </div>

	</div>
			
			<div className={` ${showBorder?`border-b-1 border-gray-700`:''} mt-2`}></div> 
	 </>
  )
}

export default OrderItem
