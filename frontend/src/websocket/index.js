export { socketService, default as SocketService } from './socket-service'
export {
  setupRideEventHandlers,
  setupLocationEventHandlers,
  setupDriverEventHandlers,
  setupNotificationEventHandlers,
  setupConnectionEventHandlers,
  setupAllEventHandlers,
  cleanupEventHandlers,
} from './event-handlers'
