import React, { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const API = "http://localhost:5000/api/orders/my";

const OrderTracking = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // Real-time updates
  useEffect(() => {
    const socket = io("http://localhost:5000");
    socket.on("orderStatusUpdated", (updatedOrder) => {
      setOrders((prev) =>
        prev.map((order) => (order._id === updatedOrder._id ? updatedOrder : order))
      );
    });
    return () => socket.disconnect();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(API, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="p-6 w-full min-h-screen bg-slate-900 rounded-2xl text-white">
      <h2 className="text-2xl font-bold mb-4">Order Tracking</h2>
      {loading ? (
        <div>Loading your orders...</div>
      ) : (
        <div>
          {orders.length === 0 ? (
            <p className="text-gray-400">You have no orders.</p>
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
                {orders.map((order) => (
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
      )}
    </div>
  );
};

export default OrderTracking;