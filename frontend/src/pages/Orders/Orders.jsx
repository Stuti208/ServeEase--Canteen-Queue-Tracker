import React from 'react'
import PendingOrder from './PendingOrder'
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import Img from '../../assets/Images/chholeBhature.jpg'

const Orders = () => {

	const responsive = {
		superLargeDesktop: {
		  breakpoint: { max: 4000, min: 3000 },
		  items: 5
		},
		desktop: {
		  breakpoint: { max: 3000, min: 1024 },
		  items: 3
		},
		tablet: {
		  breakpoint: { max: 1024, min: 464 },
		  items: 2
		},
		mobile: {
		  breakpoint: { max: 464, min: 0 },
		  items: 1
		}
	  };

  return (
	<div>
	  <div className='flex flex-col h-full w-full'>
			<h1 className='font-medium text-2xl'>Your Orders</h1> 

		    {/* orders to be completed  */}
			  {/* <div className='mt-3 flex items-center space-x-3 w-full overflow-x-auto whitespace-nowrap'> */}
			     <Carousel responsive={responsive}>
						<PendingOrder item='Chhole Bhature' quantity='2' price='90' Img={Img}/>
						<PendingOrder item='Chhole Bhature' quantity='2' price='90' Img={Img}/>
						<PendingOrder item='Chhole Bhature' quantity='2' price='90' Img={Img}/>
						<PendingOrder item='Chhole Bhature' quantity='2' price='90' Img={Img}/>
						<PendingOrder item='Chhole Bhature' quantity='2' price='90' Img={Img} />
				</Carousel>
			{/* </div> */}
		    <div></div>
	  </div>
	</div>
  )
}

export default Orders
