require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const connectDB = require('./db/db');
const { errorHandler } = require('./utils/errorHandler');
const rideRoutes = require('./routes/ride.routes');
const EventPublisher = require('../shared-utils/event-bus/event-publisher');
const EventSubscriber = require('../shared-utils/event-bus/event-subscriber');
const { setupRideEventSubscribers } = require('./src/event-subscriber');

const app = express();

// Connect to database
connectDB();

// Initialize Event Publisher and Subscriber
(async () => {
  try {
    await EventPublisher.connect();
    await EventSubscriber.connect();
    await setupRideEventSubscribers();
    console.log('✅ Event system initialized');
  } catch (error) {
    console.error('❌ Error initializing event system:', error.message);
    setTimeout(() => process.exit(1), 1000);
  }
})();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

// Health check
app.get('/health', (req, res) => {
  res.json({ message: 'Ride Service is running', status: 'OK', port: process.env.PORT || 3003 });
});

// Routes
app.use('/api/rides', rideRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware
app.use(errorHandler);

module.exports = app;