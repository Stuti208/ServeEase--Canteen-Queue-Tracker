import React, { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const API = "http://localhost:5000/api/orders";

const OrdersManagement = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Socket.io for real-time updates
  useEffect(() => {
    const socket = io("http://localhost:5000");
    socket.on("orderStatusUpdated", (updatedOrder) => {
      setOrders((prev) =>
        prev.map((order) => (order._id === updatedOrder._id ? updatedOrder : order))
      );
    });
    return () => socket.disconnect();
  }, []);

  // Fetch all orders
  const fetchOrders = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(API, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
      setError("");
    } catch (err) {
      setError("Failed to fetch orders.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line
  }, []);

  // Update order status
  const handleStatusChange = async (id, status) => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `${API}/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setError("");
    } catch (err) {
      setError("Failed to update status.");
    }
  };

  const statusOptions = ["in queue", "preparing", "ready for pickup", "completed"];

  return (
    <div className="p-6 w-full min-h-screen bg-slate-900 rounded-2xl text-white">
      <h2 className="text-2xl font-bold mb-4">Orders Management</h2>
      {error && <div className="text-red-400 mb-2">{error}</div>}
      {loading ? (
        <div>Loading orders...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-slate-700 rounded-lg">
            <thead>
              <tr className="bg-slate-800">
                <th className="p-2">Order ID</th>
                <th className="p-2">User</th>
                <th className="p-2">Items</th>
                <th className="p-2">Status</th>
                <th className="p-2">Created At</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-t border-slate-700">
                  <td className="p-2">{order._id.slice(-6)}</td>
                  <td className="p-2">{order.user?.name || "N/A"}</td>
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
                  <td className="p-2">
                    <select
                      className="bg-slate-800 text-white p-1 rounded"
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center p-4 text-gray-400">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrdersManagement;