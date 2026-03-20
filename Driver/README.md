# Captain Microservice

Captain (Driver) management microservice for the Uber-like ride-sharing application.

## Features

- Captain/Driver registration and authentication
- Driver profile management
- License and vehicle information tracking
- Document verification system
- Bank account management for payouts
- Address management with geospatial support
- Driver ratings and statistics
- Preferences and ride type selection
- Real-time location tracking

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file with the following variables:
```
PORT=3002
JWT_SECRET=your_jwt_secret_key
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/captaindb
```

3. Ensure MongoDB is running on your machine

## Scripts

- `npm start` - Start the server in production mode
- `npm run dev` - Start the server with auto-reload (requires nodemon)

## Project Structure

```
captain/
├── controllers/        # Request handlers
│   └── controller.user.js
├── models/            # Database schemas
│   └── captain.model.js
├── routes/            # API routes
│   └── user.routes.js
├── middleware/        # Custom middleware
│   └── auth.middleware.js
├── utils/             # Utility functions
│   ├── validation.js
│   └── errorHandler.js
├── db/                # Database connection
│   └── db.js
├── app.js             # Express app setup
├── server.js          # Server entry point
├── package.json
└── .env               # Environment variables
```

## API Endpoints

### Authentication
- `POST /api/captains/register` - Register new captain
- `POST /api/captains/login` - Captain login
- `POST /api/captains/logout` - Captain logout

### Profile
- `GET /api/captains/profile/:userId` - Get captain profile
- `PUT /api/captains/profile/:userId` - Update profile
- `PUT /api/captains/change-password/:userId` - Change password
- `DELETE /api/captains/account/:userId` - Delete account

### Address
- `PUT /api/captains/home-address/:userId` - Update home address

### Bank Account
- `POST /api/captains/bank-account/:userId` - Add bank account
- `DELETE /api/captains/bank-account/:userId/:accountId` - Remove bank account

### Preferences
- `PUT /api/captains/preferences/:userId` - Update driver preferences

### Admin
- `GET /api/captains/all-captains` - Get all captains

## Captain Schema

### Personal Information
- firstName, lastName, email, phone, profilePicture

### License & Verification
- licenseNumber, licenseExpiry, licenseVerified
- licenseDocument

### Vehicle Information
- make, model, color, year
- licensePlate, vin
- registrationExpiry, registrationVerified
- insuranceExpiry, insuranceVerified
- pollutionCertificate, pollutionExpiryDate
- seatingCapacity
- vehicleType (sedan, suv, hatchback, premium)

### Bank Account
- accountHolderName, accountNumber, ifscCode, bankName
- accountVerified

### Ratings & Statistics
- rating (1-5)
- totalRatings, totalRides
- totalEarnings, totalHours

### Verification & Documents
- backgroundCheckPassed, backgroundCheckDate
- policeVerificationPassed, policeVerificationDate
- aadharVerified, aadharNumber
- panVerified, panNumber

### Account Status
- isActive, isOnline, isVerified, isBanned, banReason

### Driver Preferences
- acceptRideRequests
- rideTypes (economy, premium, xl)
- acceptPooledRides
- musicPreference, tempaturePreference
- conversationLevel

### Location Tracking
- homeAddress (with coordinates)
- currentLocation (real-time position)
- lastLocationUpdate

## Dependencies

- **express** - Web framework
- **mongoose** - MongoDB ODM
- **bcrypt** - Password hashing
- **jsonwebtoken** - JWT authentication
- **dotenv** - Environment variables
- **cookie-parser** - Cookie parsing
- **morgan** - HTTP request logger

## Development

To start developing with auto-reload:

```bash
npm install -g nodemon
npm run dev
```

## Error Handling

All errors are handled with proper HTTP status codes and error messages. The application uses a custom error handler middleware.

## Notes

- All passwords are hashed using bcrypt before storing
- JWT tokens are valid for 7 days
- Phone numbers and license plates are unique per captain
- Geospatial indexing is enabled for address coordinates
- Current location updates enable real-time driver tracking

