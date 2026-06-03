import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import rideReducer from './slices/rideSlice'
import locationReducer from './slices/locationSlice'
import uiReducer from './slices/uiSlice'
import notificationsReducer from './slices/notificationsSlice'
import driverReducer from './slices/driverSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ride: rideReducer,
    location: locationReducer,
    ui: uiReducer,
    notifications: notificationsReducer,
    driver: driverReducer,
  },
})

export default store
