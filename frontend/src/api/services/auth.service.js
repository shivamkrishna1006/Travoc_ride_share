import axiosInstance from '../axios-instance'

export const authService = {
  signup: (data) =>
    axiosInstance.post('/user/api/users/register', data),

  login: (email, password) =>
    axiosInstance.post('/user/api/users/login', { email, password }),

  driverSignup: (data) =>
    axiosInstance.post('/driver/api/captains/register', data),

  driverLogin: (email, password) =>
    axiosInstance.post('/driver/api/captains/login', { email, password }),

  logout: () =>
    axiosInstance.post('/user/api/users/logout'),

  driverLogout: () =>
    axiosInstance.post('/driver/api/captains/logout'),

  getProfile: (userId) =>
    axiosInstance.get(`/user/api/users/profile/${userId}`),

  getDriverProfile: (driverId) =>
    axiosInstance.get(`/driver/api/captains/profile/${driverId}`),

  updateProfile: (userId, data) =>
    axiosInstance.put(`/user/api/users/profile/${userId}`, data),

  updateDriverProfile: (driverId, data) =>
    axiosInstance.put(`/driver/api/captains/profile/${driverId}`, data),

  changePassword: (userId, currentPassword, newPassword, role = 'user') => {
    const endpoint = role === 'driver'
      ? `/driver/api/captains/change-password/${userId}`
      : `/user/api/users/change-password/${userId}`
    return axiosInstance.put(endpoint, { currentPassword, newPassword })
  },
}
