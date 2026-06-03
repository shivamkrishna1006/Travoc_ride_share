import axiosInstance from '../axios-instance'

export const rideService = {
  calculateFare: (pickup, dropoff, rideType = 'economy') =>
    axiosInstance.post('/rides/api/rides/calculate-fare', {
      pickup,
      dropoff,
      rideType,
    }),

  requestRide: (data) =>
    axiosInstance.post('/rides/api/rides/request', data),

  getRideStatus: (rideId) =>
    axiosInstance.get(`/rides/api/rides/${rideId}`),

  updateRideLocation: (rideId, location) =>
    axiosInstance.put(`/rides/api/rides/${rideId}/location`, { location }),

  cancelRide: (rideId, reason) =>
    axiosInstance.put(`/rides/api/rides/${rideId}/cancel`, { reason }),

  getRideHistory: (userId, page = 1, limit = 10) =>
    axiosInstance.get(`/rides/api/rides/history/user/${userId}`, {
      params: { page, limit },
    }),

  getAvailableDrivers: (latitude, longitude, radius = 5) =>
    axiosInstance.get('/rides/api/rides/available-drivers', {
      params: { latitude, longitude, radius },
    }),

  rateRide: (rideId, rating, review) =>
    axiosInstance.put(`/rides/api/rides/${rideId}/rate`, {
      rating,
      review,
    }),

  completeRide: (rideId, data = {}) =>
    axiosInstance.put(`/rides/api/rides/${rideId}/status`, {
      status: 'completed',
      ...data,
    }),
}
