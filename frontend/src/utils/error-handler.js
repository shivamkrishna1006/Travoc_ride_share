// Centralized error handler for API and runtime errors
class ErrorHandler {
  constructor() {
    this.handlers = []
    this.setupGlobalErrorHandling()
  }

  // Register error handler callback
  registerHandler(callback) {
    this.handlers.push(callback)
  }

  // Unregister error handler
  unregisterHandler(callback) {
    this.handlers = this.handlers.filter((h) => h !== callback)
  }

  // Notify all handlers about error
  notifyHandlers(error, context = {}) {
    this.handlers.forEach((handler) => {
      try {
        handler(error, context)
      } catch (err) {
        console.error('Error in error handler:', err)
      }
    })
  }

  // Handle API errors
  handleApiError(error) {
    const { response, message, config } = error

    const errorData = {
      type: 'API_ERROR',
      status: response?.status,
      message: response?.data?.message || message,
      url: config?.url,
      method: config?.method,
      data: response?.data,
      timestamp: new Date().toISOString(),
    }

    // Handle specific status codes
    switch (response?.status) {
      case 400:
        errorData.title = 'Bad Request'
        break
      case 401:
        errorData.title = 'Unauthorized'
        errorData.action = 'LOGOUT'
        break
      case 403:
        errorData.title = 'Forbidden'
        break
      case 404:
        errorData.title = 'Not Found'
        break
      case 429:
        errorData.title = 'Too Many Requests'
        errorData.action = 'RETRY'
        break
      case 500:
        errorData.title = 'Server Error'
        errorData.action = 'RETRY'
        break
      case 503:
        errorData.title = 'Service Unavailable'
        errorData.action = 'RETRY'
        break
      default:
        errorData.title = 'Network Error'
    }

    this.notifyHandlers(errorData)
    return errorData
  }

  // Handle validation errors
  handleValidationError(errors) {
    const errorData = {
      type: 'VALIDATION_ERROR',
      title: 'Validation Failed',
      errors,
      timestamp: new Date().toISOString(),
    }

    this.notifyHandlers(errorData)
    return errorData
  }

  // Handle generic runtime errors
  handleRuntimeError(error, context = {}) {
    const errorData = {
      type: 'RUNTIME_ERROR',
      title: 'Application Error',
      message: error.message || error.toString(),
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
    }

    this.notifyHandlers(errorData)
    return errorData
  }

  // Setup global error handling
  setupGlobalErrorHandling() {
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason)
      this.handleRuntimeError(
        new Error(event.reason?.message || 'Unhandled promise rejection'),
        { type: 'UNHANDLED_REJECTION' }
      )
    })

    // Handle global errors
    window.addEventListener('error', (event) => {
      console.error('Global error:', event.error)
      if (event.error) {
        this.handleRuntimeError(event.error, { type: 'GLOBAL_ERROR' })
      }
    })
  }

  // Get user-friendly error message
  getUserMessage(error) {
    if (typeof error === 'string') return error

    if (error.message) {
      // API error
      if (error.status === 401) return 'Please log in again'
      if (error.status === 403) return 'You do not have permission to perform this action'
      if (error.status === 404) return 'Resource not found'
      if (error.status >= 500) return 'Server error. Please try again later'

      return error.message
    }

    return 'An unexpected error occurred. Please try again.'
  }

  // Log error for debugging/monitoring
  logError(error) {
    const payload = {
      error: error.message || error,
      stack: error.stack,
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString(),
    }

    if (process.env.NODE_ENV === 'development') {
      console.error('Error logged:', payload)
    }

    // Send to monitoring service
    if (window.__reportError) {
      window.__reportError(payload)
    }
  }
}

// Export singleton instance
export const errorHandler = new ErrorHandler()

export default ErrorHandler
