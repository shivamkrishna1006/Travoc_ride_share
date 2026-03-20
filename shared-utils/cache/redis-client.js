const redis = require('redis');

const client = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  socket: {
    reconnectStrategy: (retries) => {
      if (retries > 10) return new Error('Max retries exceeded');
      return Math.min(retries * 50, 500);
    }
  }
});

client.on('error', (err) => {
  console.error('❌ Redis Error:', err.message);
});

client.on('connect', () => {
  console.log('✅ Redis client connected');
});

client.on('ready', () => {
  console.log('✅ Redis client ready');
});

client.on('reconnecting', () => {
  console.log('🔄 Redis client reconnecting...');
});

// Connect to Redis
(async () => {
  try {
    await client.connect();
  } catch (error) {
    console.error('Failed to connect Redis:', error.message);
  }
})();

module.exports = client;
