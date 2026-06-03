const express = require('express');
const app = express();
const userRoutes = require('./routes/user.routes');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const connectDB = require('./db/db');
const { errorHandler } = require('./utils/errorHandler');
const { setupCors } = require('../shared-middleware/cors.middleware');
const EventSubscriber = require('../shared-utils/event-bus/event-subscriber');
const { setupUserEventSubscribers } = require('./src/event-subscriber');

dotenv.config();
connectDB();

// Initialize Event Subscriber
(async () => {
  try {
    await EventSubscriber.connect();
    await setupUserEventSubscribers();
    console.log('✅ Event subscriber initialized for User Service');
  } catch (error) {
    console.error('❌ Error initializing event subscriber:', error.message);
    setTimeout(() => process.exit(1), 1000);
  }
})();

// ============================================
// CORS - SETUP FIRST
// ============================================
setupCors(app);

// ============================================
// MIDDLEWARE
// ============================================
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ============================================
// ROUTES
// ============================================

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'User service is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes
app.use('/api/users', userRoutes);

// ============================================
// ERROR HANDLERS
// ============================================

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Not Found',
    message: 'Route not found',
    path: req.path
  });
});

// Error handling middleware
app.use(errorHandler);

module.exports = app;