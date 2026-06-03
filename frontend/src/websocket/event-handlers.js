import { socketService } from './socket-service'

// This file contains organized event handler setup for different app features

export const setupRideEventHandlers = (dispatch) => {
  // Ride requested (for riders waiting for driver)
  socketService.on('rideRequested', (ride) => {
    console.log('Ride requested event:', ride)
    dispatch({ type: 'RIDE_REQUESTED', payload: ride })
  })

  // Driver accepted ride
  socketService.on('rideAccepted', (ride) => {
    console.log('Ride accepted event:', ride)
    dispatch({ type: 'RIDE_ACCEPTED', payload: ride })
  })

  // Driver assigned (rider receives driver info)
  socketService.on('driverAssigned', (driver) => {
    console.log('Driver assigned event:', driver)
    dispatch({ type: 'DRIVER_ASSIGNED', payload: driver })
  })

  // Driver arriving at pickup
  socketService.on('driverArriving', (data) => {
    console.log('Driver arriving event:', data)
    dispatch({ type: 'DRIVER_ARRIVING', payload: data })
  })

  // Ride started (passenger boarded)
  socketService.on('rideStarted', (ride) => {
    console.log('Ride started event:', ride)
    dispatch({ type: 'RIDE_STARTED', payload: ride })
  })

  // Ride completed
  socketService.on('rideCompleted', (ride) => {
    console.log('Ride completed event:', ride)
    dispatch({ type: 'RIDE_COMPLETED', payload: ride })
  })

  // Ride cancelled
  socketService.on('rideCancelled', (data) => {
    console.log('Ride cancelled event:', data)
    dispatch({ type: 'RIDE_CANCELLED', payload: data })
  })
}

export const setupLocationEventHandlers = (dispatch) => {
  // Driver location update (rider sees driver moving)
  socketService.on('driverLocationUpdated', (data) => {
    console.log('Driver location updated:', data)
    dispatch({
      type: 'UPDATE_DRIVER_LOCATION',
      payload: {
        driverId: data.driverId,
        lat: data.lat,
        lng: data.lng,
      },
    })
  })

  // Rider location update (driver sees rider)
  socketService.on('riderLocationUpdated', (data) => {
    console.log('Rider location updated:', data)
    dispatch({
      type: 'UPDATE_RIDER_LOCATION',
      payload: {
        riderId: data.riderId,
        lat: data.lat,
        lng: data.lng,
      },
    })
  })
}

export const setupDriverEventHandlers = (dispatch) => {
  // New ride request for driver
  socketService.on('newRideRequest', (ride) => {
    console.log('New ride request:', ride)
    dispatch({ type: 'NEW_RIDE_REQUEST', payload: ride })
  })

  // Ride request expired
  socketService.on('rideRequestExpired', (data) => {
    console.log('Ride request expired:', data)
    dispatch({ type: 'RIDE_REQUEST_EXPIRED', payload: data })
  })
}

export const setupNotificationEventHandlers = (dispatch) => {
  // General notification
  socketService.on('notification', (data) => {
    console.log('Notification:', data)
    dispatch({
      type: 'SHOW_NOTIFICATION',
      payload: {
        id: Date.now(),
        message: data.message,
        type: data.type || 'info',
        visible: true,
      },
    })
  })
}

export const setupConnectionEventHandlers = (dispatch) => {
  // Socket connected
  socketService.on('__connected', () => {
    console.log('WebSocket connected')
    dispatch({ type: 'SET_SOCKET_CONNECTED', payload: true })
  })

  // Socket disconnected
  socketService.on('__disconnected', () => {
    console.log('WebSocket disconnected')
    dispatch({ type: 'SET_SOCKET_CONNECTED', payload: false })
  })

  // Socket error
  socketService.on('__error', (error) => {
    console.error('WebSocket error:', error)
    dispatch({
      type: 'SHOW_NOTIFICATION',
      payload: {
        id: Date.now(),
        message: 'Connection error. Reconnecting...',
        type: 'error',
        visible: true,
      },
    })
  })
}

// Setup all event handlers at once
export const setupAllEventHandlers = (dispatch) => {
  setupConnectionEventHandlers(dispatch)
  setupRideEventHandlers(dispatch)
  setupLocationEventHandlers(dispatch)
  setupDriverEventHandlers(dispatch)
  setupNotificationEventHandlers(dispatch)
}

// Cleanup event handlers
export const cleanupEventHandlers = () => {
  socketService.disconnect()
}
