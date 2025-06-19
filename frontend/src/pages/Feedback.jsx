import React, { useEffect, useState } from "react";
import axios from "axios";

const ORDERS_API = "http://localhost:5000/api/orders/my";
const FEEDBACK_API = "http://localhost:5000/api/feedback";

const Feedback = () => {
  const [orders, setOrders] = useState([]);
  const [feedback, setFeedback] = useState({ order: "", rating: 5, comment: "" });
  const [message, setMessage] = useState("");
  const [myFeedbacks, setMyFeedbacks] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(ORDERS_API, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setOrders(res.data));
    axios
      .get(`${FEEDBACK_API}/my`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setMyFeedbacks(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      await axios.post(FEEDBACK_API, feedback, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("Feedback submitted!");
      setFeedback({ order: "", rating: 5, comment: "" });
    } catch {
      setMessage("Failed to submit feedback.");
    }
  };

  return (
    <div className="p-6 w-full min-h-screen bg-slate-900 rounded-2xl text-white">
      <h2 className="text-2xl font-bold mb-4">Submit Feedback</h2>
      {message && <div className="mb-2">{message}</div>}
      <form onSubmit={handleSubmit} className="mb-6 flex flex-col gap-2 max-w-md">
        <label>
          Order:
          <select
            className="w-full p-2 rounded bg-slate-800 text-white"
            value={feedback.order}
            onChange={(e) => setFeedback({ ...feedback, order: e.target.value })}
            required
          >
            <option value="">Select Order</option>
            {orders.map((order) => (
              <option key={order._id} value={order._id}>
                {order._id.slice(-6)} - {order.items.map(i => i.menuItem?.name).join(", ")}
              </option>
            ))}
          </select>
        </label>
        <label>
          Rating:
          <select
            className="w-full p-2 rounded bg-slate-800 text-white"
            value={feedback.rating}
            onChange={(e) => setFeedback({ ...feedback, rating: e.target.value })}
            required
          >
            {[5, 4, 3, 2, 1].map((r) => (
              <option key={r} value={r}>{r} Star{r > 1 && "s"}</option>
            ))}
          </select>
        </label>
        <label>
          Comment:
          <textarea
            className="w-full p-2 rounded bg-slate-800 text-white"
            value={feedback.comment}
            onChange={(e) => setFeedback({ ...feedback, comment: e.target.value })}
            placeholder="Your feedback..."
          />
        </label>
        <button className="bg-yellow-300 text-black px-4 py-2 rounded font-semibold hover:bg-yellow-400 transition" type="submit">
          Submit
        </button>
      </form>
      <h3 className="text-xl font-bold mb-2">My Feedback</h3>
      <ul>
        {myFeedbacks.map((fb) => (
          <li key={fb._id} className="mb-2 border-b border-slate-700 pb-2">
            <span className="font-semibold">Order:</span> {fb.order?._id?.slice(-6)}<br />
            <span className="font-semibold">Rating:</span> {fb.rating} Stars<br />
            <span className="font-semibold">Comment:</span> {fb.comment}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Feedback;
