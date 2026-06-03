import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  currentLocation: null,
  pickupLocation: null,
  dropoffLocation: null,
  driverLocations: {},
}

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setCurrentLocation: (state, action) => {
      state.currentLocation = action.payload
    },
    setPickupLocation: (state, action) => {
      state.pickupLocation = action.payload
    },
    setDropoffLocation: (state, action) => {
      state.dropoffLocation = action.payload
    },
    updateDriverLocation: (state, action) => {
      const { driverId, ...location } = action.payload
      state.driverLocations[driverId] = location
    },
    clearLocations: (state) => {
      state.pickupLocation = null
      state.dropoffLocation = null
      state.driverLocations = {}
    },
  },
})

export const {
  setCurrentLocation,
  setPickupLocation,
  setDropoffLocation,
  updateDriverLocation,
  clearLocations,
} = locationSlice.actions

export default locationSlice.reducer
