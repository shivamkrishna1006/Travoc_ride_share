import { useEffect, useState, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { setCurrentLocation } from '../store/slices/locationSlice'

export function useLocation() {
  const dispatch = useDispatch()
  const [location, setLocation] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [watchId, setWatchId] = useState(null)

  const startTracking = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported')
      setLoading(false)
      return
    }

    // Get initial location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords
        const loc = { lat: latitude, lng: longitude, accuracy }
        setLocation(loc)
        dispatch(setCurrentLocation(loc))
        setLoading(false)
      },
      (err) => {
        setError(err.message)
        setLoading(false)
      }
    )

    // Watch position updates every 5 seconds
    const id = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords
        const loc = { lat: latitude, lng: longitude, accuracy }
        setLocation(loc)
        dispatch(setCurrentLocation(loc))
      },
      (err) => {
        setError(err.message)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    )

    setWatchId(id)
  }, [dispatch])

  const stopTracking = useCallback(() => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId)
      setWatchId(null)
    }
  }, [watchId])

  useEffect(() => {
    startTracking()
    return () => stopTracking()
  }, [])

  return {
    location,
    error,
    loading,
    startTracking,
    stopTracking,
  }
}
