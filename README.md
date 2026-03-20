# Ride-Sharing Microservices Platform

A production-ready event-driven microservices architecture for a ride-sharing application built with Node.js, Express, MongoDB, RabbitMQ, and Redis.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     API Gateway (Port 3000)                 │
└────────┬────────────────────┬────────────────────┬──────────┘
         │                    │                    │
    ┌────▼────┐          ┌────▼────┐         ┌───▼────┐
    │  User   │          │ Driver  │         │  Ride  │
    │ Service │          │ Service │         │Service │
    │ 3001    │          │ 3002    │         │ 3003   │
    └────┬────┘          └────┬────┘         └───┬────┘
         │                    │                   │
         └────────┬───────────┼───────────────────┘
                  │
        ┌─────────┴──────────────┐
        │                        │
    ┌───▼──┐              ┌─────▼─────┐
    │ MongoDB            │ RabbitMQ   │
    │ (3 DBs)           │ (Events)   │
    └──────┘            └────────────┘
        │                        │
        └────────────┬───────────┘
                     │
                  ┌──▼──┐
                  │Redis │
                  └──────┘
```

## Services

### 1. User Service (Port 3001)
Manages user authentication, profiles, and ride history.
- User registration & authentication
- Profile management
- Ride history tracking
- Payment processing

### 2. Driver Service (Port 3002)
Manages driver profiles, availability, and ratings.
- Driver registration & verification
- Availability management
- Earnings tracking
- Driver ratings

### 3. Ride Service (Port 3003)
Core ride management service with event-driven architecture.
- Ride requests & matching
- Real-time ride updates
- Payment & refund handling
- Ride history

## Tech Stack

- **Runtime**: Node.js v18+
- **Framework**: Express.js
- **Database**: MongoDB
- **Message Queue**: RabbitMQ
- **Cache/Locks**: Redis
- **Containers**: Docker & Docker Compose

## Project Structure

```
.
├── user/                 # User Service
│   ├── controllers/      # Request handlers
│   ├── models/          # MongoDB schemas
│   ├── routes/          # Express routes
│   ├── src/
│   │   ├── clients/     # Service clients
│   │   └── event-subscriber.js
│   └── app.js
├── Driver/              # Driver Service
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── src/
│   │   └── event-subscriber.js
│   └── app.js
├── ride/                # Ride Service
│   ├── controllers/     # Core logic
│   ├── models/         # Data schemas
│   ├── routes/
│   ├── src/
│   │   ├── clients/    # User & Driver clients
│   │   └── event-subscriber.js
│   └── app.js
├── shared-utils/        # Shared utilities
│   ├── event-bus/
│   │   ├── event-publisher.js
│   │   └── event-subscriber.js
│   ├── cache/
│   │   ├── redis-client.js
│   │   └── lock-manager.js
│   └── http/
│       ├── circuit-breaker.js
│       └── service-client.js
├── docker-compose.yml   # Infrastructure
└── init-mongo.js        # MongoDB init script
```











### User Service (3001)
- `POST /users/register` - Register user
- `POST /users/login` - User login
- `GET /users/:id` - Get user profile
- `GET /users/:id/rides` - Get ride history

### Driver Service (3002)
- `POST /drivers/register` - Register driver
- `GET /drivers/:id` - Get driver profile
- `PUT /drivers/:id/status` - Update availability
- `GET /drivers/:id/earnings` - Get earnings

### Ride Service (3003)
- `POST /rides/request` - Request a ride
- `PUT /rides/:id/accept` - Accept ride (driver)
- `PUT /rides/:id/complete` - Complete ride
- `PUT /rides/:id/cancel` - Cancel ride

## Event-Driven Architecture

Services communicate via RabbitMQ using topic exchanges:

**Event Topics:**
- `rides.*` - Ride-related events
- `drivers.*` - Driver-related events
- `users.*` - User-related events

**Key Events:**
- `rides.riderequested` - New ride requested
- `rides.rideaccepted` - Ride accepted by driver
- `rides.ridecompleted` - Ride completed
- `rides.ridecancelled` - Ride cancelled
- `drivers.driveronline` - Driver online
- `drivers.driveroffline` - Driver offline
- `users.paymentprocessed` - Payment processed

## Features

✅ **Event-Driven Architecture** - Decoupled service communication
✅ **Distributed Locking** - Redis-based locks for concurrent operations
✅ **Circuit Breaker Pattern** - Service fault tolerance
✅ **Caching Strategy** - Redis caching for frequently accessed data
✅ **Error Handling** - Comprehensive error handling with fallbacks
✅ **Auto-Reconnection** - Automatic reconnection to infrastructure
✅ **Docker Ready** - Production-ready containerization

## Testing

```bash
# Run all tests
npm test

# Run specific service tests
cd user && npm test
```

## Documentation

- [Integration Setup Guide](./INTEGRATION_SETUP_GUIDE.md) - Detailed setup instructions
- [Architecture Diagrams](./ARCHITECTURE_DIAGRAMS.md) - Visual architecture
- [API Quick Reference](./QUICK_REFERENCE.md) - Quick API reference
- [Integration Fixes](./INTEGRATION_FIXES.md) - Implementation fixes applied





## License

MIT

## Support

For issues or questions, please create an issue in the repository.


