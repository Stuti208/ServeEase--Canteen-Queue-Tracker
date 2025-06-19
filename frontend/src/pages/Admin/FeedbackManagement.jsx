import React, { useEffect, useState } from "react";
import axios from "axios";

const FEEDBACK_API = "http://localhost:5000/api/feedback";

const FeedbackManagement = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(FEEDBACK_API, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFeedbacks(res.data);
      } catch {}
      setLoading(false);
    };
    fetchFeedbacks();
  }, []);

  return (
    <div className="p-6 w-full min-h-screen bg-slate-900 rounded-2xl text-white">
      <h2 className="text-2xl font-bold mb-4">All Feedback</h2>
      {loading ? (
        <div>Loading feedback...</div>
      ) : (
        <ul>
          {feedbacks.map((fb) => (
            <li key={fb._id} className="mb-2 border-b border-slate-700 pb-2">
              <span className="font-semibold">User:</span> {fb.user?.name}<br />
              <span className="font-semibold">Order:</span> {fb.order?._id?.slice(-6)}<br />
              <span className="font-semibold">Rating:</span> {fb.rating} Stars<br />
              <span className="font-semibold">Comment:</span> {fb.comment}
            </li>
          ))}
          {feedbacks.length === 0 && <li className="text-gray-400">No feedback found.</li>}
        </ul>
      )}
    </div>
  );
};

export default FeedbackManagement;