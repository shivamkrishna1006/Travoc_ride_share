import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  modals: {
    rideRequest: false,
    rideDetails: false,
    paymentMethod: false,
    rating: false,
    confirmation: false,
  },
  notifications: [],
  theme: localStorage.getItem('theme') || 'light',
  sidebarOpen: false,
  bottomSheetOpen: false,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    showModal: (state, action) => {
      state.modals[action.payload] = true
    },
    hideModal: (state, action) => {
      state.modals[action.payload] = false
    },
    hideAllModals: (state) => {
      Object.keys(state.modals).forEach(key => {
        state.modals[key] = false
      })
    },
    addNotification: (state, action) => {
      state.notifications.push({
        id: Date.now(),
        ...action.payload,
      })
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload)
    },
    setTheme: (state, action) => {
      state.theme = action.payload
      localStorage.setItem('theme', action.payload)
      document.documentElement.className = action.payload === 'dark' ? 'dark' : ''
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload
    },
    setBottomSheetOpen: (state, action) => {
      state.bottomSheetOpen = action.payload
    },
  },
})

export const {
  showModal,
  hideModal,
  hideAllModals,
  addNotification,
  removeNotification,
  setTheme,
  setSidebarOpen,
  setBottomSheetOpen,
} = uiSlice.actions

export default uiSlice.reducer
