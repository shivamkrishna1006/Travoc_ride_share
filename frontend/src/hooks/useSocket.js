import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import io from 'socket.io-client'
import { getSecureToken } from '../utils/storage'
import { setActiveRide, updateRideStatus } from '../store/slices/rideSlice'
import { updateDriverLocation } from '../store/slices/locationSlice'

const SOCKET_URL = process.env.VITE_SOCKET_URL || 'http://localhost:3000'

export function useSocket(eventHandlers = {}) {
  const socketRef = useRef(null)
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user)
  const driver = useSelector((state) => state.auth.driver)
  const role = useSelector((state) => state.auth.role)

  useEffect(() => {
    if (!user && !driver) return

    const token = getSecureToken()
    if (!token) return

    // Connect to Socket.IO server
    socketRef.current = io(SOCKET_URL, {
      auth: {
        token,
        userId: user?.id || driver?.id,
        role,
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    })

    // Built-in event handlers
    socketRef.current.on('connect', () => {
      console.log('Socket connected')
    })

    socketRef.current.on('disconnect', () => {
      console.log('Socket disconnected')
    })

    // Ride events
    socketRef.current.on('rideRequested', (ride) => {
      dispatch(setActiveRide(ride))
      eventHandlers.onRideRequested?.(ride)
    })

    socketRef.current.on('rideAccepted', (ride) => {
      dispatch(setActiveRide(ride))
      eventHandlers.onRideAccepted?.(ride)
    })

    socketRef.current.on('rideStatusChanged', (data) => {
      dispatch(updateRideStatus(data.status))
      eventHandlers.onRideStatusChanged?.(data)
    })

    socketRef.current.on('driverLocationUpdated', (data) => {
      dispatch(updateDriverLocation({
        driverId: data.driverId,
        lat: data.lat,
        lng: data.lng,
      }))
      eventHandlers.onDriverLocationUpdated?.(data)
    })

    socketRef.current.on('rideCompleted', (ride) => {
      eventHandlers.onRideCompleted?.(ride)
    })

    socketRef.current.on('rideCancelled', (ride) => {
      eventHandlers.onRideCancelled?.(ride)
    })

    // Custom event handlers
    Object.entries(eventHandlers).forEach(([event, handler]) => {
      if (!event.startsWith('on')) {
        socketRef.current.on(event, handler)
      }
    })

    return () => {
      socketRef.current?.disconnect()
    }
  }, [user, driver, role, dispatch, eventHandlers])

  const emit = (event, data) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(event, data)
    }
  }

  const isConnected = socketRef.current?.connected || false

  return { emit, isConnected, socket: socketRef.current }
}
