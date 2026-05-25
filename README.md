# ServeEase – Canteen Queue Tracker

A full-stack web application that eliminates canteen queues by letting students order from their phone and track their food status live — no refreshing, no waiting in line.

> Built with the MERN stack + Socket.io for real-time updates.

---


## The Problem It Solves

College canteen queues are chaotic. Students stand in line with no idea how long the wait is or when their food will be ready. ServeEase digitizes the entire process — students order from their seat, track their food live, and come to the counter only when it's ready.

---

## Key Technical Decisions

**Socket.io over polling**
Instead of the frontend repeatedly asking the server "is my order ready?", Socket.io keeps a persistent connection open. When the admin marks an item ready, the server pushes the update instantly to that specific student. I used a room-based system — each order gets its own private room (`order:<orderId>`) so updates go only to the relevant student, not everyone.

**JWT over sessions**
The server stores no session data. After login, the backend signs a token containing the user's id, name, and role. The frontend stores it in localStorage and sends it with every request. A `protect` middleware on the backend verifies the token on every protected route. The frontend decodes the token payload directly using `atob()` to read user details without an extra API call.

**React Context over Redux**
The only globally shared state is the notification system and socket connection. Redux would have added unnecessary complexity — store, actions, reducers — for something a single Context file handles cleanly.

**MongoDB over SQL**
Orders contain nested items with individual statuses. MongoDB's flexible document structure fits this naturally without complex joins.

---

## Features

**Student Side**
- Place orders from a menu with category filters and search
- Get a queue number and estimated wait time immediately after ordering
- Track order status live — Placed → Cooking → Ready — without refreshing
- Receive in-app notifications when food is ready for pickup
- View order history and submit feedback with star ratings

**Admin Side**
- Manage menu items — add, edit, toggle availability
- Update cooking status of individual items per order
- Auto-reassignment — if a student doesn't collect their food within 10 minutes, the item is reassigned to the next relevant order
- Analytics dashboard — daily sales trends, hourly demand, top items, live order stats

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js, Tailwind CSS, Recharts |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT |
| Real-time | Socket.io |
| File Storage | Cloudinary |

---

## Architecture Overview

```
Client (React)
    │
    ├── HTTP requests → Express REST APIs → MongoDB
    │
    └── Socket.io connection → Express Server → Socket.io rooms
                                                    │
                                            order:<orderId> rooms
                                            (one per active order)
```

---

## How Real-Time Works

```
Student places order
    → Frontend joins socket room "order:<orderId>"
    → Admin marks item as Ready
    → Backend emits 'order:updated' to that room only
    → NotificationContext on frontend catches the event
    → React state updates → UI re-renders live
    → Bell icon shows notification badge
```

---

## How to Run Locally

**Prerequisites:** Node.js, MongoDB

```bash
# Clone the repo
git clone https://github.com/Stuti208/ServeEase.git
cd ServeEase

# Install backend dependencies
cd server
npm install

# Add environment variables
# Create .env file with:
# MONGO_URI=your_mongodb_uri
# JWT_SECRET=your_secret_key
# CLOUDINARY_CLOUD_NAME=your_cloudinary_name
# CLOUDINARY_API_KEY=your_key
# CLOUDINARY_API_SECRET=your_secret

# Run backend
npm run dev

# Install frontend dependencies
cd ../client
npm install

# Run frontend
npm run dev
```

---

## Project Structure

```
ServeEase/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── context/          # NotificationContext, AuthContext
│   │   ├── pages/
│   │   │   ├── student/      # Dashboard, Menu, Orders, Feedback
│   │   │   └── admin/        # Dashboard, Orders, Menu Management
│   │   └── utils/            # auth helpers, token decode
├── server/
│   ├── controllers/
│   ├── middleware/            # protect, optionalAuth, role
│   ├── models/                # User, Order, MenuItem
│   ├── routes/
│   └── index.js              # Express + Socket.io setup
```

---

## Author

**Stuti Jain**
[LinkedIn](https://www.linkedin.com/in/stuti-jain-754b20244/) · [GitHub](https://github.com/Stuti208)
