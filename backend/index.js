require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const orderController = require('./controllers/orderController');

const app = express();
const router = express.Router();

app.use(cors());
app.use(express.json());

// Import routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/menu', require('./routes/menu'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/feedback', require('./routes/feedback'));

// (Other routes will be added here)

const PORT = process.env.PORT || 5000;

// MongoDB Connection
mongoose.connect("mongodb+srv://twitter_admin:4PijnWRxRX7kCMMM@cluster0.ooqtopn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
.then(() => {
  console.log('Connected to MongoDB successfully');
  const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

  // Socket.io setup will go here
  const { Server } = require('socket.io');
  const io = new Server(server, { cors: { origin: '*' } });
  app.set('io', io);
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});