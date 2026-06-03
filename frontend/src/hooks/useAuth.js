import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setUser, setDriver, setToken, setRole, setAuthLoading, setAuthError, logout, clearAuthError } from '../store/slices/authSlice'
import { authService } from '../api/services/auth.service'

export function useAuth() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, driver, token, role, loading, error, isAuthenticated } = useSelector(state => state.auth)

  const riderSignup = async (data) => {
    dispatch(setAuthLoading(true))
    dispatch(clearAuthError())
    try {
      const response = await authService.signup(data)
      dispatch(setUser(response.data.user))
      dispatch(setToken(response.data.token))
      dispatch(setRole('rider'))
      navigate('/rider/dashboard')
      return response.data
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Signup failed'
      dispatch(setAuthError(errorMsg))
      throw err
    } finally {
      dispatch(setAuthLoading(false))
    }
  }

  const riderLogin = async (email, password) => {
    dispatch(setAuthLoading(true))
    dispatch(clearAuthError())
    try {
      const response = await authService.login(email, password)
      dispatch(setUser(response.data.user))
      dispatch(setToken(response.data.token))
      dispatch(setRole('rider'))
      navigate('/rider/dashboard')
      return response.data
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Login failed'
      dispatch(setAuthError(errorMsg))
      throw err
    } finally {
      dispatch(setAuthLoading(false))
    }
  }

  const driverSignup = async (data) => {
    dispatch(setAuthLoading(true))
    dispatch(clearAuthError())
    try {
      const response = await authService.driverSignup(data)
      dispatch(setDriver(response.data.driver))
      dispatch(setToken(response.data.token))
      dispatch(setRole('driver'))
      navigate('/driver/dashboard')
      return response.data
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Driver signup failed'
      dispatch(setAuthError(errorMsg))
      throw err
    } finally {
      dispatch(setAuthLoading(false))
    }
  }

  const driverLogin = async (email, password) => {
    dispatch(setAuthLoading(true))
    dispatch(clearAuthError())
    try {
      const response = await authService.driverLogin(email, password)
      dispatch(setDriver(response.data.driver))
      dispatch(setToken(response.data.token))
      dispatch(setRole('driver'))
      navigate('/driver/dashboard')
      return response.data
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Driver login failed'
      dispatch(setAuthError(errorMsg))
      throw err
    } finally {
      dispatch(setAuthLoading(false))
    }
  }

  const userLogout = async () => {
    try {
      if (role === 'driver') {
        await authService.driverLogout()
      } else {
        await authService.logout()
      }
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      dispatch(logout())
      navigate('/login')
    }
  }

  return {
    user,
    driver,
    token,
    role,
    loading,
    error,
    isAuthenticated,
    isRider: role === 'rider',
    isDriver: role === 'driver',
    riderSignup,
    riderLogin,
    driverSignup,
    driverLogin,
    logout: userLogout,
  }
}
