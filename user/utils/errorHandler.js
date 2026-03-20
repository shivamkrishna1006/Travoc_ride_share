class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

module.exports.AppError = AppError;

module.exports.errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    console.error('Error:', {
        message,
        statusCode,
        stack: err.stack
    });

    res.status(statusCode).json({
        success: false,
        message,
        statusCode
    });
};

module.exports.asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
