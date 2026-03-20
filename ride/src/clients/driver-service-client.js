const ServiceClient = require('../../../shared-utils/http/service-client');
const redis = require('../../../shared-utils/cache/redis-client');

class DriverServiceClient {
  constructor() {
    this.baseUrl = process.env.DRIVER_SERVICE_URL || 'http://localhost:3002';
    this.client = new ServiceClient(this.baseUrl, 'DriverService', {
      failureThreshold: 5,
      resetTimeout: 60000
    });
  }

  /**
   * Get available drivers within a radius
   * Uses Redis cache (TTL: 30 seconds)
   */
  async getAvailableDrivers(latitude, longitude, radius = 5000) {
    const cacheKey = `available_drivers:${Math.round(latitude * 100)}_${Math.round(longitude * 100)}`;
    
    try {
      // Try cache first
      const cached = await redis.get(cacheKey);
      if (cached) {
        console.log(`📦 [DriverService] Using cached available drivers`);
        return JSON.parse(cached);
      }

      // Call driver service API
      const drivers = await this.client.get(
        `/api/captains/available`,
        { params: { latitude, longitude, radius } },
        async () => {
          console.warn(`⚠️  [DriverService] Fallback: returning empty driver list`);
          return [];
        }
      );

      // Cache for 30 seconds
      await redis.setEx(cacheKey, 30, JSON.stringify(drivers));
      
      return drivers;
    } catch (error) {
      console.error(`❌ [DriverService] Error getting available drivers:`, error.message);
      return [];
    }
  }

  /**
   * Get driver profile information
   * Uses Redis cache (TTL: 5 minutes)
   */
  async getDriverProfile(driverId) {
    const cacheKey = `driver:profile:${driverId}`;
    
    try {
      // Try cache first
      const cached = await redis.get(cacheKey);
      if (cached) {
        console.log(`📦 [DriverService] Using cached driver profile for ${driverId}`);
        return JSON.parse(cached);
      }

      // Call driver service API
      const profile = await this.client.get(
        `/api/captains/profile/${driverId}`,
        {},
        async () => {
          console.warn(`⚠️  [DriverService] Fallback: driver profile unavailable`);
          return null;
        }
      );

      // Cache for 5 minutes
      if (profile) {
        await redis.setEx(cacheKey, 300, JSON.stringify(profile));
      }
      
      return profile;
    } catch (error) {
      console.error(`❌ [DriverService] Error getting driver profile:`, error.message);
      return null;
    }
  }

  /**
   * Assign a ride to a driver
   */
  async assignRideToDriver(driverId, rideData) {
    try {
      const result = await this.client.post(
        `/api/captains/${driverId}/assign-ride`,
        rideData
      );
      console.log(`✅ [DriverService] Ride assigned to driver ${driverId}`);
      return result;
    } catch (error) {
      console.error(`❌ [DriverService] Error assigning ride:`, error.message);
      throw error;
    }
  }

  /**
   * Update driver status
   */
  async updateDriverStatus(driverId, status) {
    try {
      const result = await this.client.put(
        `/api/captains/${driverId}/status`,
        { status }
      );
      console.log(`✅ [DriverService] Driver ${driverId} status updated to ${status}`);
      return result;
    } catch (error) {
      console.error(`❌ [DriverService] Error updating status:`, error.message);
      throw error;
    }
  }

  /**
   * Get active rides for a driver
   */
  async getActiveRides(driverId) {
    try {
      const rides = await this.client.get(
        `/api/captains/${driverId}/active-rides`,
        {},
        async () => {
          console.warn(`⚠️  [DriverService] Fallback: returning empty active rides`);
          return [];
        }
      );
      return rides;
    } catch (error) {
      console.error(`❌ [DriverService] Error getting active rides:`, error.message);
      return [];
    }
  }

  /**
   * Get circuit breaker state
   */
  getCircuitBreakerState() {
    return this.client.getCircuitBreakerState();
  }
}

module.exports = new DriverServiceClient();
