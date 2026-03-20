# Ride Microservice

A comprehensive ride management microservice for an Uber-like ride-sharing application. Handles ride requests, driver acceptance/rejection, real-time tracking, fare calculation, and ride history.

## Features

- **Ride Management**: Users can request rides with pickup/dropoff locations
- **Driver Matching**: Get available drivers near pickup location
- **Accept/Reject**: Drivers can accept or reject ride requests
- **Real-time Tracking**: Track both driver and rider locations
- **Fare Calculation**: Dynamic fare based on distance, time, and ride type with surge pricing
- **Ride History**: Complete ride history for users and drivers with pagination
- **Cancellation**: Cancel rides with customizable reasons
- **Status Tracking**: Real-time ride status updates (requested → accepted → ongoing → completed/cancelled)
- **Payment Integration Placeholder**: Support for multiple payment methods

## Tech Stack

- **Framework**: Express.js (Node.js)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with HttpOnly cookies
- **Logging**: Morgan HTTP logger
- **Environment**: dotenv for configuration

## Installation

1. Navigate to the ride folder:
```bash
cd E:\MicroServices\ride
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
# Copy and update the .env file
cp .env.example .env
```

4. Update `.env` with your MongoDB Atlas credentials:
```
MONGO_URI=mongodb+srv://admin:password@cluster.mongodb.net/ridedb?retryWrites=true&w=majority
JWT_SECRET=your_secret_key
PORT=3003
```

## Running the Service

```bash
# Development with hot reload
npm run dev

# Production
npm start
```

The service will start on `http://localhost:3003`

## API Endpoints

### Ride Management

#### Request a Ride
```http
POST /api/rides/request
Authorization: Bearer <token>
Content-Type: application/json

{
  "pickupLocation": {
    "address": "123 Main St, City",
    "coordinates": [longitude, latitude]
  },
  "dropoffLocation": {
    "address": "456 Park Ave, City",
    "coordinates": [longitude, latitude]
  },
  "rideType": "economy",
  "numberOfPassengers": 2,
  "specialRequests": "Please bring extra tissues"
}
```

#### Get Available Drivers
```http
GET /api/rides/available-drivers?latitude=28.7041&longitude=77.1025&radius=5000
Authorization: Bearer <token>
```

#### Accept a Ride (Driver)
```http
PUT /api/rides/:rideId/accept
Authorization: Bearer <token>
```

#### Reject a Ride (Driver)
```http
PUT /api/rides/:rideId/reject
Authorization: Bearer <token>
Content-Type: application/json

{
  "reason": "Too far away"
}
```

#### Update Ride Status
```http
PUT /api/rides/:rideId/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "ongoing",
  "distance": 5.2,
  "duration": 15
}
```

#### Get Ride Details
```http
GET /api/rides/:rideId
Authorization: Bearer <token>
```

#### Get User Ride History
```http
GET /api/rides/history/user/:userId?page=1&limit=10
Authorization: Bearer <token>
```

#### Get Driver Ride History
```http
GET /api/rides/history/driver/:driverId?page=1&limit=10
Authorization: Bearer <token>
```

#### Cancel a Ride
```http
PUT /api/rides/:rideId/cancel
Authorization: Bearer <token>
Content-Type: application/json

{
  "cancelledBy": "rider",
  "reason": "Driver delayed"
}
```

#### Calculate Fare Estimate
```http
POST /api/rides/calculate-fare
Content-Type: application/json

{
  "pickupCoordinates": [77.1025, 28.7041],
  "dropoffCoordinates": [77.2089, 28.5355],
  "rideType": "economy"
}
```

#### Track Location (Update Driver/Rider Location)
```http
PUT /api/rides/:rideId/location
Authorization: Bearer <token>
Content-Type: application/json

{
  "latitude": 28.7041,
  "longitude": 77.1025,
  "userType": "driver"
}
```

#### Get Active Rides for Driver
```http
GET /api/rides/active/driver/:driverId
Authorization: Bearer <token>
```

## Database Schema

### Ride Collection

```javascript
{
  riderId: ObjectId,                    // Reference to User
  driverId: ObjectId,                   // Reference to Captain/Driver
  pickupLocation: {
    address: String,
    coordinates: [Number]               // [longitude, latitude]
  },
  dropoffLocation: {
    address: String,
    coordinates: [Number]
  },
  status: String,                       // requested, accepted, ongoing, completed, cancelled
  rideType: String,                     // economy, premium, xl
  estimatedFare: Number,
  actualFare: Number,
  distance: Number,                     // in kilometers
  duration: Number,                     // in minutes
  numberOfPassengers: Number,
  specialRequests: String,
  riderRating: Number,                  // 1-5 stars
  driverRating: Number,                 // 1-5 stars
  cancellationReason: {
    cancelledBy: String,                // rider, driver, system
    reason: String,
    cancelledAt: Date
  },
  riderCurrentLocation: {
    coordinates: [Number],
    lastUpdated: Date
  },
  driverCurrentLocation: {
    coordinates: [Number],
    lastUpdated: Date
  },
  paymentMethod: String,                // cash, card, wallet, upi
  paymentStatus: String,                // pending, completed, failed
  acceptedAt: Date,
  startedAt: Date,
  completedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## Fare Calculation

The fare is calculated using:
1. **Base Fare**: Varies by ride type
   - Economy: ₹50
   - Premium: ₹100
   - XL: ₹80

2. **Distance Charge**: Per km rate
   - Economy: ₹10/km
   - Premium: ₹15/km
   - XL: ₹12/km

3. **Time Charge**: Per minute (estimated as 1 minute per km)
   - Economy: ₹2/min
   - Premium: ₹3/min
   - XL: ₹2.5/min

4. **Surge Pricing**: 1.5x multiplier during peak hours
   - 8:00 AM - 10:00 AM
   - 6:00 PM - 8:00 PM

## Ride Status Flow

```
requested → accepted → ongoing → completed
         ↓        ↓         ↓
       cancelled cancelled cancelled
```

## Authentication

All protected endpoints require JWT authentication via:
1. Cookie: `token=<jwt_token>`
2. Header: `Authorization: Bearer <jwt_token>`

Token payload includes:
```javascript
{
  id: userId,
  iat: timestamp,
  exp: timestamp + 7 days
}
```

## Error Handling

All endpoints return consistent error responses:

```json
{
  "message": "Error description",
  "error": "error details"
}
```

HTTP Status Codes:
- `201`: Created
- `200`: OK
- `400`: Bad Request
- `401`: Unauthorized
- `404`: Not Found
- `500`: Server Error

## Project Structure

```
ride/
├── models/
│   └── ride.model.js
├── controllers/
│   └── controller.ride.js
├── routes/
│   └── ride.routes.js
├── middleware/
│   └── auth.middleware.js
├── utils/
│   ├── fareCalculator.js
│   ├── validation.js
│   └── errorHandler.js
├── config/
│   └── constants.js
├── db/
│   └── db.js
├── app.js
├── server.js
├── .env
├── .env.example
└── package.json
```

## Environment Variables

- `NODE_ENV`: development or production
- `PORT`: Server port (default: 3003)
- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT signing
- `LOG_LEVEL`: Logging level (debug, info, warn, error)

## Integration with Other Services

### User Service (Port 3001)
- Validates rider existence
- Retrieves rider profile data
- Reference: `riderId` in Ride model

### Driver Service (Port 3002)
- Validates driver availability
- Retrieves driver profile and vehicle info
- Reference: `driverId` in Ride model

## Future Enhancements

- [ ] Real-time WebSocket updates for ride status
- [ ] Advanced fare calculation with surge zones
- [ ] Machine learning for ETA estimation
- [ ] Driver-rider rating and review system
- [ ] Promotional codes and discounts
- [ ] Ride pooling support
- [ ] Schedule rides in advance
- [ ] Corporate ride management

## License

MIT
