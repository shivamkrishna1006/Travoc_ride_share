import axiosInstance from '../axios-instance'

export const userService = {
  getProfile: (userId) =>
    axiosInstance.get(`/user/api/users/profile/${userId}`),

  updateProfile: (userId, data) =>
    axiosInstance.put(`/user/api/users/profile/${userId}`, data),

  updateHomeAddress: (userId, address) =>
    axiosInstance.put(`/user/api/users/home-address/${userId}`, address),

  updateWorkAddress: (userId, address) =>
    axiosInstance.put(`/user/api/users/work-address/${userId}`, address),

  addPaymentMethod: (userId, paymentMethod) =>
    axiosInstance.post(`/user/api/users/payment-method/${userId}`, paymentMethod),

  deletePaymentMethod: (userId, paymentMethodId) =>
    axiosInstance.delete(
      `/user/api/users/payment-method/${userId}/${paymentMethodId}`
    ),

  updatePreferences: (userId, preferences) =>
    axiosInstance.put(`/user/api/users/preferences/${userId}`, preferences),

  getAllUsers: () =>
    axiosInstance.get('/user/api/users/all-users'),

  deleteAccount: (userId) =>
    axiosInstance.delete(`/user/api/users/account/${userId}`),
}
