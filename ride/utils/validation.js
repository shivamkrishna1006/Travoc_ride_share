// Validation functions for ride data

const validateRideRequest = (data) => {
  const errors = [];

  if (!data.pickupLocation || !data.pickupLocation.address) {
    errors.push('Pickup location address is required');
  }

  if (!data.pickupLocation || !data.pickupLocation.coordinates) {
    errors.push('Pickup location coordinates are required');
  }

  if (!data.dropoffLocation || !data.dropoffLocation.address) {
    errors.push('Dropoff location address is required');
  }

  if (!data.dropoffLocation || !data.dropoffLocation.coordinates) {
    errors.push('Dropoff location coordinates are required');
  }

  if (data.numberOfPassengers && (data.numberOfPassengers < 1 || data.numberOfPassengers > 6)) {
    errors.push('Number of passengers must be between 1 and 6');
  }

  if (data.rideType && !['economy', 'premium', 'xl'].includes(data.rideType)) {
    errors.push('Invalid ride type');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

const validateLocationUpdate = (data) => {
  const errors = [];

  if (!data.latitude || typeof data.latitude !== 'number') {
    errors.push('Valid latitude is required');
  }

  if (!data.longitude || typeof data.longitude !== 'number') {
    errors.push('Valid longitude is required');
  }

  if (!data.userType || !['rider', 'driver'].includes(data.userType)) {
    errors.push('User type must be either rider or driver');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

const validateCancellation = (data) => {
  const errors = [];

  if (!data.cancelledBy || !['rider', 'driver'].includes(data.cancelledBy)) {
    errors.push('Cancellation must be by rider or driver');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

module.exports = {
  validateRideRequest,
  validateLocationUpdate,
  validateCancellation,
};
