const cors = require('cors');

/**
 * Service-level CORS configuration
 * Used by all microservices (User, Driver, Ride)
 * Prevents direct service calls from being blocked by browser
 */
const getServiceCorsOptions = () => {
  const environment = process.env.NODE_ENV || 'development';

  const devOrigins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:3000', // Gateway
    'http://127.0.0.1:3000'
  ];

  const prodOrigins = [
    process.env.FRONTEND_URL || 'https://yourdomain.com',
    process.env.APP_URL || 'https://app.yourdomain.com'
  ].filter(Boolean);

  const origins = environment === 'production' ? prodOrigins : devOrigins;

  return {
    origin: (origin, callback) => {
      // Allow requests with no origin (CLI, mobile apps, cURL)
      if (!origin) return callback(null, true);

      if (origins.includes(origin)) {
        callback(null, true);
      } else {
        callback(
          new Error(`CORS blocked: Origin '${origin}' not in allowed list`),
          false
        );
      }
    },
    credentials: true, // Enable credentials (cookies, authorization headers)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
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
      'Content-Length',
      'ETag',
      'Link'
    ],
    maxAge: 86400, // 24 hours - browser caches preflight
    optionsSuccessStatus: 200 // Some legacy browsers need 200 for success
  };
};

const setupCors = (app) => {
  const corsOptions = getServiceCorsOptions();

  // Apply CORS to all routes
  app.use(cors(corsOptions));

  // Explicit OPTIONS handler for preflight
  app.options('*', cors(corsOptions));
};

module.exports = { setupCors, getServiceCorsOptions };
