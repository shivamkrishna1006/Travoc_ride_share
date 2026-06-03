import axiosInstance from '../axios-instance'

export const driverService = {
  acceptRide: (rideId) =>
    axiosInstance.put(`/rides/api/rides/${rideId}/accept`),

  rejectRide: (rideId, reason = '') =>
    axiosInstance.put(`/rides/api/rides/${rideId}/reject`, { reason }),

  getActiveRides: (driverId) =>
    axiosInstance.get(`/rides/api/rides/active/driver/${driverId}`),

  updateLocation: (driverId, latitude, longitude) =>
    axiosInstance.put(`/driver/api/captains/${driverId}/location`, {
      latitude,
      longitude,
    }),

  startRide: (rideId) =>
    axiosInstance.put(`/rides/api/rides/${rideId}/status`, {
      status: 'ongoing',
    }),

  completeRide: (rideId, data = {}) =>
    axiosInstance.put(`/rides/api/rides/${rideId}/status`, {
      status: 'completed',
      ...data,
    }),

  getRideHistory: (driverId, page = 1, limit = 10) =>
    axiosInstance.get(`/rides/api/rides/history/driver/${driverId}`, {
      params: { page, limit },
    }),

  ratePassenger: (rideId, rating, review) =>
    axiosInstance.put(`/rides/api/rides/${rideId}/rate-passenger`, {
      rating,
      review,
    }),

  getEarnings: (driverId) =>
    axiosInstance.get(`/driver/api/captains/${driverId}/earnings`),

  toggleOnline: (driverId, isOnline) =>
    axiosInstance.put(`/driver/api/captains/${driverId}/online`, { isOnline }),

  updateVehicleInfo: (driverId, vehicleInfo) =>
    axiosInstance.put(`/driver/api/captains/${driverId}/vehicle`, vehicleInfo),

  uploadDocument: (driverId, formData) =>
    axiosInstance.post(`/driver/api/captains/${driverId}/documents`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
}
