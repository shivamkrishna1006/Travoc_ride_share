# User Microservice

User management microservice for the Uber-like ride-sharing application.

## Features

- User registration and authentication
- User profile management
- Address management (home and work addresses)
- Payment method management
- User preferences
- Password management

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file with the following variables:
```
JWT_SECRET=your_jwt_secret_key
MONGO_URI=mongodb://localhost:27017/userdb
```

3. Ensure MongoDB is running on your machine

## Scripts

- `npm start` - Start the server in production mode
- `npm run dev` - Start the server with auto-reload (requires nodemon)

## Project Structure

```
user/
├── controllers/        # Request handlers
│   └── controller.user.js
├── models/            # Database schemas
│   └── user.model.js
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
- `POST /register` - Register a new user
- `POST /login` - User login
- `POST /logout` - User logout

### Profile
- `GET /profile/:userId` - Get user profile
- `PUT /profile/:userId` - Update user profile
- `PUT /change-password/:userId` - Change password
- `DELETE /account/:userId` - Delete user account

### Addresses
- `PUT /home-address/:userId` - Update home address
- `PUT /work-address/:userId` - Update work address

### Payment Methods
- `POST /payment-method/:userId` - Add payment method
- `DELETE /payment-method/:userId/:paymentMethodId` - Delete payment method

### Preferences
- `PUT /preferences/:userId` - Update user preferences

### Admin
- `GET /all-users` - Get all users (admin only)

## User Schema

### Basic Information
- `firstName` - First name (required)
- `lastName` - Last name (required)
- `email` - Email address (required, unique)
- `phone` - Phone number (required, unique)
- `password` - Hashed password (required)
- `profilePicture` - Profile picture URL

### Addresses
- `homeAddress` - Home address with coordinates (geospatial)
- `workAddress` - Work address

### Ratings & Statistics
- `rating` - User rating (1-5)
- `totalRatings` - Number of ratings received
- `totalRides` - Total number of rides

### Account Status
- `isActive` - Account active status
- `isVerified` - Email verification status
- `isBanned` - Account ban status
- `banReason` - Reason for ban (if applicable)

### Payment & Preferences
- `paymentMethods` - Array of payment methods
- `emergencyContact` - Emergency contact information
- `preferences` - Ride preferences (premium rides, pooled rides, etc.)

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
- Phone numbers and emails are unique per user
- Geospatial indexing is enabled for address coordinates
