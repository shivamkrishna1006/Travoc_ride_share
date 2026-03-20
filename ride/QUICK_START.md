# Ride Service - Quick Start Guide

Get the Ride microservice up and running in minutes!

## Prerequisites

- Node.js v14 or higher
- npm or yarn
- MongoDB Atlas account with connection URI
- JWT secret key

## Setup Steps

### 1. Install Dependencies
```bash
cd E:\MicroServices\ride
npm install
```

### 2. Configure Environment
Create/update `.env` file:
```bash
NODE_ENV=development
PORT=3003
MONGO_URI=mongodb+srv://admin:RyMKDzoAgOLHmzh0@microservices.adfyqwi.mongodb.net/ridedb?retryWrites=true&w=majority
JWT_SECRET=ride_service_jwt_secret_key_2024
LOG_LEVEL=debug
```

### 3. Start the Service
```bash
npm start
```

You should see:
```
Ride Service listening on port 3003
Connected to MongoDB
```

### 4. Verify Health Check
```bash
curl http://localhost:3003/health
```

Expected response:
```json
{
  "message": "Ride Service is running",
  "status": "OK",
  "port": 3003
}
```

## Example API Requests

### Request a Ride
```bash
curl -X POST http://localhost:3003/api/rides/request \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "pickupLocation": {
      "address": "123 Main St, New Delhi",
      "coordinates": [77.1025, 28.7041]
    },
    "dropoffLocation": {
      "address": "456 Park Ave, New Delhi",
      "coordinates": [77.2089, 28.5355]
    },
    "rideType": "economy",
    "numberOfPassengers": 2
  }'
```

### Calculate Fare
```bash
curl -X POST http://localhost:3003/api/rides/calculate-fare \
  -H "Content-Type: application/json" \
  -d '{
    "pickupCoordinates": [77.1025, 28.7041],
    "dropoffCoordinates": [77.2089, 28.5355],
    "rideType": "economy"
  }'
```

### Accept Ride (Driver)
```bash
curl -X PUT http://localhost:3003/api/rides/:rideId/accept \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Update Ride Status
```bash
curl -X PUT http://localhost:3003/api/rides/:rideId/status \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "ongoing",
    "distance": 5.2,
    "duration": 15
  }'
```

### Get Ride History
```bash
curl -X GET "http://localhost:3003/api/rides/history/user/USER_ID?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Track Location
```bash
curl -X PUT http://localhost:3003/api/rides/:rideId/location \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "latitude": 28.7041,
    "longitude": 77.1025,
    "userType": "driver"
  }'
```

## API Endpoints Summary

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/rides/request` | ✓ | Request a new ride |
| GET | `/api/rides/available-drivers` | ✓ | Find available drivers |
| POST | `/api/rides/calculate-fare` | ✗ | Calculate fare estimate |
| PUT | `/api/rides/:rideId/accept` | ✓ | Accept ride (driver) |
| PUT | `/api/rides/:rideId/reject` | ✓ | Reject ride (driver) |
| PUT | `/api/rides/:rideId/status` | ✓ | Update ride status |
| GET | `/api/rides/:rideId` | ✓ | Get ride details |
| GET | `/api/rides/history/user/:userId` | ✓ | Get user ride history |
| GET | `/api/rides/history/driver/:driverId` | ✓ | Get driver ride history |
| PUT | `/api/rides/:rideId/cancel` | ✓ | Cancel ride |
| PUT | `/api/rides/:rideId/location` | ✓ | Update location |
| GET | `/api/rides/active/driver/:driverId` | ✓ | Get active rides |

## Development Mode

```bash
npm run dev
```

Uses nodemon for auto-reload on file changes.

## Troubleshooting

### "Cannot find module" errors
```bash
npm install
```

### MongoDB connection error
- Verify MONGO_URI in .env
- Check MongoDB Atlas IP whitelist includes your IP
- Ensure credentials are correct

### JWT authentication errors
- Verify JWT_SECRET matches between services
- Check token hasn't expired (7-day expiry)
- Ensure token is in Authorization header or cookies

### Port already in use
Change PORT in .env or kill process on port 3003:
```bash
# Windows
netstat -ano | findstr :3003
taskkill /PID <PID> /F
```

## Database

The service uses MongoDB with the following database:
- **Database**: `ridedb`
- **Collections**: `rides`

Indexes created automatically on:
- Pickup location (geospatial)
- Dropoff location (geospatial)
- Rider ID + createdAt
- Driver ID + createdAt
- Status

## Next Steps

1. Start the User Service (Port 3001)
2. Start the Driver Service (Port 3002)
3. Start this Ride Service (Port 3003)
4. Begin testing the ride flow:
   - User requests ride
   - Driver accepts ride
   - Real-time location tracking
   - Complete ride
   - Generate payment

## Support

For issues or questions, refer to:
- [README.md](./README.md) - Full documentation
- [Ride Model](./models/ride.model.js) - Schema definition
- [Controller](./controllers/controller.ride.js) - Business logic
