import { useCallback, useState } from 'react'
import { rideService } from '../api/services/ride.service'
import { useDebounce } from './useDebounce'

export function useFareEstimate() {
  const [fare, setFare] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const calculateFareDebounced = useCallback(
    async (pickup, dropoff, rideType = 'economy') => {
      if (!pickup || !dropoff) {
        setFare(null)
        return
      }

      setLoading(true)
      setError(null)

      try {
        const response = await rideService.calculateFare(pickup, dropoff, rideType)
        setFare(response.data)
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to calculate fare')
        setFare(null)
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const estimate = useDebounce(calculateFareDebounced, 500)

  const estimateFare = useCallback(
    (pickup, dropoff, rideType = 'economy') => {
      estimate(pickup, dropoff, rideType)
    },
    [estimate]
  )

  const reset = useCallback(() => {
    setFare(null)
    setError(null)
  }, [])

  return {
    fare,
    loading,
    error,
    estimateFare,
    reset,
  }
}
