const ServiceClient = require('../../../shared-utils/http/service-client');
const redis = require('../../../shared-utils/cache/redis-client');

class UserServiceClient {
  constructor() {
    this.baseUrl = process.env.USER_SERVICE_URL || 'http://localhost:3001';
    this.client = new ServiceClient(this.baseUrl, 'UserService', {
      failureThreshold: 5,
      resetTimeout: 60000
    });
  }

  /**
   * Validate if user exists and is active
   * Uses Redis cache (TTL: 10 minutes)
   */
  async validateUser(userId) {
    const cacheKey = `user:exists:${userId}`;
    
    try {
      // Try cache first
      const cached = await redis.get(cacheKey);
      if (cached) {
        console.log(`📦 [UserService] Using cached user validation for ${userId}`);
        return JSON.parse(cached);
      }

      // Call user service API
      const result = await this.client.get(
        `/api/users/validate/${userId}`,
        {},
        async () => {
          console.warn(`⚠️  [UserService] Fallback: cannot validate user, assuming inactive`);
          return { exists: false };
        }
      );

      // Cache for 10 minutes
      await redis.setEx(cacheKey, 600, JSON.stringify(result));
      
      return result;
    } catch (error) {
      console.error(`❌ [UserService] Error validating user:`, error.message);
      return { exists: false };
    }
  }

  /**
   * Get user profile information
   * Uses Redis cache (TTL: 5 minutes)
   */
  async getUserProfile(userId) {
    const cacheKey = `user:profile:${userId}`;
    
    try {
      // Try cache first
      const cached = await redis.get(cacheKey);
      if (cached) {
        console.log(`📦 [UserService] Using cached user profile for ${userId}`);
        return JSON.parse(cached);
      }

      // Call user service API
      const profile = await this.client.get(
        `/api/users/${userId}/profile`,
        {},
        async () => {
          console.warn(`⚠️  [UserService] Fallback: user profile unavailable`);
          return null;
        }
      );

      // Cache for 5 minutes
      if (profile) {
        await redis.setEx(cacheKey, 300, JSON.stringify(profile));
      }
      
      return profile;
    } catch (error) {
      console.error(`❌ [UserService] Error getting user profile:`, error.message);
      return null;
    }
  }

  /**
   * Add ride to user's ride history
   */
  async addRideToHistory(userId, rideData) {
    try {
      const result = await this.client.post(
        `/api/users/${userId}/ride-history`,
        rideData
      );
      console.log(`✅ [UserService] Ride added to user ${userId} history`);
      
      // Invalidate cache
      await redis.del(`user:profile:${userId}`);
      
      return result;
    } catch (error) {
      console.error(`❌ [UserService] Error adding ride to history:`, error.message);
      throw error;
    }
  }

  /**
   * Process refund (add credit to user account)
   */
  async processRefund(userId, amount, reason) {
    try {
      const result = await this.client.post(
        `/api/users/${userId}/credit`,
        { amount, reason }
      );
      console.log(`✅ [UserService] Refund processed for user ${userId}: ${amount}`);
      
      // Invalidate cache
      await redis.del(`user:profile:${userId}`);
      
      return result;
    } catch (error) {
      console.error(`❌ [UserService] Error processing refund:`, error.message);
      throw error;
    }
  }

  /**
   * Get circuit breaker state
   */
  getCircuitBreakerState() {
    return this.client.getCircuitBreakerState();
  }
}

module.exports = new UserServiceClient();
