import { useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { driverService } from '../api/services/driver.service'
import { setActiveRide, clearActiveRide } from '../store/slices/rideSlice'

export function useDriver() {
  const dispatch = useDispatch()
  const driver = useSelector((state) => state.auth.driver)
  const activeRide = useSelector((state) => state.ride.activeRide)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [onlineStatus, setOnlineStatus] = useState(false)

  const acceptRide = useCallback(
    async (rideId) => {
      setLoading(true)
      setError(null)
      try {
        const response = await driverService.acceptRide(rideId)
        dispatch(setActiveRide(response.data))
        return response.data
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to accept ride')
        throw err
      } finally {
        setLoading(false)
      }
    },
    [dispatch]
  )

  const rejectRide = useCallback(
    async (rideId, reason = 'Driver rejected') => {
      setLoading(true)
      setError(null)
      try {
        await driverService.rejectRide(rideId, reason)
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to reject ride')
        throw err
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const startRide = useCallback(
    async (rideId) => {
      setLoading(true)
      setError(null)
      try {
        const response = await driverService.startRide(rideId)
        dispatch(setActiveRide(response.data))
        return response.data
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to start ride')
        throw err
      } finally {
        setLoading(false)
      }
    },
    [dispatch]
  )

  const completeRide = useCallback(
    async (rideId) => {
      setLoading(true)
      setError(null)
      try {
        const response = await driverService.completeRide(rideId)
        dispatch(clearActiveRide())
        return response.data
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to complete ride')
        throw err
      } finally {
        setLoading(false)
      }
    },
    [dispatch]
  )

  const updateLocation = useCallback(
    async (driverId, location) => {
      try {
        await driverService.updateLocation(driverId, location)
      } catch (err) {
        console.error('Failed to update location:', err)
      }
    },
    []
  )

  const toggleOnline = useCallback(
    async (driverId, status) => {
      setLoading(true)
      setError(null)
      try {
        const response = await driverService.toggleOnline(driverId, status)
        setOnlineStatus(status)
        return response.data
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to toggle online status')
        throw err
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const ratePassenger = useCallback(
    async (rideId, rating, review) => {
      setLoading(true)
      setError(null)
      try {
        const response = await driverService.ratePassenger(rideId, rating, review)
        return response.data
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to rate passenger')
        throw err
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const getEarnings = useCallback(
    async (driverId, period = 'daily') => {
      setLoading(true)
      setError(null)
      try {
        const response = await driverService.getEarnings(driverId, period)
        return response.data
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch earnings')
        throw err
      } finally {
        setLoading(false)
      }
    },
    []
  )

  return {
    driver,
    activeRide,
    onlineStatus,
    loading,
    error,
    acceptRide,
    rejectRide,
    startRide,
    completeRide,
    updateLocation,
    toggleOnline,
    ratePassenger,
    getEarnings,
  }
}
