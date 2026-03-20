require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 3003;

const server = app.listen(PORT, () => {
  console.log(`Ride Service listening on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, closing server...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});