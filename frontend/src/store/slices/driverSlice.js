import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  availableRides: [],
  activeRide: null,
  earnings: {
    today: 0,
    thisWeek: 0,
    thisMonth: 0,
    total: 0,
  },
  documents: [],
  isOnline: false,
  totalRides: 0,
  rating: 0,
  loading: false,
  error: null,
}

const driverSlice = createSlice({
  name: 'driver',
  initialState,
  reducers: {
    setAvailableRides: (state, action) => {
      state.availableRides = action.payload
    },
    addAvailableRide: (state, action) => {
      state.availableRides.push(action.payload)
    },
    removeAvailableRide: (state, action) => {
      state.availableRides = state.availableRides.filter(r => r._id !== action.payload)
    },
    setActiveRide: (state, action) => {
      state.activeRide = action.payload
    },
    clearActiveRide: (state) => {
      state.activeRide = null
    },
    setEarnings: (state, action) => {
      state.earnings = action.payload
    },
    addEarnings: (state, action) => {
      const { today, week, month, total } = action.payload
      if (today !== undefined) state.earnings.today += today
      if (week !== undefined) state.earnings.thisWeek += week
      if (month !== undefined) state.earnings.thisMonth += month
      if (total !== undefined) state.earnings.total += total
    },
    setDocuments: (state, action) => {
      state.documents = action.payload
    },
    setOnlineStatus: (state, action) => {
      state.isOnline = action.payload
    },
    setTotalRides: (state, action) => {
      state.totalRides = action.payload
    },
    setRating: (state, action) => {
      state.rating = action.payload
    },
    setDriverLoading: (state, action) => {
      state.loading = action.payload
    },
    setDriverError: (state, action) => {
      state.error = action.payload
    },
  },
})

export const {
  setAvailableRides,
  addAvailableRide,
  removeAvailableRide,
  setActiveRide,
  clearActiveRide,
  setEarnings,
  addEarnings,
  setDocuments,
  setOnlineStatus,
  setTotalRides,
  setRating,
  setDriverLoading,
  setDriverError,
} = driverSlice.actions

export default driverSlice.reducer
