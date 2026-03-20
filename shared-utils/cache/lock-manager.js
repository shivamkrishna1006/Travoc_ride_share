const redis = require('./redis-client');

class LockManager {
  /**
   * Acquire a distributed lock
   * @param {string} key - Lock key (e.g., 'ride:123456')
   * @param {string} value - Lock value (e.g., driverId, userId)
   * @param {number} ttlSeconds - Time to live (default: 30)
   * @returns {Promise<boolean>} True if lock acquired, false otherwise
   */
  async acquireLock(key, value, ttlSeconds = 30) {
    try {
      const lockKey = `lock:${key}`;
      const result = await redis.set(lockKey, value, {
        NX: true, // Only set if key doesn't exist
        EX: ttlSeconds // Expiration time in seconds
      });

      if (result === 'OK') {
        console.log(`🔒 Lock acquired: ${lockKey} (TTL: ${ttlSeconds}s)`);
        return true;
      } else {
        console.log(`⚠️  Lock already exists: ${lockKey}`);
        return false;
      }
    } catch (error) {
      console.error(`❌ Error acquiring lock: ${error.message}`);
      return false;
    }
  }

  /**
   * Release a distributed lock
   * @param {string} key - Lock key
   * @param {string} value - Lock value (must match to release)
   * @returns {Promise<boolean>} True if lock released, false otherwise
   */
  async releaseLock(key, value) {
    try {
      const lockKey = `lock:${key}`;
      const current = await redis.get(lockKey);

      if (current === value) {
        await redis.del(lockKey);
        console.log(`🔓 Lock released: ${lockKey}`);
        return true;
      } else {
        console.log(`⚠️  Lock value mismatch for: ${lockKey}`);
        return false;
      }
    } catch (error) {
      console.error(`❌ Error releasing lock: ${error.message}`);
      return false;
    }
  }

  /**
   * Extend a lock's expiration time
   * @param {string} key - Lock key
   * @param {string} value - Lock value (must match)
   * @param {number} ttlSeconds - New TTL
   * @returns {Promise<boolean>} True if extended, false otherwise
   */
  async extendLock(key, value, ttlSeconds = 30) {
    try {
      const lockKey = `lock:${key}`;
      const current = await redis.get(lockKey);

      if (current === value) {
        await redis.expire(lockKey, ttlSeconds);
        console.log(`⏱️  Lock extended: ${lockKey} (new TTL: ${ttlSeconds}s)`);
        return true;
      } else {
        console.log(`⚠️  Cannot extend lock - value mismatch: ${lockKey}`);
        return false;
      }
    } catch (error) {
      console.error(`❌ Error extending lock: ${error.message}`);
      return false;
    }
  }

  /**
   * Check if a lock exists
   * @param {string} key - Lock key
   * @returns {Promise<string|null>} Lock value if exists, null otherwise
   */
  async getLockValue(key) {
    try {
      const lockKey = `lock:${key}`;
      const value = await redis.get(lockKey);
      return value;
    } catch (error) {
      console.error(`❌ Error getting lock value: ${error.message}`);
      return null;
    }
  }
}

module.exports = new LockManager();
