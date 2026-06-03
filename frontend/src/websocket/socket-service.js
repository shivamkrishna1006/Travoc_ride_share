import io from 'socket.io-client'
import { getSecureToken } from '../utils/storage'

const SOCKET_URL = process.env.VITE_SOCKET_URL || 'http://localhost:3000'

class SocketService {
  constructor() {
    this.socket = null
    this.isConnected = false
    this.eventHandlers = {}
  }

  connect(userId, role) {
    if (this.socket?.connected) {
      console.log('Socket already connected')
      return this.socket
    }

    const token = getSecureToken()
    if (!token) {
      console.error('No auth token available')
      return null
    }

    this.socket = io(SOCKET_URL, {
      auth: {
        token,
        userId,
        role,
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    })

    this.setupEventListeners()
    return this.socket
  }

  setupEventListeners() {
    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket.id)
      this.isConnected = true
      this.emit('__connected')
    })

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected')
      this.isConnected = false
      this.emit('__disconnected')
    })

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error)
      this.emit('__error', error)
    })

    // Ride events
    this.socket.on('rideRequested', (data) => {
      console.log('Ride requested:', data)
      this.emit('rideRequested', data)
    })

    this.socket.on('rideAccepted', (data) => {
      console.log('Ride accepted:', data)
      this.emit('rideAccepted', data)
    })

    this.socket.on('driverAssigned', (data) => {
      console.log('Driver assigned:', data)
      this.emit('driverAssigned', data)
    })

    this.socket.on('driverArriving', (data) => {
      console.log('Driver arriving:', data)
      this.emit('driverArriving', data)
    })

    this.socket.on('rideStarted', (data) => {
      console.log('Ride started:', data)
      this.emit('rideStarted', data)
    })

    this.socket.on('rideCompleted', (data) => {
      console.log('Ride completed:', data)
      this.emit('rideCompleted', data)
    })

    this.socket.on('rideCancelled', (data) => {
      console.log('Ride cancelled:', data)
      this.emit('rideCancelled', data)
    })

    // Location events
    this.socket.on('driverLocationUpdated', (data) => {
      console.log('Driver location updated:', data)
      this.emit('driverLocationUpdated', data)
    })

    this.socket.on('riderLocationUpdated', (data) => {
      console.log('Rider location updated:', data)
      this.emit('riderLocationUpdated', data)
    })

    // Driver events
    this.socket.on('newRideRequest', (data) => {
      console.log('New ride request for driver:', data)
      this.emit('newRideRequest', data)
    })

    this.socket.on('rideRequestExpired', (data) => {
      console.log('Ride request expired:', data)
      this.emit('rideRequestExpired', data)
    })

    // Notification events
    this.socket.on('notification', (data) => {
      console.log('Notification:', data)
      this.emit('notification', data)
    })

    this.socket.on('error', (error) => {
      console.error('Socket error:', error)
      this.emit('error', error)
    })
  }

  // Emit event to backend
  emit(event, data) {
    if (this.socket?.connected) {
      this.socket.emit(event, data)
    } else {
      console.warn(`Socket not connected, cannot emit "${event}"`)
    }
  }

  // Register event listener
  on(event, callback) {
    if (!this.eventHandlers[event]) {
      this.eventHandlers[event] = []
    }
    this.eventHandlers[event].push(callback)

    // Also register with socket if connected
    if (this.socket?.connected) {
      this.socket.on(event, callback)
    }
  }

  // Unregister event listener
  off(event, callback) {
    if (this.eventHandlers[event]) {
      this.eventHandlers[event] = this.eventHandlers[event].filter(
        (cb) => cb !== callback
      )
    }

    if (this.socket?.connected) {
      this.socket.off(event, callback)
    }
  }

  // Send ride update
  updateRideStatus(rideId, status) {
    this.emit('rideStatusUpdate', { rideId, status })
  }

  // Send location update
  updateLocation(location) {
    this.emit('locationUpdate', location)
  }

  // Accept ride (driver)
  acceptRide(rideId) {
    this.emit('acceptRide', { rideId })
  }

  // Reject ride (driver)
  rejectRide(rideId, reason) {
    this.emit('rejectRide', { rideId, reason })
  }

  // Request ride (rider)
  requestRide(rideData) {
    this.emit('requestRide', rideData)
  }

  // Cancel ride
  cancelRide(rideId, reason) {
    this.emit('cancelRide', { rideId, reason })
  }

  // Disconnect socket
  disconnect() {
    if (this.socket?.connected) {
      this.socket.disconnect()
      this.isConnected = false
    }
  }

  // Get connection status
  getStatus() {
    return {
      isConnected: this.isConnected,
      socketId: this.socket?.id,
      url: SOCKET_URL,
    }
  }
}

// Export singleton instance
export const socketService = new SocketService()

// Export class for testing
export default SocketService
