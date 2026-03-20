# 🚀 Quick Start Guide - User Microservice

## Installation & Setup

### Step 1: Navigate to User Directory
```bash
cd e:\MicroServices\user
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Verify Environment Variables
Check `.env` file has these values:
```
MONGO_URI=mongodb://localhost:27017/userdb
JWT_SECRET=user_secret_key_change_in_production
```

### Step 4: Start MongoDB
```bash
# If using MongoDB locally
mongod
```

### Step 5: Run the Server

**Production Mode:**
```bash
npm start
```

**Development Mode (with auto-reload):**
```bash
npm install -g nodemon  # Install globally if not already done
npm run dev
```

### Step 6: Verify Server is Running
```bash
curl http://localhost:3001/health
```

Expected response:
```json
{
  "message": "User service is running"
}
```

---

## Testing Endpoints

### 1. Register a User
```bash
curl -X POST http://localhost:3001/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "password": "password123"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:3001/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 3. Get User Profile (Replace with actual userId and token)
```bash
curl -X GET http://localhost:3001/api/users/profile/{userId} \
  -H "Authorization: Bearer {token}"
```

### 4. Update Profile
```bash
curl -X PUT http://localhost:3001/api/users/profile/{userId} \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "firstName": "Jane",
    "profilePicture": "https://example.com/pic.jpg"
  }'
```

### 5. Update Home Address
```bash
curl -X PUT http://localhost:3001/api/users/home-address/{userId} \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA",
    "coordinates": [-74.0060, 40.7128]
  }'
```

### 6. Add Payment Method
```bash
curl -X POST http://localhost:3001/api/users/payment-method/{userId} \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "type": "credit_card",
    "cardNumber": "4111111111111111",
    "cardHolderName": "John Doe",
    "expiryDate": "12/25",
    "isDefault": true
  }'
```

### 7. Update Preferences
```bash
curl -X PUT http://localhost:3001/api/users/preferences/{userId} \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "premiumRides": true,
    "pooledRides": false,
    "conversationLevel": "chatty"
  }'
```

### 8. Change Password
```bash
curl -X PUT http://localhost:3001/api/users/change-password/{userId} \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "currentPassword": "password123",
    "newPassword": "newpassword456"
  }'
```

### 9. Logout
```bash
curl -X POST http://localhost:3001/api/users/logout \
  -H "Authorization: Bearer {token}"
```

### 10. Delete Account
```bash
curl -X DELETE http://localhost:3001/api/users/account/{userId} \
  -H "Authorization: Bearer {token}"
```

---

## Project Structure

```
user/
├── config/              - Constants and configuration
├── controllers/         - Business logic handlers
├── middleware/          - Authentication middleware
├── models/             - Database schemas
├── routes/             - API route definitions
├── utils/              - Utility functions
├── db/                 - Database connection
├── .env                - Environment variables
├── .env.example        - Environment template
├── .gitignore          - Git ignore rules
├── app.js              - Express app setup
├── server.js           - Server entry point
├── package.json        - Dependencies
├── README.md           - Full documentation
├── FILE_STRUCTURE.md   - File structure details
└── SETUP_COMPLETE.md   - Setup checklist
```

---

## Common Issues & Solutions

### Issue: MongoDB connection error
**Solution:**
- Ensure MongoDB is running
- Check MONGO_URI in .env file
- Run: `mongod` to start MongoDB

### Issue: Port 3001 already in use
**Solution:**
- Change PORT in .env file
- Or kill the process using port 3001

### Issue: Module not found
**Solution:**
```bash
rm -rf node_modules
npm install
```

### Issue: Invalid token error
**Solution:**
- Ensure JWT_SECRET matches between registration and token verification
- Check token hasn't expired (valid for 7 days)

---

## Features

✅ User registration with password hashing
✅ JWT-based authentication
✅ Profile management
✅ Address management with coordinates
✅ Payment method management
✅ User preferences
✅ Password change & account deletion
✅ Input validation
✅ Error handling
✅ HTTP request logging

---

## Environment Variables

```env
# Server
PORT=3001
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/userdb

# JWT
JWT_SECRET=user_secret_key_change_in_production
JWT_EXPIRY=7d

# App
APP_NAME=User Service
```

---

## Useful Commands

```bash
# Install dependencies
npm install

# Start production server
npm start

# Start development server with auto-reload
npm run dev

# View running processes
ps aux | grep node

# Kill process on port 3001 (Windows)
netstat -ano | findstr :3001
taskkill /PID {PID} /F
```

---

## Support & Documentation

- **README.md** - Full project documentation
- **FILE_STRUCTURE.md** - Detailed file descriptions
- **SETUP_COMPLETE.md** - Comprehensive setup checklist
- **API Routes** - All routes prefixed with `/api/users`

---

## ✅ Setup Verification Checklist

- [ ] Node.js installed
- [ ] MongoDB installed and running
- [ ] Dependencies installed (`npm install`)
- [ ] .env file configured
- [ ] Server starts without errors (`npm start`)
- [ ] Health endpoint responds (`/health`)
- [ ] Can register new user
- [ ] Can login with registered credentials
- [ ] Can retrieve profile with token
- [ ] Can update profile
- [ ] Can add payment method
- [ ] Can update preferences

---

Ready to go! Your User Microservice is fully set up and ready to use. 🎉
