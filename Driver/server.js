const http = require('http');
const app = require('./app');

const PORT = process.env.PORT || 3002;

const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`Captain Service running on http://localhost:${PORT}`);
    console.log('Environment:', process.env.NODE_ENV || 'development');
});

// Handle server errors
server.on('error', (error) => {
    console.error('Server error:', error);
    process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
});