# 🍽️ ServeEase – Canteen Queue Tracking System

**ServeEase** is a comprehensive web application developed using the **MERN stack** (MongoDB, Express.js, React.js, Node.js) that facilitates efficient queue and order management for institutional canteens. The platform is designed to provide seamless interaction between administrators and users, ensuring an organized food service process with real-time updates.

---

## 📌 Project Overview

The objective of this system is to eliminate long waiting times and manual queue handling by digitizing the canteen order and feedback system. The application consists of two primary interfaces:

- **Admin Dashboard** – for managing menu items, tracking orders, and reviewing feedback.
- **User Dashboard** – for placing orders, tracking queue positions, and submitting feedback.

---

## 🔧 Key Features

### 👨‍💼 Admin Dashboard

1. **Menu Management**
   - Add, remove, and update menu items.
   - Toggle availability status of each item.

2. **Order Management**
   - View real-time list of orders categorized as:
     - Orders in Queue
     - Completed Orders
     - Orders Awaiting Pickup
   - Update order statuses as they are processed.

3. **Feedback Review**
   - Access user feedback to monitor service quality and identify areas for improvement.

4. **Dashboard Overview**
   - Visual representations and metrics including:
     - Number of people currently in the queue
     - Most profitable items
     - Daily sales trend and hourly demand charts
     - Live order statistics
   - Sidebar navigation for streamlined access to all admin functionalities.

---

### 👥 User Dashboard

1. **Menu Access**
   - View available food items and their availability status.
   - Place new orders with ease.

2. **Order Tracking**
   - Monitor order status in real time.
   - View current queue position and estimated waiting time.

3. **Feedback Submission**
   - Provide comments and ratings post-order completion to improve service delivery.

4. **User Dashboard Overview**
   - Access order history.
   - Receive real-time updates and notifications when orders are ready for pickup.

---

## 🧱 Technology Stack

| Layer        | Technology           |
|--------------|----------------------|
| Frontend     | React.js, Tailwind CSS |
| Backend      | Node.js, Express.js, JWT |
| Database     | MongoDB (via Mongoose) |
| Real-time    | Socket.io            |
| Others       | dotenv, CORS         |
