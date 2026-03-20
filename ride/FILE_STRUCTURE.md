# Ride Service - File Structure & Overview

## Directory Structure

```
ride/
├── models/
│   └── ride.model.js              # Ride schema with 20+ fields
├── controllers/
│   └── controller.ride.js          # 12 controller methods
├── routes/
│   └── ride.routes.js              # 11 API endpoints
├── middleware/
│   └── auth.middleware.js          # JWT authentication
├── utils/
│   ├── fareCalculator.js           # Fare calculation logic
│   ├── validation.js               # Input validation functions
│   └── errorHandler.js             # Error handling utilities
├── config/
│   └── constants.js                # App constants and enums
├── db/
│   └── db.js                       # MongoDB connection
├── app.js                          # Express app configuration
├── server.js                       # HTTP server & lifecycle
├── package.json                    # Dependencies & scripts
├── .env                            # Environment variables
├── .env.example                    # Example env file
├── README.md                       # Full documentation
└── QUICK_START.md                  # Setup guide
```

## File Descriptions

### Models (1 file)

#### `ride.model.js`
- **Purpose**: Define MongoDB schema for rides
- **Fields**: 20+ including riderId, driverId, locations, status, fare, tracking data
- **Indexes**: 2dsphere for locations, compound indexes for queries
- **Exports**: Mongoose model `Ride`

### Controllers (1 file)

#### `controller.ride.js`
12 main methods:
1. `requestRide()` - Create ride request
2. `getAvailableDrivers()` - Find nearby drivers
3. `acceptRide()` - Driver accepts ride
4. `rejectRide()` - Driver rejects ride
5. `updateRideStatus()` - Update ride progression (ongoing, completed)
6. `getRideDetails()` - Fetch ride with populated data
7. `getUserRideHistory()` - Paginated user ride history
8. `getDriverRideHistory()` - Paginated driver ride history
9. `cancelRide()` - Cancel with reason tracking
10. `calculateFareEstimate()` - Get fare before booking
11. `trackLocation()` - Update rider/driver position
12. `getActiveRidesForDriver()` - Active rides for driver

### Routes (1 file)

#### `ride.routes.js`
11 protected endpoints (10 + 1 public):
- `POST /request` - Request new ride
- `GET /available-drivers` - Find drivers nearby
- `PUT /:rideId/accept` - Accept ride
- `PUT /:rideId/reject` - Reject ride
- `PUT /:rideId/status` - Update status
- `GET /:rideId` - Get details
- `GET /history/user/:userId` - User history
- `GET /history/driver/:driverId` - Driver history
- `PUT /:rideId/cancel` - Cancel ride
- `POST /calculate-fare` - Calculate fare (public)
- `PUT /:rideId/location` - Track location
- `GET /active/driver/:driverId` - Active rides

### Middleware (1 file)

#### `auth.middleware.js`
- **Purpose**: JWT verification and authorization
- **Implementation**: Extracts token from cookies or Authorization header
- **Exports**: Middleware function for route protection

### Utilities (3 files)

#### `fareCalculator.js`
- `calculateFare(pickupCoords, dropoffCoords, rideType, distance?)` - Main fare calculation
- `calculateDistance(coord1, coord2)` - Haversine distance formula
- **Features**: Base fare, per-km rate, per-minute rate, surge pricing (1.5x peak hours)

#### `validation.js`
- `validateRideRequest()` - Validates ride request data
- `validateLocationUpdate()` - Validates location coordinates
- `validateCancellation()` - Validates cancellation data
- **Returns**: `{ isValid: boolean, errors: array }`

#### `errorHandler.js`
- `AppError` class - Custom error with status code
- `asyncHandler()` - Wrapper for async route handlers
- `errorHandler()` - Express error middleware
- **Features**: Auto catch errors, proper status codes

### Configuration (1 file)

#### `config/constants.js`
- `RIDE_STATUS` - Enum for status values
- `RIDE_TYPES` - Enum for economy/premium/xl
- `CANCELLATION_REASONS` - Predefined reason options
- `PAYMENT_METHODS` - cash/card/wallet/upi
- `PAYMENT_STATUS` - pending/completed/failed
- `TOKEN_EXPIRY` - 7 days
- `SALT_ROUNDS` - 10 for bcrypt
- `VALIDATION` - Min/max lengths and rules

### Database (1 file)

#### `db/db.js`
- **Purpose**: MongoDB connection initialization
- **Features**: Error handling, auto-exit on failure
- **Exports**: `connectDB()` function

### Core Files

#### `app.js`
- **Purpose**: Express application setup
- **Middleware Stack**:
  - `dotenv` - Environment loading
  - `express.json()` - JSON parsing
  - `cookieParser()` - Cookie parsing
  - `morgan('dev')` - HTTP logging
  - Custom routes
  - Error handler

#### `server.js`
- **Purpose**: HTTP server creation and lifecycle
- **Features**:
  - Port from .env (default 3003)
  - Graceful SIGTERM shutdown
  - Unhandled rejection catching

#### `package.json`
- **Scripts**:
  - `npm start` - Production run
  - `npm run dev` - Development with nodemon
- **Dependencies**: express, mongoose, bcrypt, jsonwebtoken, dotenv, cookie-parser, morgan
- **DevDependencies**: nodemon

## Data Flow

### Ride Request Flow
```
User → POST /api/rides/request
  ↓
Validate request data
  ↓
Calculate estimated fare
  ↓
Create Ride document
  ↓
Broadcast: Ride status = 'requested'
```

### Ride Acceptance Flow
```
Driver → PUT /api/rides/:rideId/accept
  ↓
Verify ride status = 'requested'
  ↓
Update driverId, set acceptedAt
  ↓
Ride status = 'accepted'
  ↓
Notify user (via WebSocket/polling)
```

### Ride Completion Flow
```
Driver → PUT /api/rides/:rideId/status (ongoing)
  ↓
Ride status = 'ongoing'
  ↓
Track locations (PUT /location)
  ↓
Driver → PUT /api/rides/:rideId/status (completed)
  ↓
Calculate actual fare
  ↓
Ride status = 'completed'
  ↓
Generate payment record
```

## Key Features

### 1. Real-time Location Tracking
- Separate fields for rider and driver current locations
- lastUpdated timestamp for each
- Geospatial queries for nearby drivers

### 2. Fare Calculation
- Base fare varies by ride type
- Distance-based charges
- Time-based charges
- Surge pricing during peak hours
- Supports custom distance if pre-calculated

### 3. Ride History
- Paginated results for performance
- Separate endpoints for users and drivers
- Includes populated rider/driver info
- Sorted by creation date (newest first)

### 4. Cancellation Handling
- Track who cancelled (rider/driver/system)
- Customizable reason
- Timestamp of cancellation
- Cannot cancel completed rides

### 5. Geospatial Indexing
- 2dsphere indexes on pickup, dropoff, and current locations
- Enables efficient nearby driver queries
- Enables location-based filtering

## API Response Format

### Success Response (2xx)
```json
{
  "message": "Operation description",
  "ride": { /* ride object */ },
  "rides": [ /* array of rides */ ],
  "totalRides": 45,
  "currentPage": 1,
  "totalPages": 5
}
```

### Error Response (4xx, 5xx)
```json
{
  "message": "Error description",
  "error": "detailed error message"
}
```

## Integration Points

### With User Service
- Validates `riderId` exists
- Calls User API to get rider profile
- Uses JWT from User service auth

### With Driver Service
- Validates `driverId` exists
- Calls Driver API to get driver profile
- Uses JWT from Driver service auth

### With Payment Service (Future)
- Send payment record on ride completion
- Handle payment status updates

## Security Features

1. **JWT Authentication**: Protected endpoints require valid token
2. **Input Validation**: All inputs validated before processing
3. **Error Handling**: No sensitive info in error messages
4. **Geospatial Security**: Coordinates converted to proper format
5. **Role-based Operations**: Drivers can only accept/reject, users can request/cancel

## Performance Optimizations

1. **Database Indexes**: Speeds up common queries
2. **Pagination**: Limits result sets for history endpoints
3. **Geospatial Queries**: Efficient location-based searches
4. **Connection Pooling**: MongoDB connection reuse
5. **Error Handling**: Prevents cascading failures

## Scalability Considerations

1. **Stateless Design**: Service can be scaled horizontally
2. **Database Separation**: Uses dedicated `ridedb` database
3. **Async Operations**: All I/O operations are async
4. **Rate Limiting**: Ready for implementation
5. **Caching**: Can add Redis for frequently accessed data

## Testing Considerations

- Mock JWT tokens for testing
- Use test MongoDB database
- Verify all 12 controller methods
- Test geospatial queries with real coordinates
- Validate error responses
- Test edge cases (expired tokens, invalid IDs, etc.)
