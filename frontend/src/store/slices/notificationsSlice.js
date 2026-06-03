import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  messages: [],
  alerts: [],
}

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addMessage: (state, action) => {
      state.messages.push({
        id: Date.now(),
        timestamp: new Date().toISOString(),
        ...action.payload,
      })
    },
    removeMessage: (state, action) => {
      state.messages = state.messages.filter(m => m.id !== action.payload)
    },
    addAlert: (state, action) => {
      state.alerts.push({
        id: Date.now(),
        timestamp: new Date().toISOString(),
        ...action.payload,
      })
    },
    removeAlert: (state, action) => {
      state.alerts = state.alerts.filter(a => a.id !== action.payload)
    },
    clearAllNotifications: (state) => {
      state.messages = []
      state.alerts = []
    },
  },
})

export const {
  addMessage,
  removeMessage,
  addAlert,
  removeAlert,
  clearAllNotifications,
} = notificationsSlice.actions

export default notificationsSlice.reducer
