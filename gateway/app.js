const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const { corsMiddleware, corsErrorHandler } = require('./middleware/cors.middleware');
const { createProxyWithCors } = require('./middleware/proxy-cors.middleware');

const app = express();

// ============================================
// SECURITY & MIDDLEWARE
// ============================================

// Security headers FIRST (before CORS)
app.use(helmet());

// CORS middleware - BEFORE everything except helmet
app.use(corsMiddleware);

// Request logging
app.use(morgan(':method :url :status :response-time ms'));

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request ID middleware for debugging and tracing
app.use((req, res, next) => {
  req.id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  res.setHeader('X-Request-ID', req.id);
  next();
});

// ============================================
// ROUTES
// ============================================

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'API Gateway is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime()
  });
});

// API Routes with CORS-aware proxying
app.use('/api/users', createProxyWithCors('http://localhost:3001', '/api/users'));
app.use('/api/captains', createProxyWithCors('http://localhost:3002', '/api/captains'));
app.use('/api/rides', createProxyWithCors('http://localhost:3003', '/api/rides'));

// Explicit OPTIONS handler for preflight requests
app.options('*', corsMiddleware);

// ============================================
// ERROR HANDLERS
// ============================================

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Not Found',
    message: 'The requested resource does not exist',
    path: req.path,
    method: req.method,
    requestId: req.id
  });
});

// CORS error handler
app.use(corsErrorHandler);

// Generic error handler
app.use((err, req, res, next) => {
  console.error(`[${req.id || 'unknown'}] Error:`, err);

  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(status).json({
    success: false,
    error: err.name || 'Error',
    message,
    requestId: req.id,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ============================================
// SERVER START
// ============================================

const PORT = process.env.GATEWAY_PORT || process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════╗
║  ✅ API Gateway Started Successfully                    ║
╠════════════════════════════════════════════════════════╣
║  Port:         ${PORT}                                      ║
║  Environment:  ${(process.env.NODE_ENV || 'development').padEnd(30)}║
║  CORS:         ✅ Enabled                                ║
║  Security:     ✅ Helmet.js active                       ║
╠════════════════════════════════════════════════════════╣
║  Services:                                              ║
║  • User Service:   http://localhost:3001                ║
║  • Driver Service: http://localhost:3002                ║
║  • Ride Service:   http://localhost:3003                ║
╚════════════════════════════════════════════════════════╝
  `);
});

module.exports = app;