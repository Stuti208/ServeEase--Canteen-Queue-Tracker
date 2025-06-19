import React, { useEffect, useState } from "react";
import axios from "axios";

const MENU_API = "http://localhost:5000/api/menu";
const ORDER_API = "http://localhost:5000/api/orders";

const Menu = () => {
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios.get(MENU_API).then(res => setMenu(res.data));
  }, []);

  const addToCart = (item) => {
    setCart((prev) => {
      const found = prev.find((i) => i.menuItem === item._id);
      if (found) {
        return prev.map((i) =>
          i.menuItem === item._id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { menuItem: item._id, quantity: 1, name: item.name }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((i) => i.menuItem !== id));
  };

  const placeOrder = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        ORDER_API,
        { items: cart.map(({ menuItem, quantity }) => ({ menuItem, quantity })) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("Order placed successfully!");
      setCart([]);
    } catch (err) {
      setMessage("Failed to place order.");
    }
  };

  return (
    <div className="p-6 w-full min-h-screen bg-slate-900 rounded-2xl text-white">
      <h2 className="text-2xl font-bold mb-4">Menu</h2>
      {message && <div className="mb-2">{message}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {menu.map((item) => (
          <div key={item._id} className="bg-slate-800 p-4 rounded-lg flex flex-col items-center">
            {item.image && (
              <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded mb-2" />
            )}
            <h3 className="text-lg font-semibold">{item.name}</h3>
            <p className="text-yellow-300 font-bold">₹{item.price}</p>
            <p className={`mt-1 ${item.available ? "text-green-400" : "text-red-400"}`}>
              {item.available ? "Available" : "Unavailable"}
            </p>
            <button
              className="mt-2 bg-yellow-300 text-black px-4 py-1 rounded font-semibold hover:bg-yellow-400 transition disabled:opacity-50"
              onClick={() => addToCart(item)}
              disabled={!item.available}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-2">Your Cart</h3>
        {cart.length === 0 ? (
          <p className="text-gray-400">No items in cart.</p>
        ) : (
          <ul>
            {cart.map((item) => (
              <li key={item.menuItem} className="flex items-center justify-between mb-2">
                <span>
                  {item.name} x {item.quantity}
                </span>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition"
                  onClick={() => removeFromCart(item.menuItem)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
        <button
          className="mt-4 bg-green-500 text-white px-6 py-2 rounded font-semibold hover:bg-green-600 transition disabled:opacity-50"
          onClick={placeOrder}
          disabled={cart.length === 0}
        >
          Place Order
        </button>
      </div>
    </div>
  );
};

export default Menu;
