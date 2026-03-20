# 🏗️ INTEGRATED MICROSERVICES ARCHITECTURE
## Uber-like Ride Booking System - Complete Design

---

## 1. SERVICE RESPONSIBILITIES & DATA OWNERSHIP

### 1.1 Service Boundaries

```
┌─────────────────────────────────────────────────────────────┐
│           MICROSERVICES ARCHITECTURE                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────┐  ┌──────────────────┐ ┌────────────┐  │
│  │ USER SERVICE     │  │ DRIVER SERVICE   │ │RIDE SERVICE│  │
│  │ (Port 3001)      │  │ (Port 3002)      │ │(Port 3003) │  │
│  └──────────────────┘  └──────────────────┘ └────────────┘  │
│         │                    │                    │          │
│  ┌──────▼────────┐   ┌───────▼────────┐  ┌──────▼─────┐    │
│  │ userdb        │   │ captaindb      │  │ ridedb     │    │
│  └───────────────┘   └────────────────┘  └────────────┘    │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │     SHARED EVENT BUS (RabbitMQ/Kafka)                  │ │
│  │  - Ride Requested                                      │ │
│  │  - Driver Matched                                      │ │
│  │  - Ride Accepted                                       │ │
│  │  - Ride Started                                        │ │
│  │  - Location Updated                                    │ │
│  │  - Ride Completed                                      │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │     WEBSOCKET GATEWAY (Real-time Updates)              │ │
│  │  - Location streaming                                  │ │
│  │  - Status updates                                      │ │
│  │  - Driver matching notifications                       │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │     REDIS (Caching & Locking)                          │ │
│  │  - Active drivers cache                                │ │
│  │  - Ride locks (prevent double acceptance)              │ │
│  │  - Session management                                  │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 Data Ownership Matrix

#### USER SERVICE (Port 3001)
```
OWNS:
✅ User profiles
✅ Email/phone authentication
✅ Home/work addresses
✅ Payment methods & wallets
✅ User preferences
✅ User ratings
✅ Account status

CAN READ (via API calls):
🔍 Ride history (from Ride Service)
🔍 Completed rides (from Ride Service)
🔍 Ratings from drivers (from Ride Service)

CANNOT DIRECTLY ACCESS:
❌ Driver locations
❌ Driver profiles (use API)
❌ Ride assignments
❌ Real-time driver status
```

#### DRIVER SERVICE (Port 3002)
```
OWNS:
✅ Driver profiles
✅ License information
✅ Vehicle details
✅ Bank accounts
✅ Driver status (online/offline/busy)
✅ Real-time location
✅ Driver ratings
✅ Earnings & statistics
✅ Documents & verification

CAN READ (via API calls):
🔍 Ride requests (from Ride Service)
🔍 User info for rides (from User Service)
🔍 Completed ride details (from Ride Service)

CANNOT DIRECTLY ACCESS:
❌ User payment methods
❌ User home addresses (only ride pickup/dropoff)
❌ Other driver info
❌ User preferences
```

#### RIDE SERVICE (Port 3003)
```
OWNS:
✅ Ride requests & bookings
✅ Ride status & lifecycle
✅ Ride locations (pickup/dropoff)
✅ Fare calculations
✅ Current ride tracking
✅ Ride history
✅ Payment status for rides
✅ Ride-specific ratings & reviews

CAN READ (via API calls):
🔍 User profiles (from User Service)
🔍 Driver profiles (from Driver Service)
🔍 Driver availability (from Driver Service)
🔍 Payment methods (from User Service)

CANNOT DIRECTLY ACCESS:
❌ User passwords
❌ Driver bank details
❌ Driver license details
❌ User home addresses directly (only in ride context)
```

### 1.3 Inter-Service Dependencies

```
User Service
├── ← Read: Ride history (Ride Service)
└── → Provide: User auth, profile, payment info

Driver Service
├── ← Read: Ride requests, ride details
└── → Provide: Driver info, location, availability

Ride Service
├── ← Depends on: User auth, Driver availability
├── → Coordinates: Between User & Driver
└── ← Read from both services continuously
```

---

## 2. COMMUNICATION STRATEGY

### 2.1 When to Use Which Pattern

| Communication Type | Use Case | Technology |
|---|---|---|
| **Synchronous REST** | User registration, profile fetch, auth | HTTP REST API |
| **Event-Driven** | Ride requested, driver matched, status updated | RabbitMQ/Kafka |
| **WebSocket** | Real-time location updates, live tracking | Socket.io |
| **Polling** | Driver checking for new ride requests | HTTP (10-30s intervals) |
| **Caching** | Available drivers, active rides | Redis |

### 2.2 Communication Patterns

```
┌─────────────────────────────────────────────────────────┐
│         SYNCHRONOUS CALLS (HTTP REST)                   │
├─────────────────────────────────────────────────────────┤
│ • User login → User Service                             │
│ • Get user profile → User Service                       │
│ • Get driver info → Driver Service                      │
│ • Get ride details → Ride Service                       │
│ • Check driver availability → Driver Service            │
│ Critical path operations (need immediate response)       │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│      EVENT-DRIVEN (RabbitMQ/Kafka)                      │
├─────────────────────────────────────────────────────────┤
│ • RideRequested → Published by Ride Service             │
│ • DriverMatched → Published by Ride Service             │
│ • RideAccepted → Published by Driver Service            │
│ • RideStarted → Published by Driver Service             │
│ • RideCompleted → Published by Ride Service             │
│ • LocationUpdated → Published by Driver Service         │
│ • PaymentProcessed → Published by Ride Service          │
│ Non-critical updates, async processing, eventual sync   │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│         WEBSOCKET (Socket.io)                           │
├─────────────────────────────────────────────────────────┤
│ • Live location stream (driver → rider)                 │
│ • Ride status updates                                   │
│ • Driver matching notifications                         │
│ • Real-time chat (future)                               │
│ High frequency, bidirectional communication              │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│         REDIS CACHING                                   │
├─────────────────────────────────────────────────────────┤
│ • Active drivers list (geo-indexed)                     │
│ • User session tokens                                   │
│ • Ride status snapshots                                 │
│ • Ride locks (distributed locks)                        │
│ Fast access, short TTL, eventual consistency            │
└─────────────────────────────────────────────────────────┘
```

---

## 3. COMPLETE RIDE FLOW

### 3.1 Step-by-Step Ride Lifecycle

```
PHASE 1: RIDE REQUEST
═══════════════════════════════════════════════════════════
Step 1: User requests ride
  • User Service validates user exists
  • User Service checks payment method available
  • Ride Service creates ride with status=REQUESTED
  • Event: RideRequested published
  
Step 2: Available driver search
  • Ride Service queries available drivers (from Redis cache)
  • Uses geospatial index to find drivers within radius
  • Filters by: online status, ride type, rating, vehicle capacity
  • Event: AvailableDriversIdentified published
  
Step 3: Driver notification
  • Event consumer notifies drivers (WebSocket)
  • Drivers see ride request in app
  • Ride locked in Redis (prevent duplicate acceptance)

PHASE 2: DRIVER MATCHING
═══════════════════════════════════════════════════════════
Step 4: Driver accepts/rejects
  • Driver clicks accept in app
  • Distributed lock check (Redis)
    - If lock exists: "Ride already accepted"
    - If no lock: Acquire lock (TTL: 30 seconds)
  • Driver Service updates driver status to BUSY
  • Ride Service updates ride status to ACCEPTED
  • Event: RideAccepted published
  • Release other driver notifications

Step 5: Acceptance confirmation
  • User notified (WebSocket): "Driver assigned"
  • Driver notified: "Ride accepted"
  • User sees driver location, ETA
  • Driver sees pickup location

PHASE 3: PICKUP
═══════════════════════════════════════════════════════════
Step 6: Driver en route
  • Driver location updates streamed (WebSocket)
  • User sees live driver location
  • ETA calculated/updated
  • Event: DriverEnRoute published every 5 seconds

Step 7: Driver arrives
  • Driver taps "Arrived" button
  • Ride status → DRIVER_ARRIVED
  • User sees "Driver arrived"
  • User has 5 minutes to confirm pickup
  • Event: DriverArrived published

Step 8: Ride starts
  • User confirms pickup (taps "Ride Started")
  • OR Driver confirms after 5 min (auto-start)
  • Ride status → ONGOING
  • Meter starts (for metered pricing)
  • Event: RideStarted published
  • Driver Service: Location updates every 3 seconds

PHASE 4: ONGOING RIDE
═══════════════════════════════════════════════════════════
Step 9: Live tracking
  • Driver location streamed continuously (WebSocket)
  • User sees real-time driver position
  • Estimated arrival updated
  • User can cancel (with cancellation fee after 2 min)
  • Event: LocationUpdated published every 3s

Step 10: Ride in progress
  • Both parties see: elapsed time, distance, current fare estimate
  • Driver: Current route, next turn instructions
  • User: Driver's name, vehicle, rating
  • Can message driver (future feature)

PHASE 5: DROPOFF
═══════════════════════════════════════════════════════════
Step 11: Driver arrives at destination
  • Driver taps "Arrived at dropoff"
  • Ride status → ARRIVED_AT_DROPOFF
  • User sees "Driver arrived"
  • Event: ArrivedAtDropoff published

Step 12: User confirms pickup
  • User exits vehicle, taps "Trip complete"
  • OR Driver confirms after 3 min auto-complete
  • Final distance & duration recorded
  • Actual fare calculated (distance + time + surge + tolls)
  • Ride status → COMPLETED
  • Event: RideCompleted published

PHASE 6: PAYMENT & SETTLEMENT
═══════════════════════════════════════════════════════════
Step 13: Payment processing
  • Payment Service (new) processes payment
  • Amount deducted from user payment method
  • Automatic or manual confirmation
  • Ride status → PAYMENT_COMPLETED
  • Event: PaymentProcessed published

Step 14: Settlement
  • Driver earnings calculated (90% of fare + tips)
  • Commission deducted (10% to platform)
  • Driver's earnings added to account
  • User gets receipt
  • Event: SettlementCompleted published

PHASE 7: RATINGS & HISTORY
═══════════════════════════════════════════════════════════
Step 15: Rating prompt
  • User rated driver (1-5 stars, optional review)
  • Driver rates user (1-5 stars)
  • Ratings saved to respective services
  • Ride added to history for both
  • Event: RideRated published

Step 16: Availability reset
  • Driver status → ONLINE
  • Driver Service updates status
  • Driver becomes available for new rides
  • Session cleanup
```

### 3.2 State Diagram

```
                    ┌──────────────┐
                    │   REQUESTED  │
                    └───────┬──────┘
                            │
         ┌──────────────────┼──────────────────┐
         │                  │                  │
    CANCELLED           ACCEPTED          REJECTED
    (User/System)   (Driver accepts)  (Driver rejects)
                            │
                    ┌───────▼──────────┐
                    │  DRIVER_EN_ROUTE │
                    └───────┬──────────┘
                            │
                    ┌───────▼─────────────┐
                    │ DRIVER_ARRIVED      │
                    └───────┬─────────────┘
                            │
                    ┌───────▼──────┐
                    │   ONGOING    │
                    └───────┬──────┘
                            │
         ┌──────────────────┼──────────────────┐
         │                  │                  │
    CANCELLED          COMPLETED          FAILED
    (Mid-ride)      (Normal completion) (Driver/tech issue)
    (Fee applies)    │                    │
                     │                    │
              ┌──────▼──────┐      ┌──────▼────────┐
              │  PAYMENT    │      │  REFUND_       │
              │ PENDING     │      │  INITIATED     │
              └──────┬──────┘      └────────────────┘
                     │
              ┌──────▼──────────────┐
              │ PAYMENT_COMPLETED   │
              └──────┬───────────────┘
                     │
              ┌──────▼──────┐
              │  SETTLED    │
              │  (Final)    │
              └─────────────┘
```

---

## 4. API CONTRACTS BETWEEN SERVICES

### 4.1 Service-to-Service REST APIs

#### **User Service API** (Port 3001)
```yaml
Endpoints for other services:

1. Validate User Exists
   GET /api/users/validate/:userId
   Response:
   {
     "exists": true,
     "isActive": true,
     "isBanned": false,
     "name": "John Doe",
     "email": "john@example.com"
   }

2. Get User Profile (for ride display)
   GET /api/users/profile/:userId?fields=name,phone,rating
   Headers: Authorization: Bearer <service-token>
   Response:
   {
     "id": "user123",
     "firstName": "John",
     "lastName": "Doe",
     "phone": "9876543210",
     "rating": 4.8,
     "totalRides": 145
   }

3. Get User Payment Method
   GET /api/users/:userId/payment-method/:methodId
   Headers: Authorization: Bearer <service-token>
   Response:
   {
     "id": "pm_123",
     "type": "card",
     "last4": "4242",
     "isDefault": true
   }

4. Process User Credit Deduction (for refunds)
   POST /api/users/:userId/credit
   Headers: Authorization: Bearer <service-token>
   Body:
   {
     "amount": 50,
     "reason": "cancellation_refund",
     "rideId": "ride_123"
   }
   Response:
   {
     "success": true,
     "newBalance": 200,
     "transactionId": "txn_123"
   }

5. Add Ride to User History
   POST /api/users/:userId/ride-history
   Headers: Authorization: Bearer <service-token>
   Body:
   {
     "rideId": "ride_123",
     "driver": "driver_456",
     "fare": 125,
     "date": "2024-03-20T15:30:00Z"
   }
```

#### **Driver Service API** (Port 3002)
```yaml
Endpoints for other services:

1. Get Available Drivers (Geospatial)
   GET /api/captains/available
   ?latitude=28.7041&longitude=77.1025&radius=5000&rideType=economy
   Response:
   {
     "drivers": [
       {
         "id": "driver_123",
         "name": "Jane Smith",
         "location": {
           "lat": 28.7045,
           "lng": 77.1030
         },
         "vehicle": {
           "type": "Sedan",
           "color": "Silver",
           "plate": "DL01AB1234"
         },
         "rating": 4.9,
         "rideTypes": ["economy", "premium"],
         "distanceKm": 0.8,
         "eta": 3
       }
     ]
   }

2. Assign Ride to Driver
   POST /api/captains/:driverId/assign-ride
   Headers: Authorization: Bearer <service-token>
   Body:
   {
     "rideId": "ride_123",
     "pickupLat": 28.7041,
     "pickupLng": 77.1025,
     "dropoffLat": 28.5355,
     "dropoffLng": 77.2089,
     "passengerName": "John Doe"
   }
   Response:
   {
     "success": true,
     "acceptanceTimeout": 30,
     "estimatedPickupTime": 5
   }

3. Update Driver Status
   PUT /api/captains/:driverId/status
   Headers: Authorization: Bearer <service-token>
   Body:
   {
     "status": "ONLINE|OFFLINE|BUSY|UNAVAILABLE",
     "lastLocation": { "lat": 28.7041, "lng": 77.1025 }
   }
   Response:
   {
     "success": true,
     "activeRides": 1
   }

4. Get Driver Profile
   GET /api/captains/profile/:driverId?fields=name,vehicle,rating
   Headers: Authorization: Bearer <service-token>
   Response:
   {
     "id": "driver_123",
     "firstName": "Jane",
     "lastName": "Smith",
     "phone": "9876543211",
     "vehicle": {
       "make": "Toyota",
       "model": "Fortuner",
       "color": "Silver",
       "licensePlate": "DL01AB1234"
     },
     "rating": 4.9,
     "totalRides": 2341
   }

5. Add to Driver Earnings
   POST /api/captains/:driverId/earnings
   Headers: Authorization: Bearer <service-token>
   Body:
   {
     "rideId": "ride_123",
     "baseFare": 100,
     "tips": 10,
     "rideType": "economy",
     "distance": 5.2
   }
   Response:
   {
     "success": true,
     "totalEarnings": 15234,
     "todayEarnings": 450
   }

6. Get Active Rides
   GET /api/captains/:driverId/active-rides
   Headers: Authorization: Bearer <service-token>
   Response:
   {
     "activeRides": [
       {
         "rideId": "ride_123",
         "passenger": "John Doe",
         "status": "ONGOING",
         "pickup": { "lat": 28.7041, "lng": 77.1025 },
         "dropoff": { "lat": 28.5355, "lng": 77.2089 }
       }
     ]
   }
```

#### **Ride Service API** (Port 3003)
```yaml
Endpoints for other services:

1. Create Ride
   POST /api/rides
   Headers: Authorization: Bearer <user-token>
   Body:
   {
     "userId": "user_123",
     "pickup": {
       "address": "123 Main St, Delhi",
       "lat": 28.7041,
       "lng": 77.1025
     },
     "dropoff": {
       "address": "456 Park Ave, Delhi",
       "lat": 28.5355,
       "lng": 77.2089
     },
     "rideType": "economy",
     "passengerCount": 2,
     "specialRequests": "AC please"
   }
   Response:
   {
     "rideId": "ride_123",
     "status": "REQUESTED",
     "estimatedFare": 125,
     "estimatedTime": 12,
     "estimatedDistance": 5.2
   }

2. Accept Ride (Driver)
   PUT /api/rides/:rideId/accept
   Headers: Authorization: Bearer <driver-token>
   Body:
   {
     "driverId": "driver_123"
   }
   Response:
   {
     "success": true,
     "status": "ACCEPTED",
     "message": "Ride accepted successfully"
   }

3. Update Ride Location
   PUT /api/rides/:rideId/location
   Headers: Authorization: Bearer <driver-token>
   Body:
   {
     "driverId": "driver_123",
     "lat": 28.7045,
     "lng": 77.1030,
     "accuracy": 10,
     "timestamp": "2024-03-20T15:30:45Z"
   }
   Response:
   {
     "success": true,
     "updated": true
   }

4. Get Ride Details
   GET /api/rides/:rideId
   Headers: Authorization: Bearer <user-or-driver-token>
   Response:
   {
     "rideId": "ride_123",
     "userId": "user_123",
     "driverId": "driver_123",
     "status": "ONGOING",
     "fare": {
       "baseFare": 100,
       "distance": 5.2,
       "time": 12,
       "surge": 1.5,
       "total": 158
     },
     "pickup": {...},
     "dropoff": {...},
     "startedAt": "2024-03-20T15:30:00Z",
     "driverLocation": { "lat": 28.7045, "lng": 77.1030 }
   }

5. Complete Ride
   PUT /api/rides/:rideId/complete
   Headers: Authorization: Bearer <driver-token>
   Body:
   {
     "driverId": "driver_123",
     "actualDistance": 5.3,
     "actualTime": 14,
     "endLat": 28.5360,
     "endLng": 77.2090
   }
   Response:
   {
     "success": true,
     "rideId": "ride_123",
     "finalFare": 165,
     "paymentStatus": "PENDING"
   }

6. Cancel Ride
   PUT /api/rides/:rideId/cancel
   Headers: Authorization: Bearer <user-or-driver-token>
   Body:
   {
     "cancelledBy": "user|driver|system",
     "reason": "traffic|changed_mind|driver_delayed",
     "rideStatus": "current_ride_status"
   }
   Response:
   {
     "success": true,
     "cancellationFee": 10,
     "refundAmount": 125
   }
```

---

## 5. SHARED DATA STRATEGY

### 5.1 Database Architecture

```
SEPARATE DATABASES (Recommended)
═════════════════════════════════════════════════════════════

❌ ANTI-PATTERN: All services using single "ridedb"
   Problem: Tight coupling, cascading failures, scaling issues

✅ PATTERN: Each service owns its data

┌────────────────────────────────────────────────────────┐
│ USER SERVICE (Port 3001)                               │
├────────────────────────────────────────────────────────┤
│ Database: userdb                                        │
│ Collections:                                            │
│ • users                                                 │
│ • payment_methods                                       │
│ • user_addresses                                        │
│ • user_ratings                                          │
│ • ride_history (denormalized cache)                     │
└────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────┐
│ DRIVER SERVICE (Port 3002)                              │
├────────────────────────────────────────────────────────┤
│ Database: captaindb                                     │
│ Collections:                                            │
│ • drivers                                               │
│ • vehicles                                              │
│ • bank_accounts                                         │
│ • driver_earnings                                       │
│ • driver_ratings                                        │
│ • driver_documents                                      │
│ • driver_status_log                                     │
└────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────┐
│ RIDE SERVICE (Port 3003)                                │
├────────────────────────────────────────────────────────┤
│ Database: ridedb                                        │
│ Collections:                                            │
│ • rides (main collection)                               │
│ • ride_locations (time-series)                          │
│ • ride_payments                                         │
│ • ride_ratings                                          │
│ • ride_history                                          │
└────────────────────────────────────────────────────────┘

SHARED INFRASTRUCTURE:
┌────────────────────────────────────────────────────────┐
│ REDIS CACHE (Fast access, TTL)                         │
├────────────────────────────────────────────────────────┤
│ active_drivers:             GEO-indexed                │
│ user_sessions:              30 min TTL                 │
│ driver_sessions:            30 min TTL                 │
│ ride_locks:                 30 sec TTL                 │
│ driver_status:              5 min TTL                  │
│ recent_rides:               Sliding window             │
└────────────────────────────────────────────────────────┘
```

### 5.2 Data Sync Strategy (Event-Driven)

```
EVENT-DRIVEN SYNC FLOW
═════════════════════════════════════════════════════════════

Scenario: Driver accepts ride

1. User Service creates ride, publishes:
   {
     "type": "RideRequested",
     "rideId": "ride_123",
     "userId": "user_123",
     "timestamp": "2024-03-20T15:30:00Z"
   }

2. Ride Service listens, saves ride to ridedb

3. Ride Service publishes:
   {
     "type": "AvailableDriversIdentified",
     "rideId": "ride_123",
     "driverIds": ["driver_123", "driver_456", "driver_789"]
   }

4. Driver Service:
   - Notifies drivers via WebSocket
   - Driver clicks accept
   - Driver Service publishes:
     {
       "type": "RideAccepted",
       "rideId": "ride_123",
       "driverId": "driver_123",
       "timestamp": "2024-03-20T15:30:15Z"
     }

5. Ride Service:
   - Updates ride.driverId = "driver_123"
   - Updates ride.status = "ACCEPTED"
   - Publishes:
     {
       "type": "RideAssignmentConfirmed",
       "rideId": "ride_123",
       "driverId": "driver_123",
       "driverName": "Jane Smith",
       "vehicle": { "make": "Toyota", "color": "Silver" }
     }

6. User Service:
   - Caches ride assignment in Redis for quick access
   - User app receives notification

7. Driver Service:
   - Updates driver.status = "BUSY"
   - Updates driver.currentRide = "ride_123"
   - Updates active_drivers Redis cache

EVENTUAL CONSISTENCY:
- User Service doesn't immediately know driver name
- Gets it from event notification or via REST API call
- Caches for 5 minutes
- Acceptable delay: < 100ms (via events)
```

### 5.3 Data Denormalization Strategy

```
DENORMALIZATION (Smart Caching)
═════════════════════════════════════════════════════════════

Ride Service cache (ridedb):
  ride_123: {
    "userId": "user_123",
    "driverId": "driver_123",
    
    // Denormalized user info (cached)
    "user": {
      "name": "John Doe",
      "phone": "9876543210",
      "rating": 4.8
    },
    
    // Denormalized driver info (cached)
    "driver": {
      "name": "Jane Smith",
      "phone": "9876543211",
      "vehicle": "Toyota Fortuner (DL01AB1234)",
      "rating": 4.9
    },
    
    // Original reference IDs (for validation)
    "status": "ONGOING"
  }

Update Strategy:
1. User rates driver after ride → Driver Service event
2. Ride Service receives event
3. Updates ride.driver.rating (cache)
4. Next query includes updated rating
5. User Service also updates its cache

Sync happens via events (asynchronous, acceptable delay 1-2 seconds)
```

---

## 6. SERVICE DEPENDENCIES & INTER-SERVICE CALLS

### 6.1 Dependency Chain

```
REQUEST → USER SERVICE → RIDE SERVICE → DRIVER SERVICE
            ↓                ↓                ↓
          userdb           ridedb          captaindb

1. User requests ride:
   • User Service validates user exists & has payment method
   • Ride Service called (sync REST)
   
2. Ride Service creates ride:
   • Queries Driver Service for available drivers (sync REST)
   • Locks ride in Redis
   • Publishes RideRequested event
   
3. Driver Service notifies drivers:
   • Receives WebSocket connection from available drivers
   • Sends ride details to their clients
   
4. Driver accepts:
   • Driver Service updates driver status (own DB)
   • Publishes RideAccepted event
   
5. Ride Service processes acceptance:
   • Verifies Redis lock still valid
   • Updates ride in ridedb
   • Publishes RideAssignmentConfirmed event
   
6. User Service gets confirmation:
   • Receives event
   • Updates local cache
   • Notifies user via WebSocket
```

### 6.2 Implementation Code Structure

```
user-service/
├── src/
│   ├── controllers/
│   │   └── auth.controller.js
│   ├── services/
│   │   ├── user.service.js
│   │   └── external-service-client.js  ← Ride Service calls
│   └── events/
│       ├── publishers/
│       │   └── user.publisher.js
│       └── subscribers/
│           └── ride.subscriber.js

driver-service/
├── src/
│   ├── controllers/
│   │   └── driver.controller.js
│   ├── services/
│   │   ├── driver.service.js
│   │   └── geospatial.service.js
│   └── events/
│       ├── publishers/
│       │   └── driver.publisher.js
│       └── subscribers/
│           └── ride.subscriber.js

ride-service/
├── src/
│   ├── controllers/
│   │   └── ride.controller.js
│   ├── services/
│   │   ├── ride.service.js
│   │   ├── matching.service.js
│   │   ├── user-service-client.js     ← User Service API
│   │   └── driver-service-client.js   ← Driver Service API
│   ├── events/
│   │   ├── publishers/
│   │   │   └── ride.publisher.js
│   │   └── subscribers/
│   │       ├── driver.subscriber.js
│   │       └── user.subscriber.js
│   └── middleware/
│       ├── concurrency.middleware.js  ← Lock management
│       └── circuit-breaker.js         ← Fault tolerance
```

---

## 7. CONCURRENCY HANDLING

### 7.1 Problem: Double Acceptance

```
SCENARIO: Race Condition
═════════════════════════════════════════════════════════════

Driver A sees: "New ride, $50 fare"  →  Clicks "Accept"
Driver B sees: "New ride, $50 fare"  →  Clicks "Accept" (at same time)

WITHOUT LOCKING:
❌ Both accepted as drivers
❌ System can't fulfill both
❌ Money charged twice
❌ User gets confused

WITH REDIS DISTRIBUTED LOCKING:
✅ Driver A's accept succeeds
✅ Driver B's accept fails (lock already set)
✅ Ride assigned to Driver A
✅ Driver B notified: "Ride taken"
```

### 7.2 Redis Locking Implementation

```javascript
// Lock acquisition (in Ride Service)
const acquireRideLock = async (rideId, driverId) => {
  const lockKey = `ride:lock:${rideId}`;
  const lockValue = driverId; // Store driver ID in lock
  const ttl = 30; // 30 seconds (acceptance timeout)
  
  // NX = only set if not exists
  // EX = expire after N seconds
  const acquired = await redis.set(
    lockKey,
    lockValue,
    'NX',
    'EX',
    ttl
  );
  
  return acquired; // true if lock acquired, false if already locked
};

// In driver accept endpoint
app.put('/api/rides/:rideId/accept', async (req, res) => {
  const { rideId } = req.params;
  const { driverId } = req.body;
  
  // Try to acquire lock
  const lockAcquired = await acquireRideLock(rideId, driverId);
  
  if (!lockAcquired) {
    // Another driver got it first
    return res.status(409).json({
      success: false,
      message: 'Ride already accepted by another driver'
    });
  }
  
  try {
    // Update database
    const ride = await Ride.findByIdAndUpdate(
      rideId,
      { driverId, status: 'ACCEPTED' },
      { new: true }
    );
    
    // Publish event
    publishEvent('RideAccepted', { rideId, driverId });
    
    res.json({ success: true, ride });
  } catch (error) {
    // Release lock on error
    await redis.del(`ride:lock:${rideId}`);
    throw error;
  }
});
```

### 7.3 MongoDB Transactions (for consistency)

```javascript
// When updating multiple collections atomically
const session = await mongoose.startSession();
session.startTransaction();

try {
  // Update ride
  await Ride.updateOne(
    { _id: rideId, status: 'REQUESTED' }, // Only if still requested
    { $set: { driverId, status: 'ACCEPTED', acceptedAt: new Date() } },
    { session }
  );
  
  // Update driver status
  await Driver.updateOne(
    { _id: driverId },
    { $set: { status: 'BUSY', currentRide: rideId } },
    { session }
  );
  
  // Commit transaction
  await session.commitTransaction();
} catch (error) {
  await session.abortTransaction();
  throw error;
} finally {
  await session.endSession();
}
```

---

## 8. REAL-TIME UPDATES ARCHITECTURE

### 8.1 WebSocket Gateway

```
WEBSOCKET FLOW
═════════════════════════════════════════════════════════════

User App               Driver App              Server
    │                     │                      │
    ├─ Connect ─────────────────────────────────>│
    │                                            │ socket.io connection
    │                     ├─ Connect ───────────>│
    │                     │                      │ socket.io connection
    │                     │                      │
    │  [User requests ride] ──────────────────────>│ emit('ride:request')
    │                                            │ 
    │                                            ├─ Query Driver Service
    │                                            │ (available drivers near user)
    │                                            │
    │                     <─ RideNotification ─── │ emit('ride:new', rideDetails)
    │                     │ (ride details)       │
    │                     │ (driver location)    │
    │                     │ (fare estimate)      │
    │                     │                      │
    │                     ├─ Accept ────────────>│ emit('ride:accept')
    │                     │                      │
    │ <─ Notification ──────────────────────────── │ emit('driver:assigned', driverInfo)
    │   (driver assigned)  │                      │
    │                      │                      │
    │   [Ride starts]      │                      │
    │                      │                      │
    │    ──────────────────────────────────────>│ emit('location:update', { lat, lng })
    │    (user location)   │                      │
    │                      │                      │
    │                      ├─ Location Stream ──>│ emit('location:update', { lat, lng })
    │                      │ every 3 seconds      │
    │ <─ Location Update ───────────────────────── │ emit('driver:location', { lat, lng })
    │    (driver location) │                      │
    │    every 3 seconds   │                      │
```

### 8.2 WebSocket Server Setup

```javascript
// websocket-gateway.js
const io = require('socket.io')(server, {
  cors: { origin: '*' }
});

const redis = require('redis');
const pubClient = redis.createClient();
const subClient = redis.createClient();

// Use Redis adapter for horizontal scaling
const { createAdapter } = require('@socket.io/redis-adapter');
io.adapter(createAdapter(pubClient, subClient));

// Namespace for drivers
io.of('/drivers').on('connection', (socket) => {
  const driverId = socket.handshake.auth.driverId;
  
  // Join driver room
  socket.join(`driver:${driverId}`);
  
  // Subscribe to driver's ride requests
  socket.on('driver:ready', async () => {
    const location = socket.handshake.auth.location; // { lat, lng }
    
    // Set driver as online in Redis
    await redis.geoadd(
      'active_drivers',
      location.lng,
      location.lat,
      driverId
    );
  });
  
  // Location updates from driver
  socket.on('location:update', async (data) => {
    const { lat, lng } = data;
    
    // Update driver location in Redis
    await redis.geoadd('active_drivers', lng, lat, driverId);
    
    // Broadcast to users in this ride
    const ride = await Ride.findOne({ driverId });
    if (ride) {
      io.of('/users')
        .to(`ride:${ride._id}`)
        .emit('driver:location', { lat, lng, driverId });
    }
  });
  
  socket.on('disconnect', async () => {
    await redis.zrem('active_drivers', driverId);
  });
});

// Namespace for users
io.of('/users').on('connection', (socket) => {
  const userId = socket.handshake.auth.userId;
  socket.join(`user:${userId}`);
  
  socket.on('ride:request', async (data) => {
    const ride = await createRide(userId, data);
    
    // Join user to ride room
    socket.join(`ride:${ride._id}`);
    
    // Notify nearby drivers
    const nearbyDrivers = await findNearbyDrivers(data.pickup);
    nearbyDrivers.forEach(driver => {
      io.of('/drivers')
        .to(`driver:${driver._id}`)
        .emit('ride:new', {
          rideId: ride._id,
          pickup: ride.pickupLocation,
          fare: ride.estimatedFare,
          eta: ride.estimatedTime
        });
    });
  });
});
```

### 8.3 Real-time Location Broadcasting

```javascript
// Driver sends location every 3 seconds
setInterval(() => {
  socket.emit('location:update', {
    lat: currentLat,
    lng: currentLng,
    accuracy: 10,
    timestamp: Date.now()
  });
}, 3000);

// Server receives and broadcasts to ride participants
io.of('/drivers').on('location:update', async (data) => {
  const { lat, lng, driverId } = data;
  
  // Find ride
  const ride = await Ride.findOne({ 
    driverId,
    status: { $in: ['ACCEPTED', 'ONGOING'] }
  });
  
  if (ride) {
    // Broadcast to user
    io.of('/users')
      .to(`ride:${ride._id}`)
      .emit('driver:location', {
        lat,
        lng,
        driverId,
        timestamp: Date.now()
      });
    
    // Save location to time-series database (optional)
    await RideLocation.create({
      rideId: ride._id,
      driverId,
      location: { type: 'Point', coordinates: [lng, lat] },
      timestamp: new Date()
    });
  }
});
```

---

## 9. FAILURE HANDLING & RECOVERY

### 9.1 Failure Scenarios

```
SCENARIO 1: Driver Accepts but App Crashes
═════════════════════════════════════════════════════════════

Step 1: Driver clicks accept
  ├─ Redis lock acquired
  ├─ Database updated
  ├─ Event published
  └─ App crashes before response sent

Step 2: User sees "Waiting for response"
  └─ Timeout after 30 seconds

Step 3: System recovery
  ├─ Check ride status → Still ACCEPTED (in DB)
  ├─ Driver comes back online
  ├─ Sync status with driver app
  └─ Driver sees "You have an active ride"


SCENARIO 2: Driver Accepts but Doesn't Arrive
═════════════════════════════════════════════════════════════

Step 1: Ride accepted, 5 minute timer starts
Step 2: Driver goes offline (network failure)
Step 3: No location updates for 5 minutes
Step 4: System action:
  ├─ Auto-cancel ride
  ├─ Release driver (status → ONLINE)
  ├─ Refund user
  └─ Blacklist driver for 30 minutes


SCENARIO 3: Payment Fails
═════════════════════════════════════════════════════════════

Step 1: Ride completed, payment requested
Step 2: Payment gateway times out
Step 3: Ride status → PAYMENT_PENDING
Step 4: Retry logic:
  ├─ Retry 1: 1 minute later
  ├─ Retry 2: 5 minutes later
  ├─ Retry 3: 30 minutes later
Step 5: If all fail:
  ├─ Driver still gets 50% (next day)
  ├─ Alert finance team
  └─ User gets payment link via email


SCENARIO 4: Driver Service Down
═════════════════════════════════════════════════════════════

Step 1: User requests ride
Step 2: Ride Service tries to fetch available drivers
Step 3: Driver Service endpoint times out
Step 4: Circuit breaker opens (after 5 failures)
Step 5: Fallback behavior:
  ├─ Use cached driver list (Redis)
  ├─ Notify user: "Finding drivers..."
  ├─ Async retry in background
  └─ Send email if not resolved in 2 min
```

### 9.2 Circuit Breaker Pattern

```javascript
// circuit-breaker.js
class CircuitBreaker {
  constructor(fn, options = {}) {
    this.fn = fn;
    this.failureCount = 0;
    this.state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
    this.failureThreshold = options.failureThreshold || 5;
    this.resetTimeout = options.resetTimeout || 60000; // 1 min
  }
  
  async execute(args) {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime > this.resetTimeout) {
        this.state = 'HALF_OPEN';
      } else {
        throw new Error('Circuit breaker is OPEN');
      }
    }
    
    try {
      const result = await this.fn(args);
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }
  
  onSuccess() {
    this.failureCount = 0;
    this.state = 'CLOSED';
  }
  
  onFailure() {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    
    if (this.failureCount >= this.failureThreshold) {
      this.state = 'OPEN';
    }
  }
}

// Usage
const driverServiceBreaker = new CircuitBreaker(
  async (args) => {
    return await axios.get('http://driver-service:3002/api/captains/available', args);
  },
  { failureThreshold: 5, resetTimeout: 60000 }
);

// In Ride Service
try {
  const drivers = await driverServiceBreaker.execute({ params });
} catch (error) {
  if (error.message.includes('Circuit breaker')) {
    // Use cached drivers
    const cachedDrivers = await redis.get(`cached_drivers:${location}`);
    return cachedDrivers;
  }
}
```

### 9.3 Timeout & Retry Logic

```javascript
// timeout + retry wrapper
async function executeWithRetry(fn, options = {}) {
  const {
    maxRetries = 3,
    timeout = 5000,
    backoff = (attempt) => Math.min(1000 * Math.pow(2, attempt), 30000)
  } = options;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await Promise.race([
        fn(),
        new Promise((_, reject) =>
          setTimeout(
            () => reject(new Error('Timeout')),
            timeout
          )
        )
      ]);
    } catch (error) {
      if (attempt < maxRetries) {
        const delay = backoff(attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }
}

// Usage
const drivers = await executeWithRetry(
  () => driverServiceClient.getAvailableDrivers(location),
  {
    maxRetries: 3,
    timeout: 5000,
    backoff: (attempt) => 1000 * Math.pow(2, attempt)
  }
);
```

### 9.4 Dead Letter Queue (Failed Events)

```javascript
// Event publishing with DLQ
class EventPublisher {
  async publish(event) {
    try {
      await this.messageQueue.publish(event.type, event);
    } catch (error) {
      // Publish to Dead Letter Queue
      await this.dlq.push({
        event,
        error: error.message,
        timestamp: new Date(),
        attempts: 1
      });
      
      // Alert monitoring
      this.alertMonitoring('Event publish failed', { event, error });
    }
  }
}

// Periodic DLQ processor
setInterval(async () => {
  const failedEvents = await dlq.getAll();
  
  for (const item of failedEvents) {
    if (item.attempts > 5) {
      // Give up after 5 attempts
      await alertOps('Event lost', item);
      await dlq.remove(item.id);
    } else {
      try {
        await messageQueue.publish(item.event.type, item.event);
        await dlq.remove(item.id);
      } catch (error) {
        item.attempts++;
        await dlq.update(item.id, item);
      }
    }
  }
}, 300000); // Every 5 minutes
```

---

## 10. COMPLETE IMPLEMENTATION SUMMARY

This completes the architectural design. Next document will include:
- Complete folder structure
- Service client implementations
- Event subscriber implementations
- Code examples for each major flow
- Testing strategies
- Deployment configuration

```

---

**Document Status**: Architecture & Design Complete
**Ready for**: Implementation Phase 2
