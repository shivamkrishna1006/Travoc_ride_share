import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  activeRide: null,
  rideHistory: [],
  status: null,
  estimatedFare: null,
  loading: false,
  error: null,
}

const rideSlice = createSlice({
  name: 'ride',
  initialState,
  reducers: {
    setActiveRide: (state, action) => {
      state.activeRide = action.payload
      state.status = action.payload?.status
    },
    updateRideStatus: (state, action) => {
      if (state.activeRide) {
        state.activeRide.status = action.payload
        state.status = action.payload
      }
    },
    setRideHistory: (state, action) => {
      state.rideHistory = action.payload
    },
    addRideToHistory: (state, action) => {
      state.rideHistory.unshift(action.payload)
    },
    setEstimatedFare: (state, action) => {
      state.estimatedFare = action.payload
    },
    clearActiveRide: (state) => {
      state.activeRide = null
      state.status = null
      state.estimatedFare = null
    },
    setRideLoading: (state, action) => {
      state.loading = action.payload
    },
    setRideError: (state, action) => {
      state.error = action.payload
    },
  },
})

export const {
  setActiveRide,
  updateRideStatus,
  setRideHistory,
  addRideToHistory,
  setEstimatedFare,
  clearActiveRide,
  setRideLoading,
  setRideError,
} = rideSlice.actions

export default rideSlice.reducer
