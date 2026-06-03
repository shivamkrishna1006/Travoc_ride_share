const cors = require('cors');

/**
 * Gateway-level CORS configuration
 * Dynamically validates origins against allowlist
 * Prevents invalid origins from accessing backend services
 */
const getAllowedOrigins = () => {
  const environment = process.env.NODE_ENV || 'development';

  const devOrigins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:3000',
    'http://127.0.0.1:3000'
  ];

  const prodOrigins = [
    process.env.FRONTEND_URL || 'https://yourdomain.com',
    process.env.APP_URL || 'https://app.yourdomain.com'
  ].filter(Boolean);

  return environment === 'production' ? prodOrigins : devOrigins;
};

/**
 * Main CORS options for gateway
 */
const getCorsOptions = () => {
  const allowedOrigins = getAllowedOrigins();

  return {
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, cURL)
      if (!origin) {
        return callback(null, true);
      }

      // Check if origin is in allowed list
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(
          new Error(
            `CORS Error: Origin '${origin}' is not authorized to access this gateway`
          ),
          false
        );
      }
    },
    credentials: true, // Enable cookies, authorization headers
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'X-API-Key',
      'Accept',
      'Accept-Language',
      'Content-Language',
      'Last-Event-ID'
    ],
    exposedHeaders: [
      'X-Total-Count',
      'X-Page',
      'X-Page-Size',
      'X-Token',
      'X-Refresh-Token',
      'Authorization',
      'Content-Length',
      'ETag',
      'Link',
      'X-Request-ID'
    ],
    maxAge: 86400, // 24 hours - caches preflight OPTIONS
    optionsSuccessStatus: 200
  };
};

/**
 * CORS middleware with logging
 */
const corsMiddleware = cors(getCorsOptions());

/**
 * CORS error handler
 * Catches CORS policy violations and returns proper error response
 */
const corsErrorHandler = (err, req, res, next) => {
  if (err.message.includes('CORS Error') || err.message.includes('not authorized')) {
    console.warn(`[CORS BLOCKED] Origin: ${req.get('origin')} | Path: ${req.path}`);

    return res.status(403).json({
      success: false,
      error: 'Cross-Origin Request Policy Violation',
      message: 'Your origin is not authorized to access this resource',
      origin: req.get('origin') || 'none',
      requestedPath: req.path,
      timestamp: new Date().toISOString()
    });
  }

  // Pass other errors to next handler
  next(err);
};

module.exports = {
  corsMiddleware,
  corsErrorHandler,
  getCorsOptions,
  getAllowedOrigins
};
