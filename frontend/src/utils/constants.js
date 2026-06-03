// API Configuration
export const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:3000'
export const API_TIMEOUT = 10000 // 10 seconds

// Socket Configuration
export const SOCKET_URL = process.env.VITE_SOCKET_URL || 'http://localhost:3000'
export const SOCKET_RECONNECT_DELAY = 1000
export const SOCKET_RECONNECT_MAX_DELAY = 5000
export const SOCKET_RECONNECT_ATTEMPTS = 5

// Mapbox Configuration
export const MAPBOX_TOKEN = process.env.VITE_MAPBOX_TOKEN
export const MAPBOX_STYLE = 'mapbox://styles/mapbox/streets-v12'
export const MAP_DEFAULT_CENTER = [-73.9, 40.7] // NYC
export const MAP_DEFAULT_ZOOM = 12

// Ride Types
export const RIDE_TYPES = {
  ECONOMY: 'economy',
  PREMIUM: 'premium',
  XL: 'xl',
}

export const RIDE_TYPE_LABELS = {
  economy: 'Economy',
  premium: 'Premium',
  xl: 'XL',
}

// Ride Status
export const RIDE_STATUS = {
  REQUESTED: 'requested',
  ACCEPTED: 'accepted',
  ARRIVING: 'arriving',
  STARTED: 'started',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
}

// User Roles
export const ROLES = {
  RIDER: 'rider',
  DRIVER: 'driver',
  ADMIN: 'admin',
}

// Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'ride_app_token',
  USER: 'ride_app_user',
  DRIVER: 'ride_app_driver',
  PREFERENCES: 'ride_app_preferences',
}

// Validation Rules
export const VALIDATION_RULES = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
  PASSWORD_MIN_LENGTH: 8,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  LOCATION_MIN_LENGTH: 2,
}

// Error Messages
export const ERROR_MESSAGES = {
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PHONE: 'Please enter a valid phone number',
  WEAK_PASSWORD: 'Password must be at least 8 characters with uppercase, number, and special character',
  INVALID_NAME: 'Name must be between 2 and 50 characters',
  INVALID_LOCATION: 'Please enter a valid location',
  NETWORK_ERROR: 'Network error. Please check your connection',
  SERVER_ERROR: 'Server error. Please try again later',
  UNAUTHORIZED: 'Please log in to continue',
  FORBIDDEN: 'You do not have permission to perform this action',
  NOT_FOUND: 'Resource not found',
  UNKNOWN_ERROR: 'An unexpected error occurred',
}

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN: 'Logged in successfully',
  SIGNUP: 'Account created successfully',
  LOGOUT: 'Logged out successfully',
  PROFILE_UPDATED: 'Profile updated successfully',
  RIDE_REQUESTED: 'Ride requested successfully',
  RIDE_CANCELLED: 'Ride cancelled',
  RIDE_COMPLETED: 'Ride completed',
}

// Time Constants (in milliseconds)
export const TIME = {
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
  LOCATION_UPDATE_INTERVAL: 5000, // 5 seconds
  HEARTBEAT_INTERVAL: 30000, // 30 seconds
  NOTIFICATION_TIMEOUT: 3000, // 3 seconds
}

// Distance Constants
export const DISTANCE = {
  NEARBY_RADIUS_KM: 10,
  SEARCH_RADIUS_KM: 50,
}

// Price Constants
export const PRICE = {
  BASE_FARE: 2.5,
  PER_KM: 1.5,
  PER_MINUTE: 0.3,
  SURGE_MULTIPLIER_HIGH: 1.5,
  SURGE_MULTIPLIER_PEAK: 2.0,
}

// Feature Flags
export const FEATURES = {
  RIDE_SCHEDULING: false,
  SPLIT_FARE: false,
  SHARED_RIDES: false,
  IN_APP_CHAT: false,
  EMERGENCY_SOS: true,
  RIDE_INSURANCE: false,
}

// App Limits
export const LIMITS = {
  MAX_PASSENGER_RATING: 5,
  MAX_DRIVER_RATING: 5,
  MIN_DRIVER_RATING: 4.6,
  MAX_RIDE_HISTORY_PER_PAGE: 20,
  MAX_FILE_UPLOAD_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_RETRIES: 3,
}

// Environment
export const ENV = {
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
}
