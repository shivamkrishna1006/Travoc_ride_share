import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: null,
  driver: null,
  token: localStorage.getItem('token') || null,
  role: localStorage.getItem('role') || null,
  loading: false,
  error: null,
  isAuthenticated: !!localStorage.getItem('token'),
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload
      state.role = 'rider'
      state.isAuthenticated = true
    },
    setDriver: (state, action) => {
      state.driver = action.payload
      state.role = 'driver'
      state.isAuthenticated = true
    },
    setToken: (state, action) => {
      state.token = action.payload
      localStorage.setItem('token', action.payload)
    },
    setRole: (state, action) => {
      state.role = action.payload
      localStorage.setItem('role', action.payload)
    },
    setAuthLoading: (state, action) => {
      state.loading = action.payload
    },
    setAuthError: (state, action) => {
      state.error = action.payload
    },
    logout: (state) => {
      state.user = null
      state.driver = null
      state.token = null
      state.role = null
      state.isAuthenticated = false
      state.error = null
      localStorage.removeItem('token')
      localStorage.removeItem('role')
    },
    clearAuthError: (state) => {
      state.error = null
    },
  },
})

export const {
  setUser,
  setDriver,
  setToken,
  setRole,
  setAuthLoading,
  setAuthError,
  logout,
  clearAuthError,
} = authSlice.actions

export default authSlice.reducer
