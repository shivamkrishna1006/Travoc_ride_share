const axios = require('axios');
const CircuitBreaker = require('./circuit-breaker');

class ServiceClient {
  constructor(baseUrl, serviceName, options = {}) {
    this.baseUrl = baseUrl;
    this.serviceName = serviceName;
    this.breaker = new CircuitBreaker(serviceName, {
      failureThreshold: options.failureThreshold || 5,
      successThreshold: options.successThreshold || 2,
      resetTimeout: options.resetTimeout || 60000
    });
    this.maxRetries = options.maxRetries || 3;
    this.retryDelay = options.retryDelay || 1000; // milliseconds
  }

  /**
   * Make a GET request with circuit breaker protection
   * @param {string} path - API endpoint path
   * @param {Object} options - Request options
   * @param {Function} fallback - Fallback function if request fails
   */
  async get(path, options = {}, fallback = null) {
    return this.breaker.execute(
      async () => {
        const response = await this.requestWithRetry('get', path, null, options);
        return response.data;
      },
      fallback
    );
  }

  /**
   * Make a POST request with circuit breaker protection
   * @param {string} path - API endpoint path
   * @param {Object} data - Request body
   * @param {Object} options - Request options
   * @param {Function} fallback - Fallback function if request fails
   */
  async post(path, data, options = {}, fallback = null) {
    return this.breaker.execute(
      async () => {
        const response = await this.requestWithRetry('post', path, data, options);
        return response.data;
      },
      fallback
    );
  }

  /**
   * Make a PUT request with circuit breaker protection
   * @param {string} path - API endpoint path
   * @param {Object} data - Request body
   * @param {Object} options - Request options
   * @param {Function} fallback - Fallback function if request fails
   */
  async put(path, data, options = {}, fallback = null) {
    return this.breaker.execute(
      async () => {
        const response = await this.requestWithRetry('put', path, data, options);
        return response.data;
      },
      fallback
    );
  }

  /**
   * Make a request with automatic retry logic
   */
  async requestWithRetry(method, path, data, options, attempt = 1) {
    try {
      const config = {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'X-Service-Authorization': process.env.SERVICE_TOKEN || '',
          ...options.headers
        }
      };

      const url = `${this.baseUrl}${path}`;

      let response;
      if (method === 'get') {
        response = await axios.get(url, config);
      } else if (method === 'post') {
        response = await axios.post(url, data, config);
      } else if (method === 'put') {
        response = await axios.put(url, data, config);
      }

      return response;
    } catch (error) {
      // Retry logic for transient failures
      if (attempt < this.maxRetries && this.isTransientError(error)) {
        const delay = this.retryDelay * Math.pow(2, attempt - 1); // Exponential backoff
        console.log(`⏳ [${this.serviceName}] Retry attempt ${attempt}/${this.maxRetries} after ${delay}ms`);
        
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.requestWithRetry(method, path, data, options, attempt + 1);
      }

      console.error(`❌ [${this.serviceName}] Request failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Check if error is transient (can be retried)
   */
  isTransientError(error) {
    if (!error.response) {
      // Network error, timeout
      return true;
    }

    const status = error.response.status;
    // Retry on 5xx errors and specific 4xx errors
    return status >= 500 || status === 408 || status === 429;
  }

  getCircuitBreakerState() {
    return this.breaker.getState();
  }
}

module.exports = ServiceClient;
