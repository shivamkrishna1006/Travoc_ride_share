class CircuitBreaker {
  constructor(name, options = {}) {
    this.name = name;
    this.state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
    this.failureCount = 0;
    this.successCount = 0;
    this.lastFailureTime = null;
    this.failureThreshold = options.failureThreshold || 5;
    this.successThreshold = options.successThreshold || 2;
    this.resetTimeout = options.resetTimeout || 60000; // 60 seconds
  }

  /**
   * Execute a function with circuit breaker protection
   * @param {Function} fn - Function to execute
   * @param {Function} fallback - Fallback function if circuit is open
   * @returns {Promise<any>}
   */
  async execute(fn, fallback = null) {
    if (this.state === 'OPEN') {
      // Check if we should attempt to recover
      if (Date.now() - this.lastFailureTime > this.resetTimeout) {
        this.state = 'HALF_OPEN';
        this.successCount = 0;
        console.log(`🔄 [${this.name}] Circuit breaker HALF_OPEN (attempting recovery)`);
      } else {
        // Circuit is open, use fallback if available
        if (fallback) {
          console.log(`⚠️  [${this.name}] Circuit breaker OPEN, using fallback`);
          return fallback();
        }
        throw new Error(`${this.name} circuit breaker is OPEN`);
      }
    }

    try {
      // Execute the function with timeout
      const result = await Promise.race([
        fn(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Request timeout')), 5000)
        )
      ]);

      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();

      // If open and fallback available, use it
      if (this.state === 'OPEN' && fallback) {
        console.log(`⚠️  [${this.name}] Using fallback after failure`);
        return fallback();
      }

      throw error;
    }
  }

  onSuccess() {
    this.failureCount = 0;

    if (this.state === 'HALF_OPEN') {
      this.successCount++;
      if (this.successCount >= this.successThreshold) {
        this.state = 'CLOSED';
        this.successCount = 0;
        console.log(`✅ [${this.name}] Circuit breaker CLOSED (recovered)`);
      }
    } else {
      this.state = 'CLOSED';
    }
  }

  onFailure() {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    this.successCount = 0;

    if (this.failureCount >= this.failureThreshold) {
      this.state = 'OPEN';
      console.warn(`🔴 [${this.name}] Circuit breaker OPEN (${this.failureCount}/${this.failureThreshold} failures)`);
    }
  }

  getState() {
    return {
      name: this.name,
      state: this.state,
      failureCount: this.failureCount,
      successCount: this.successCount
    };
  }

  reset() {
    this.state = 'CLOSED';
    this.failureCount = 0;
    this.successCount = 0;
    this.lastFailureTime = null;
    console.log(`🔄 [${this.name}] Circuit breaker reset manually`);
  }
}

module.exports = CircuitBreaker;
