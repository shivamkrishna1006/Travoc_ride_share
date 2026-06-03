# Frontend-Backend Integration Guide

## 🔗 API ENDPOINT MAPPINGS

### Authentication Endpoints

**User Signup**
```javascript
// File: src/api/services/auth.service.js
POST /user/api/users/register
Request: { email, password, firstName, lastName, phone }
Response: { user, token }
```

**User Login**
```javascript
POST /user/api/users/login
Request: { email, password }
Response: { user, token }
```

**Driver Signup**
```javascript
POST /driver/api/captains/register
Request: { email, password, firstName, lastName, phone, vehicle, bank }
Response: { driver, token }
```

**Driver Login**
```javascript
POST /driver/api/captains/login
Request: { email, password }
Response: { driver, token }
```

**Logout**
```javascript
POST /user/api/users/logout (for riders)
POST /driver/api/captains/logout (for drivers)
```

---

### Ride Endpoints

**Request a Ride**
```javascript
// File: src/api/services/ride.service.js
POST /rides/api/rides/request
Request: { pickup, dropoff, rideType, userId }
Response: { 
  id, 
  pickup, 
  dropoff, 
  rideType,
  fare,
  status: 'requested',
  createdAt 
}
```

**Calculate Fare**
```javascript
POST /rides/api/rides/calculate-fare
Request: { pickup, dropoff, rideType }
Response: {
  baseFare,
  distance,
  distanceFare,
  surgeFactor,
  total
}
```

**Get Ride Status**
```javascript
GET /rides/api/rides/:rideId
Response: { id, status, pickup, dropoff, driver, fare, eta }
```

**Update Ride Location**
```javascript
PUT /rides/api/rides/:rideId/location
Request: { lat, lng }
Response: { success: true }
```

**Cancel Ride**
```javascript
PUT /rides/api/rides/:rideId/cancel
Request: { reason }
Response: { success: true }
```

**Complete Ride**
```javascript
PUT /rides/api/rides/:rideId/complete
Request: { rating, review }
Response: { ride: {...}, success: true }
```

**Get Ride History**
```javascript
GET /rides/api/rides/history/user/:userId?page=1&limit=10
Response: { rides: [...], total, page, pages }
```

---

### Driver Endpoints

**Accept Ride**
```javascript
// File: src/api/services/driver.service.js
PUT /rides/api/rides/:rideId/accept
Request: { driverId }
Response: { ride: {...}, success: true }
```

**Reject Ride**
```javascript
PUT /rides/api/rides/:rideId/reject
Request: { driverId, reason }
Response: { success: true }
```

**Get Active Rides**
```javascript
GET /rides/api/rides/active/driver/:driverId
Response: { rides: [...] }
```

**Update Driver Location**
```javascript
PUT /driver/api/captains/:driverId/location
Request: { lat, lng, accuracy }
Response: { success: true }
```

**Start Ride**
```javascript
PUT /rides/api/rides/:rideId/start
Request: { driverId }
Response: { ride: {...}, success: true }
```

**Toggle Online Status**
```javascript
PUT /driver/api/captains/:driverId/toggle-online
Request: { status: true/false }
Response: { status, message }
```

**Get Earnings**
```javascript
GET /driver/api/captains/:driverId/earnings?period=daily
Response: { 
  daily: 145.50,
  weekly: 743.00,
  monthly: 2847.50,
  trips: 234
}
```

---

### User Profile Endpoints

**Get User Profile**
```javascript
// File: src/api/services/user.service.js
GET /user/api/users/profile/:userId
Response: { user: {...} }
```

**Update User Profile**
```javascript
PUT /user/api/users/profile/:userId
Request: { firstName, lastName, phone, email }
Response: { user: {...} }
```

**Add Payment Method**
```javascript
POST /user/api/users/payment-methods
Request: { cardNumber, expiryDate, cvv, zipCode }
Response: { paymentMethod: {...} }
```

**Upload Driver Document**
```javascript
POST /driver/api/captains/:driverId/documents
Request: FormData { type: 'license', file: File }
Headers: { 'Content-Type': 'multipart/form-data' }
Response: { document: {...} }
```

---

## 🔄 Real-Time Socket.IO Events

### Events Rider Should Listen For

```javascript
// In useSocket hook
socket.on('rideRequested', (ride) => {
  // Ride created, waiting for driver
  dispatch(setActiveRide(ride))
})

socket.on('driverAssigned', (driver) => {
  // Driver accepted ride
  dispatch(updateRideStatus('accepted'))
  // Show driver info
})

socket.on('driverLocationUpdated', (data) => {
  // Driver location changed (every 5 seconds)
  // { driverId, lat, lng, eta }
  dispatch(updateDriverLocation(data))
})

socket.on('rideStatusChanged', (data) => {
  // Status: accepted → arriving → started → completed
  dispatch(updateRideStatus(data.status))
})

socket.on('rideCompleted', (ride) => {
  // Ride finished, show rating screen
  dispatch(clearActiveRide())
})

socket.on('rideCancelled', (reason) => {
  // Ride was cancelled
  dispatch(clearActiveRide())
})
```

### Events Driver Should Listen For

```javascript
socket.on('rideRequested', (ride) => {
  // New ride request received - show notification
  // { id, pickup, dropoff, distance, fare, passengerName, rating }
})

socket.on('rideAccepted', (data) => {
  // Rider accepted (after driver accepted first)
})

socket.on('rideStarted', (data) => {
  // Rider confirmed pickup
})

socket.on('rideCompleted', (ride) => {
  // Ride finished
})
```

### Events to Emit

```javascript
// Driver updates location every 5 seconds
socket.emit('updateLocation', { 
  driverId, 
  lat, 
  lng, 
  accuracy 
})

// Driver accepts ride
socket.emit('acceptRide', { 
  rideId, 
  driverId 
})

// Rider marks payment complete
socket.emit('paymentComplete', { 
  rideId, 
  amount, 
  method 
})
```

---

## 🔐 Authentication Flow

### 1. Login/Signup
```javascript
// Frontend calls:
POST /user/api/users/login { email, password }

// Backend returns:
{ 
  user: { id, firstName, lastName, email, phone },
  token: 'jwt_token_here'
}

// Frontend stores:
localStorage.setItem('ride_app_token', token)
dispatch(setToken(token))
dispatch(setUser(user))
dispatch(setRole('rider'))
```

### 2. Authenticated Requests
```javascript
// Axios interceptor adds token:
headers.Authorization = `Bearer ${token}`

// All subsequent API calls include token:
GET /user/api/users/profile/:userId
Headers: { Authorization: 'Bearer token_here' }
```

### 3. Token Refresh (if 401)
```javascript
// Response interceptor catches 401:
// Try to refresh token (if backend supports)
POST /user/api/users/refresh-token

// If fails:
// Redirect to login and clear storage
```

---

## 📝 Environment Configuration

Create `.env.local` in frontend directory:

```env
VITE_API_URL=http://localhost:3000
VITE_SOCKET_URL=http://localhost:3000
VITE_MAPBOX_TOKEN=pk_your_token_here
```

Backend should be running on `localhost:3000` (API Gateway)

---

## 🧪 Testing Integration

### 1. Test Auth Endpoint
```bash
curl -X POST http://localhost:3000/user/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test@1234"}'
```

### 2. Test Protected Endpoint
```bash
curl -X GET http://localhost:3000/user/api/users/profile/userId \
  -H "Authorization: Bearer your_jwt_token"
```

### 3. Check Socket Connection
Open browser DevTools → Network → WS tab
Should see connection to `localhost:3000` with Socket.IO protocol

---

## ⚠️ Common Issues & Fixes

### CORS Errors
**Problem:** `Access to XMLHttpRequest blocked by CORS policy`

**Fix:** Configure backend CORS:
```javascript
// Backend (Express)
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))
```

### 401 Unauthorized
**Problem:** `Status 401` on protected routes

**Fix:** 
- Ensure token is in localStorage
- Check token format in Authorization header: `Bearer <token>`
- Verify token hasn't expired
- Check token is being sent in all requests

### Socket.IO Not Connecting
**Problem:** WebSocket connection fails

**Fix:**
- Ensure backend Socket.IO is running on same port as API
- Check VITE_SOCKET_URL in .env.local
- Verify backend has `io.on('connection')` handler
- Check browser console for connection errors

### 404 Not Found
**Problem:** `404 error on /rides/api/rides/request`

**Fix:**
- Verify backend has route defined
- Check API Gateway is routing correctly
- Ensure Ride Service is running on port 3003
- Check route paths match exactly

---

## 📋 Integration Checklist

- [ ] Backend services running (User, Driver, Ride)
- [ ] API Gateway on port 3000
- [ ] Socket.IO configured on backend
- [ ] CORS enabled on backend
- [ ] .env.local configured with correct URLs
- [ ] Test auth endpoints manually
- [ ] Frontend login works
- [ ] Protected routes redirect unauthenticated users
- [ ] API calls return real data (not mocks)
- [ ] Real-time location updates working
- [ ] Socket events received correctly
- [ ] Error handling works
- [ ] Token refresh works (if implemented)

---

## 🔧 Quick Migration from Mocks to Real API

### Step 1: Remove Mock Data
In each page, replace mock data with actual API calls:

```javascript
// Before (mock):
const mockRide = { id: '123', pickup: '...' }

// After (real):
const { ride, loading, error } = useRide()
// Now uses real API
```

### Step 2: Use Real API Services
```javascript
// Components already have:
import { rideService } from '../api/services/ride.service'

// Just need to ensure backend endpoints exist
```

### Step 3: Verify Socket Events
```javascript
// useSocket already listens for real events
// Just ensure backend emits them correctly
```

### Step 4: Test Each Flow
- Signup → Login → Dashboard (working?)
- Search Ride → Request → Track (real data?)
- Driver Online → Accept Request → Complete (real flow?)

---

**Status:** Frontend is ready. Just point it to your backend endpoints!
