import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api/menu"; // Adjust if needed

const MenuManagement = () => {
  const [menu, setMenu] = useState([]);
  const [form, setForm] = useState({ name: "", price: "", image: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch menu items
  const fetchMenu = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API);
      setMenu(res.data);
      setError("");
    } catch (err) {
      setError("Failed to fetch menu items.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMenu();
    // eslint-disable-next-line
  }, []);

  // Add new item
  const handleAdd = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const res = await axios.post(API, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMenu([...menu, res.data]);
      setForm({ name: "", price: "", image: "" });
      setError("");
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to add item.");
    }
  };

  // Delete item
  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${API}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMenu(menu.filter((item) => item._id !== id));
      setError("");
    } catch (err) {
      setError("Failed to delete item.");
    }
  };

  // Toggle availability
  const handleToggle = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.patch(
        `${API}/${id}/toggle`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMenu(menu.map((item) => (item._id === id ? res.data : item)));
      setError("");
    } catch (err) {
      setError("Failed to toggle availability.");
    }
  };

  return (
    <div className="p-6 w-full min-h-screen bg-slate-900 rounded-2xl text-white">
      <h2 className="text-2xl font-bold mb-4">Menu Management</h2>
      <form onSubmit={handleAdd} className="mb-6 flex flex-wrap gap-2 items-center">
        <input
          className="border p-2 rounded bg-slate-800 text-white"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          className="border p-2 rounded bg-slate-800 text-white"
          placeholder="Price"
          type="number"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          required
        />
        <input
          className="border p-2 rounded bg-slate-800 text-white"
          placeholder="Image URL"
          value={form.image}
          onChange={(e) => setForm({ ...form, image: e.target.value })}
        />
        <button className="bg-yellow-300 text-black px-4 py-2 rounded font-semibold hover:bg-yellow-400 transition" type="submit">
          Add
        </button>
      </form>
      {error && <div className="text-red-400 mb-2">{error}</div>}
      {loading ? (
        <div>Loading menu...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-slate-700 rounded-lg">
            <thead>
              <tr className="bg-slate-800">
                <th className="p-2">Name</th>
                <th className="p-2">Price</th>
                <th className="p-2">Available</th>
                <th className="p-2">Image</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {menu.map((item) => (
                <tr key={item._id} className="border-t border-slate-700">
                  <td className="p-2">{item.name}</td>
                  <td className="p-2">₹{item.price}</td>
                  <td className="p-2">
                    <button
                      className={`px-2 py-1 rounded text-xs font-semibold ${item.available ? "bg-green-400 text-black" : "bg-red-400 text-black"}`}
                      onClick={() => handleToggle(item._id)}
                    >
                      {item.available ? "Available" : "Unavailable"}
                    </button>
                  </td>
                  <td className="p-2">
                    {item.image && (
                      <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                    )}
                  </td>
                  <td className="p-2">
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition"
                      onClick={() => handleDelete(item._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {menu.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center p-4 text-gray-400">No menu items found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MenuManagement;