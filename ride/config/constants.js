// Application constants

const RIDE_STATUS = {
  REQUESTED: 'requested',
  ACCEPTED: 'accepted',
  ONGOING: 'ongoing',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

const RIDE_TYPES = {
  ECONOMY: 'economy',
  PREMIUM: 'premium',
  XL: 'xl',
};

const CANCELLATION_REASONS = {
  USER_REQUESTED: 'User requested cancellation',
  DRIVER_UNAVAILABLE: 'Driver unavailable',
  TRAFFIC: 'Traffic issues',
  VEHICLE_ISSUE: 'Vehicle issue',
  PERSONAL_REASON: 'Personal reason',
  OTHER: 'Other reason',
};

const PAYMENT_METHODS = {
  CASH: 'cash',
  CARD: 'card',
  WALLET: 'wallet',
  UPI: 'upi',
};

const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
};

const TOKEN_EXPIRY = '7d';
const SALT_ROUNDS = 10;

const VALIDATION = {
  MIN_PASSWORD_LENGTH: 6,
  MAX_SPECIAL_REQUESTS_LENGTH: 500,
  MIN_RATING: 1,
  MAX_RATING: 5,
};

module.exports = {
  RIDE_STATUS,
  RIDE_TYPES,
  CANCELLATION_REASONS,
  PAYMENT_METHODS,
  PAYMENT_STATUS,
  TOKEN_EXPIRY,
  SALT_ROUNDS,
  VALIDATION,
};
