# User Microservice - File Structure

```
user/
│
├── config/
│   └── constants.js                 # Application constants
│
├── controllers/
│   └── controller.user.js           # User request handlers
│
├── middleware/
│   └── auth.middleware.js           # JWT authentication middleware
│
├── models/
│   └── user.model.js                # User Mongoose schema
│
├── routes/
│   └── user.routes.js               # API route definitions
│
├── utils/
│   ├── validation.js                # Input validation utilities
│   └── errorHandler.js              # Error handling utilities
│
├── db/
│   └── db.js                        # MongoDB connection setup
│
├── app.js                           # Express app configuration
├── server.js                        # Server entry point
│
├── package.json                     # Project dependencies
├── package-lock.json                # Dependency lock file
│
├── .env                             # Environment variables (KEEP SECURE)
├── .env.example                     # Example environment variables
├── .gitignore                       # Git ignore rules
│
└── README.md                        # Project documentation
```

## File Descriptions

### Core Files
- **server.js** - Entry point that creates HTTP server and handles graceful shutdown
- **app.js** - Configures Express app with middleware, routes, and error handling

### Configuration
- **config/constants.js** - Stores application constants like user roles, payment types, validation rules

### Database
- **db/db.js** - MongoDB connection initialization
- **models/user.model.js** - User schema with all fields and validation

### API Layer
- **routes/user.routes.js** - Defines all API endpoints with auth middleware
- **controllers/controller.user.js** - Implements business logic for all endpoints

### Middleware & Utils
- **middleware/auth.middleware.js** - JWT token verification middleware
- **utils/validation.js** - Input validation functions
- **utils/errorHandler.js** - Error handling and async wrapper utilities

### Configuration Files
- **.env** - Environment variables (database URL, JWT secret, port)
- **.env.example** - Template for environment variables
- **.gitignore** - Specifies files to ignore in git
- **package.json** - Node.js dependencies and scripts
- **README.md** - Project documentation

## API Routes

All routes are prefixed with `/api/users`

### Public Routes (No Auth Required)
```
POST   /register              - Register new user
POST   /login                 - User login
POST   /logout                - User logout
```

### Protected Routes (Auth Required)
```
GET    /profile/:userId       - Get user profile
PUT    /profile/:userId       - Update profile
PUT    /change-password/:userId - Change password
DELETE /account/:userId       - Delete account

PUT    /home-address/:userId  - Update home address
PUT    /work-address/:userId  - Update work address

POST   /payment-method/:userId - Add payment method
DELETE /payment-method/:userId/:paymentMethodId - Remove payment method

PUT    /preferences/:userId   - Update preferences

GET    /all-users            - Get all users (admin only)
```

## Key Features Implemented

✅ User registration with password hashing
✅ JWT-based authentication
✅ User profile management
✅ Address management with geospatial coordinates
✅ Payment method management
✅ User preferences
✅ Password change functionality
✅ Account deletion
✅ Input validation
✅ Error handling
✅ Morgan logging
✅ Graceful server shutdown
✅ MongoDB integration
