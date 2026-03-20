// Error handling utilities

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Async handler wrapper to catch errors
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Internal Server Error';

  // Handle duplicate key error
  if (err.code === 11000) {
    const message = `Duplicate field value entered`;
    err = new AppError(message, 400);
  }

  // Handle JWT error
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid JSON Web Token';
    err = new AppError(message, 401);
  }

  // Handle JWT expire error
  if (err.name === 'TokenExpiredError') {
    const message = 'JSON Web Token has expired';
    err = new AppError(message, 401);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};

module.exports = {
  AppError,
  asyncHandler,
  errorHandler,
};
