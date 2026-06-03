# E2E Testing Scenarios

## Rider Flow Testing

### Scenario 1: Complete Rider Journey (Sign up → Book → Track → Complete → Rate)

**Step 1: Landing Page**
- [ ] Load app, see landing page with role selection
- [ ] See "Ride" and "Drive" buttons
- [ ] Click "Ride as Passenger" button

**Step 2: Rider Signup**
- [ ] Navigate to signup page
- [ ] Enter valid email: `rider1@test.com`
- [ ] Enter password with: uppercase, number, special char (e.g., `Test@1234`)
- [ ] Enter first name: `John`
- [ ] Enter last name: `Doe`
- [ ] Enter phone: `(555) 123-4567`
- [ ] Click "Create Account"
- [ ] Verify redirect to rider dashboard

**Step 3: Rider Dashboard**
- [ ] See personalized greeting: "Where to, John?"
- [ ] See "Quick Book" card with search button
- [ ] See "Saved Places" (Home, Work)
- [ ] See recent rides list

**Step 4: Book a Ride**
- [ ] Click "Search Ride" or "Book a Ride"
- [ ] Enter pickup: `123 Main St, Downtown`
- [ ] Enter dropoff: `456 Park Ave, Uptown`
- [ ] Select ride type: Economy (default)
- [ ] Click "See Available Rides"
- [ ] Verify fare estimate appears ($15.99)
- [ ] See fare breakdown: base + distance + surge
- [ ] Click "Request Ride"

**Step 5: Ride Requested (Waiting for Driver)**
- [ ] See "Finding a driver..." with loading animation
- [ ] See ride status timeline: Ride Requested → (waiting)
- [ ] See "Cancel Request" button
- [ ] After 2 seconds, driver appears
- [ ] See driver card: John Smith, ⭐ 4.8, 1250 trips
- [ ] See vehicle: ABC-1234, 5 min away, 2.3 km

**Step 6: Track Live Ride**
- [ ] See live map with driver marker (animated)
- [ ] See ETA countdown: 5 min → 4 min → etc.
- [ ] See distance decreasing: 2.3 km → 1.8 km → etc.
- [ ] See driver info card with call/message buttons
- [ ] Status updates: Accepted → Arriving → Started

**Step 7: Ride Completed**
- [ ] See "Ride Completed!" screen
- [ ] Display: $15.99, 8.5 km, 18 min
- [ ] See "Back to Home" button

**Step 8: Rate Driver**
- [ ] See rating screen with driver photo
- [ ] Click 5-star rating (★★★★★)
- [ ] See "Excellent" feedback text
- [ ] Optional: Enter review text
- [ ] Click "Submit Rating"
- [ ] Return to dashboard
- [ ] Verify ride appears in history with ⭐ 5 rating

**Step 9: Ride History**
- [ ] Click "View All" or navigate to Ride History
- [ ] See completed ride: Downtown → Airport, $15.99, May 28
- [ ] See rating: ⭐ 5
- [ ] See trip count, distance, duration
- [ ] Click ride for details

---

## Driver Flow Testing

### Scenario 2: Complete Driver Journey (Sign up → Online → Accept → Navigate → Complete → Earnings)

**Step 1: Driver Signup**
- [ ] From landing page, click "Drive"
- [ ] Navigate to driver signup

**Step 2: Driver Signup - Step 1 (Basic Info)**
- [ ] Enter first name: `Jane`
- [ ] Enter last name: `Smith`
- [ ] Enter email: `driver1@test.com`
- [ ] Enter password: `Driver@1234`
- [ ] Enter phone: `(555) 987-6543`
- [ ] Click "Next" or "Continue"

**Step 3: Driver Signup - Step 2 (Vehicle Info)**
- [ ] Enter vehicle make: `Honda`
- [ ] Enter vehicle model: `Civic`
- [ ] Enter color: `Black`
- [ ] Enter license plate: `ABC-1234`
- [ ] Click "Next"

**Step 4: Driver Signup - Step 3 (Documents)**
- [ ] Upload driver's license image
- [ ] Upload vehicle registration image
- [ ] Upload insurance certificate image
- [ ] Upload pollution certificate image
- [ ] Click "Next"

**Step 5: Driver Signup - Step 4 (Bank Account)**
- [ ] Enter bank name: `Chase Bank`
- [ ] Enter account number: `****1234`
- [ ] Enter routing number
- [ ] Click "Complete Signup"
- [ ] See "Verification Pending" message
- [ ] Redirect to driver dashboard

**Step 6: Driver Dashboard**
- [ ] See "Welcome, Jane!"
- [ ] See online/offline toggle (currently Offline - 🔴)
- [ ] See vehicle status: Honda Civic, ABC-1234
- [ ] See documents status: ✓ Verified
- [ ] See quick actions: Earnings, History, Profile

**Step 7: Go Online**
- [ ] Click "Go Online Now"
- [ ] Toggle changes to 🟢 Online
- [ ] See "You're accepting ride requests"
- [ ] See income summary card (today's earnings)
- [ ] See "Available Rides Near You" section

**Step 8: Receive Ride Request**
- [ ] Bottom sheet notification pops up
- [ ] See: "New Ride Request"
- [ ] Passenger: John Doe, ⭐ 4.8, 45 trips
- [ ] Pickup: 123 Main St, Downtown
- [ ] Dropoff: 456 Park Ave, Uptown
- [ ] Distance: 8.5 km, ETA: 5 min
- [ ] Fare: $15.99
- [ ] Two buttons: "Reject" and "Accept Ride"

**Step 9: Accept Ride**
- [ ] Click "Accept Ride"
- [ ] Notification disappears
- [ ] Navigate to Active Ride page

**Step 10: Navigation to Pickup**
- [ ] See live map with route to pickup
- [ ] See "Navigation Guide"
- [ ] Pickup address: 123 Main St, Downtown
- [ ] Distance: 2.3 km, ETA: 5 min
- [ ] See turn-by-turn: "Turn right on Main St"
- [ ] See passenger info: John Doe, ⭐ 4.8
- [ ] ETA countdown: 5 min → 4 min → 1 min

**Step 11: Mark Arrived**
- [ ] Click "✓ Arrived" button
- [ ] Status updates to "Arrived at Pickup"
- [ ] Passenger notified (in real-time via socket)
- [ ] Timeline shows: ✓ En Route, ✓ Arrived, → Ride Started

**Step 12: Start Ride (Passenger Boarded)**
- [ ] Passenger gets in vehicle
- [ ] Click "Start Ride" button
- [ ] Status: Ride Started
- [ ] Route updates to: Dropoff address
- [ ] ETA updates for dropoff: ~18 min

**Step 13: Complete Ride**
- [ ] Arrive at dropoff: 456 Park Ave, Uptown
- [ ] Click "Complete Ride"
- [ ] Ride marked as completed
- [ ] Summary: 8.5 km, 18 min, $15.99
- [ ] Redirect to dashboard

**Step 14: Check Earnings**
- [ ] Click "Earnings" or "💰 Earnings"
- [ ] See today's earnings: $15.99
- [ ] See this trip listed: John Doe → $15.99, ⭐ 5
- [ ] See weekly breakdown graph
- [ ] See performance metrics: 92% acceptance, 2% cancellation
- [ ] See payout method: Chase Bank ****1234

**Step 15: Rate Passenger**
- [ ] Passenger submits rating
- [ ] Driver receives notification
- [ ] See passenger review in earnings/history

**Step 16: Go Offline**
- [ ] Dashboard: Click "Go Offline"
- [ ] Status: 🔴 Offline
- [ ] Message: "No rides available"
- [ ] Ride requests stop coming

---

## API Integration Testing

### Authentication
- [ ] Login with valid credentials → returns JWT token
- [ ] Login with invalid credentials → 401 error
- [ ] Token refresh on 401 response
- [ ] Logout clears token and redirects

### Ride Operations
- [ ] Request ride POST → creates ride, returns ride_id
- [ ] Get ride status → returns current status
- [ ] Update ride location → broadcasts via socket
- [ ] Cancel ride → updates status, notifies both parties
- [ ] Complete ride → processes payment, triggers rating prompt

### Real-Time Updates (Socket.IO)
- [ ] Connect to socket on login
- [ ] Receive `rideRequested` event (driver receives request)
- [ ] Receive `rideAccepted` event (rider notified)
- [ ] Receive `driverLocationUpdated` event (every 5 sec)
- [ ] Receive `rideCompleted` event (both parties notified)
- [ ] Disconnect on logout

### Location Tracking
- [ ] Geolocation permission granted
- [ ] Get current location on app load
- [ ] Watch position every 5 seconds during ride
- [ ] Update location via API and socket
- [ ] Stop tracking on ride completion

---

## Error Handling Testing

### Network Errors
- [ ] Turn off wifi/network → graceful degradation
- [ ] API timeout (>10s) → show error toast
- [ ] 500 server error → "Server error. Please try again"
- [ ] Auto-retry on network reconnection

### Validation Errors
- [ ] Submit empty form → highlight required fields
- [ ] Invalid email → "Please enter a valid email"
- [ ] Weak password → "Password must include uppercase, number, special char"
- [ ] Invalid phone → "Invalid phone number format"

### Authentication Errors
- [ ] Expired token → redirect to login
- [ ] Invalid credentials → "Invalid email or password"
- [ ] Signup with existing email → "Email already exists"

---

## Responsive Design Testing

### Mobile (320px - 480px)
- [ ] All text readable without horizontal scroll
- [ ] Buttons touch-friendly (44px min height)
- [ ] Forms single column layout
- [ ] Bottom navigation visible
- [ ] Maps fit screen with controls

### Tablet (768px - 1024px)
- [ ] Two-column layouts appear
- [ ] Grid shows 2 items per row
- [ ] Sidebar visible (not collapsed)
- [ ] Optimized spacing

### Desktop (1024px+)
- [ ] Three-column layouts
- [ ] Full sidebar navigation
- [ ] Optimized container width (1200px max)
- [ ] All features visible without scrolling

---

## Performance Testing

- [ ] First load < 3s (Lighthouse > 90)
- [ ] Interaction latency < 100ms
- [ ] Location update realtime (< 1s socket delay)
- [ ] Map rendering smooth (60 FPS)
- [ ] No memory leaks after 1 hour usage

---

## Checklist for Manual QA

### Pre-Deployment
- [ ] All pages load without errors
- [ ] All buttons/links work
- [ ] Forms validate correctly
- [ ] Real-time updates work (socket connected)
- [ ] Maps load and respond
- [ ] Notifications appear correctly
- [ ] Error boundaries catch crashes
- [ ] Offline mode graceful
- [ ] Token refresh works
- [ ] Responsive on 3 breakpoints
