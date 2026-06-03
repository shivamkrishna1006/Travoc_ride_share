import { useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { rideService } from '../api/services/ride.service'
import {
  setActiveRide,
  updateRideStatus,
  clearActiveRide,
  addRideToHistory,
} from '../store/slices/rideSlice'

export function useRide() {
  const dispatch = useDispatch()
  const ride = useSelector((state) => state.ride.activeRide)
  const history = useSelector((state) => state.ride.rideHistory)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const requestRide = useCallback(
    async (pickup, dropoff, rideType) => {
      setLoading(true)
      setError(null)
      try {
        const response = await rideService.requestRide({
          pickup,
          dropoff,
          rideType,
        })
        dispatch(setActiveRide(response.data))
        return response.data
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to request ride')
        throw err
      } finally {
        setLoading(false)
      }
    },
    [dispatch]
  )

  const cancelRide = useCallback(
    async (rideId, reason = 'User cancelled') => {
      setLoading(true)
      try {
        await rideService.cancelRide(rideId, reason)
        dispatch(clearActiveRide())
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to cancel ride')
        throw err
      } finally {
        setLoading(false)
      }
    },
    [dispatch]
  )

  const getRideStatus = useCallback(async (rideId) => {
    try {
      const response = await rideService.getRideStatus(rideId)
      dispatch(updateRideStatus(response.data.status))
      return response.data
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to get ride status')
      throw err
    }
  }, [dispatch])

  const getRideHistory = useCallback(
    async (userId, page = 1) => {
      setLoading(true)
      try {
        const response = await rideService.getRideHistory(userId, page)
        return response.data
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to get ride history')
        throw err
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const completeRide = useCallback(
    async (rideId) => {
      setLoading(true)
      try {
        const response = await rideService.completeRide(rideId)
        dispatch(addRideToHistory(response.data))
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

  return {
    ride,
    history,
    loading,
    error,
    requestRide,
    cancelRide,
    getRideStatus,
    getRideHistory,
    completeRide,
  }
}
