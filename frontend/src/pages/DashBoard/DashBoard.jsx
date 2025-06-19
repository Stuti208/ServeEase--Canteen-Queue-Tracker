import React from 'react' 
import { Chart as ChartJS} from 'chart.js/auto';
import { Bar, Doughnut, Line } from "react-chartjs-2";
import sourceData from '../../data/SourceData.json'
import profitData from '../../data/ProfitData.json'
import OrderItem from './OrderItem';
import burgerImage from '../../assets/Images/burger.avif'
import AvailableItem from './AvailableItem';
import FreeBreakfastOutlinedIcon from '@mui/icons-material/FreeBreakfastOutlined';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import RamenDiningOutlinedIcon from '@mui/icons-material/RamenDiningOutlined';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import { Link, useNavigate } from 'react-router';

const DashBoard = () => {
	const navigate = useNavigate();
	const orderItems = [
		{
			item: 'Chilly Potato',
			deadline: '15:00',
			paymentStatus:'Paid'
		},
		{
			item: 'Noodles',
			deadline: '15:10',
			paymentStatus:'Not Paid'
		},
		{
			item: 'Oreo Shake',
			deadline: '15:35',
			paymentStatus:'Paid'
		},
	];

  return (
	  <div>
		  <div className='flex items-center space-x-10 w-full'>
			  
			  {/* information for admin */}
			  <div className='flex flex-col h-full w-[60vw]'>
					{/* first section */}
					<div>
						<h1 className='font-medium text-2xl'>Dashboard</h1>
						<h3>Canteen payments and transactions management</h3>
					</div>
					
					{/* second section */}
					<div className="flex items-center w-full mt-3 space-x-5">
						
						{/* balance information */}
						<div className="p-5 w-full h-[40vh] flex flex-col bg-slate-900 rounded-2xl">
							<div className="">
									<div>
										<h3 className="text-gray-400 text-[14px]">Total balance</h3>
										<h1 className="text-white text-[22px]"> &#8377; 80,300</h1>
									</div>
									
									<div className="flex items-center space-x-3 mt-5">
									<button className="text-gray-400 rounded-3xl border-1 px-6 py-2 text-[14.5px] cursor-pointer">In Queue</button>
									<button className="rounded-3xl border-1 px-6 py-2 text-[14.5px] bg-yellow-300 text-black cursor-pointer">Received</button>
								</div>
								
									<div className="mt-2 h-3 border-b-1 border-gray-700"></div>
								
									<div className="flex items-center space-x-4 mt-5">
										<div>
											<h3 className="text-gray-400 text-[14px]">Online Queue</h3>
											<h1 className="text-white text-[19.5px]"> 20</h1>
										</div>
										<div>
											<h3 className="text-gray-400 text-[14px]">Physical Queue</h3>
											<h1 className="text-white text-[19.5px]"> 10</h1>
										</div>
									</div>
							</div>	  
						</div>

						{/* bar chart */}
						<div className='w-full p-3 bg-slate-900 rounded-2xl'>
							<div className="w-full h-[37vh]">
								<Bar className='h-full w-[37vw]'
								data={{
									labels: sourceData.map((data) => data.label),
									datasets: [
										{
											barThickness: 21,
											label: "Income",
											data: sourceData.map((data) => data.value),
											backgroundColor: ["oklch(90.5% 0.182 98.111)",],
											hoverBackgroundColor: [ "oklch(94.5% 0.129 101.54)"],
											borderSkipped: false,
											borderRadius: 9,
											minBarLength: 10,
										}
									]
								}}
									
								options={{
										responsive: true,
										plugins: {
											legend: {
												position: 'top',
												labels: {
													color: '#c7c2c1',
													font: { size: 16 }
												},
											},
											tooltip: {
												backgroundColor: '#1f285d',
												titleColor: '#F9FAFB',
												bodyColor: '#D1D5DB',
											},
									},
									scales: {
										x: {
											ticks: {color: '#c7c2c1', },
											grid: {display:false,}
										},
										y: {
											ticks: {color: '#c7c2c1', },
											grid: {display:false,}
										}
										}
			
								}}
							/>
							</div>	  			  
						</div>
					</div>
					
					{/* third section */}
					<div className='flex-grow flex items-center h-full mt-4 w-full space-x-5'>
						
						{/* orders in queue */}
						<div className='bg-slate-900 rounded-2xl p-3 h-[35vh] '>
							<h1 className='text-white'>Orders in Queue</h1>
						    <div className='mt-1 flex flex-col justify-evenly h-full '>
							    {
								  orderItems.map((el, index) => {
									  return <OrderItem key={index} item={el.item} deadline={el.deadline} paymentStatus={el.paymentStatus} showBorder={index != orderItems.length - 1} />
								  }) 
							    }
							</div>
						</div>

						{/* doughnut chart */}
						<div className='bg-slate-900 rounded-2xl'>
							<h1 className='text-white text-center mb-2'>Most Profitable Item</h1>
							<div className='w-[28vw] h-[30vh] max-h-screen grid place-content-center'>
							<Doughnut
								data={{
									labels: profitData.map((data) => data.label),
									datasets: [
										{
											label: "Items",
											data: profitData.map((data) => data.value),
											backgroundColor: [
												"oklch(90.5% 0.182 98.111)",
												"oklch(63.7% 0.237 25.331)",
												"oklch(84.1% 0.238 128.85)",
												"oklch(96.2% 0.059 95.617)"
											],
											borderWidth:0,
										}
									]
								}}
									
								options={{
										responsive: true,
										plugins: {
											legend: {
												position: 'bottom',
												labels: {
													color: 'oklch(92.8% 0.006 264.531)',
													usePointStyle: true,
													pointStyle:'circle',
													font: { size: 11 },
													boxWidth:10,
												},
											},
											tooltip: {
												enabled: true,
											},
									},
									scales: {
										x: {
											display:false,									
										},
										y: {
											display:false,
										}
										}
			
								}}
							/>
							</div>
						</div>
					</div>	
			   </div>
				
			  {/* available items */}
			  <div className='p-4 bg-slate-900 rounded-2xl text-white h-full min-h-[80vh]'>
				  <div className='w-[20vw] rounded-2xl'>
					  <img className="rounded-2xl" src={burgerImage}/>
				  </div>

				  <div className='mt-3 h-full'>
					  <h1 className='text-[19px]'>Available Items</h1>
					  <div className='mt-5 flex flex-col justify-evenly h-full space-y-6'>
						  <AvailableItem Icon={ FreeBreakfastOutlinedIcon} item='Coffee' price='20'/>
						  <AvailableItem Icon={ ShoppingBagOutlinedIcon} item='Burger' price='25'/>
						  <AvailableItem Icon={ RamenDiningOutlinedIcon} item='Noodles' price='70'/>
						  <AvailableItem Icon={StorefrontOutlinedIcon} item='Chilli Potato' price='80' />
						  <Link to='/home/menu' className='text-blue-500'>See More</Link>
					  </div>
				  </div>
			  </div>
		 </div>
	 </div>
  )
}

export default DashBoard
