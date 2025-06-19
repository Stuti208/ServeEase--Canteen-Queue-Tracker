// import React from 'react'
// import { Outlet } from 'react-router-dom';
// import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';import { IconButton } from '@mui/material';
// import Sidebar from '../Sidebar/Sidebar';
// import logo from '../../assets/Images/logo3.PNG'
// import WalletOutlinedIcon from '@mui/icons-material/WalletOutlined';
// import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
// import { Avatar } from '@mui/material'


// const Home = () => {
//   return (
// 	<div className="bg-yellow-200 p-2 h-screen overflow-hidden"> 
// 		  <div className="flex flex-col h-full mb-2">
			  
// 			  {/* navbar */}
// 			  <nav className="w-full h-10 rounded-3xl flex items-center justify-between bg-slate-900 mb-3 p-3">
// 				  <div className="flex items-center space-x-3 ml-1">
// 					  <div className='h-[34px] w-[31px] rounded-full object-cover grid place-content-center'>
// 						  <img className="rounded-full" src={logo}></img>
// 					  </div>
// 					  <h2 className="text-white text-[20px] font-medium">ServeEase</h2>
// 				  </div>

// 				  <div className="flex items-center space-x-5 text-white">
// 					  <NotificationsOutlinedIcon />
// 					  <div className='flex items-center space-x-3 rounded-2xl bg-gray-800 px-2 py-1'>
// 					      <WalletOutlinedIcon fontSize='smaller'/>
// 						  <h3 className='text-[14px]'>Wallet</h3>
// 					  </div>
// 					  <Avatar sx={{ width: 28, height: 28 }}/>
					  
// 				  </div>   
// 			  </nav> 
 
// 			  <div className="flex space-x-6 w-full flex-grow">
// 				  <Sidebar/>
// 				  <Outlet/>
// 			  </div>

// 		  </div>     
// 	</div>
//   )
// }

// export default Home


import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const ORDERS_API = "http://localhost:5000/api/orders/my";

const Home = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch user's orders
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      console.log("Token:", token); // Debug log
      
      if (!token) {
        setError("No token found - please log in");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(ORDERS_API, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data);
        setError("");
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to fetch orders: " + err.message);
      }
      setLoading(false);
    };
    fetchOrders();
  }, []);

  // Calculate estimated waiting time (simple: count of 'in queue' orders * 2 min)
  const queueCount = orders.filter((o) => o.status === "in queue").length;
  const estimatedWait = queueCount * 2;

  return (
    <div className="p-6 w-full min-h-screen bg-slate-900 rounded-2xl text-white">
      <h2 className="text-2xl font-bold mb-4">Welcome to the Canteen Queue Tracker!</h2>
      
      {/* Debug info */}
      <div className="mb-4 p-4 bg-red-900 rounded">
        <h3 className="font-bold">Debug Info:</h3>
        <p>Token exists: {localStorage.getItem("token") ? "Yes" : "No"}</p>
        <p>Loading: {loading ? "Yes" : "No"}</p>
        <p>Error: {error || "None"}</p>
        <p>Orders count: {orders.length}</p>
      </div>

      <div className="mb-6">
        <Link
          to="/menu"
          className="bg-yellow-300 text-black px-4 py-2 rounded font-semibold hover:bg-yellow-400 transition mr-4"
        >
          Place New Order
        </Link>
        <Link
          to="/feedback"
          className="bg-blue-500 text-white px-4 py-2 rounded font-semibold hover:bg-blue-600 transition"
        >
          Give Feedback
        </Link>
      </div>
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-2">Estimated Waiting Time</h3>
        <p>
          There {queueCount === 1 ? "is" : "are"} <span className="font-bold">{queueCount}</span> order{queueCount !== 1 && "s"} in the queue.
          <br />
          Estimated wait: <span className="font-bold">{estimatedWait} min</span>
        </p>
      </div>
      <div>
        <h3 className="text-xl font-bold mb-2">Recent Orders</h3>
        {loading ? (
          <div>Loading your orders...</div>
        ) : error ? (
          <div className="text-red-400">{error}</div>
        ) : orders.length === 0 ? (
          <p className="text-gray-400">You have no orders yet.</p>
        ) : (
          <table className="w-full border border-slate-700 rounded-lg">
            <thead>
              <tr className="bg-slate-800">
                <th className="p-2">Order ID</th>
                <th className="p-2">Items</th>
                <th className="p-2">Status</th>
                <th className="p-2">Created At</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map((order) => (
                <tr key={order._id} className="border-t border-slate-700">
                  <td className="p-2">{order._id.slice(-6)}</td>
                  <td className="p-2">
                    <ul>
                      {order.items.map((item, idx) => (
                        <li key={idx}>
                          {item.menuItem?.name} x {item.quantity}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="p-2">{order.status}</td>
                  <td className="p-2">
                    {new Date(order.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Home;
