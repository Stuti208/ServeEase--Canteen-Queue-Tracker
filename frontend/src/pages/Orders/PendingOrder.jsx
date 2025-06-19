import React from 'react'

const PendingOrder = ({item,quantity,price ,Img}) => {
  return (
	<div className='flex flex-col border-1 border-purple-800 rounded-2xl h-full overflow-hidden w-[25vw]' >
		  <div className='w-full rounded-2xl object-cover'>
			  <img className='h-[20vh] w-full' src={Img} />
		  </div>

		  <div className='flex justify-around space-x-5 text-white text-[13px] font-medium bg-purple-800 px-4 py-3 border-l-rounded-2xl'>
			  <h2>{ item}</h2>
			  <h2>Qty: {quantity} Plate</h2>
			  <h2>Price: {price}</h2>
		  </div>
	</div>
  )
}

export default PendingOrder
