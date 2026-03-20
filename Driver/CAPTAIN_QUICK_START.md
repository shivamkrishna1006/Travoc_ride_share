# 🚀 Quick Start Guide - Captain Microservice

## Installation & Setup

### Step 1: Navigate to Captain Directory
```bash
cd e:\MicroServices\user\ copy
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Verify Environment Variables
Check `.env` file has these values:
```
PORT=3002
MONGO_URI=mongodb://your_connection_string
JWT_SECRET=your_secret_key
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
npm install -g nodemon
npm run dev
```

### Step 6: Verify Server is Running
```bash
curl http://localhost:3002/health
```

Expected response:
```json
{
  "message": "Captain service is running"
}
```

---

## API Endpoints

### Authentication
```
POST   /api/captains/register        - Register new captain
POST   /api/captains/login           - Captain login
POST   /api/captains/logout          - Captain logout
```

### Profile (Protected)
```
GET    /api/captains/profile/:userId           - Get captain profile
PUT    /api/captains/profile/:userId           - Update profile
PUT    /api/captains/change-password/:userId   - Change password
DELETE /api/captains/account/:userId           - Delete account
```

### Address (Protected)
```
PUT    /api/captains/home-address/:userId - Update home address
```

### Bank Account (Protected)
```
POST   /api/captains/bank-account/:userId            - Add bank account
DELETE /api/captains/bank-account/:userId/:accountId - Remove account
```

### Preferences (Protected)
```
PUT    /api/captains/preferences/:userId - Update preferences
```

### Admin (Protected)
```
GET    /api/captains/all-captains - Get all captains
```

---

## Testing Examples

### Register Captain
```bash
curl -X POST http://localhost:3002/api/captains/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Rajesh",
    "lastName": "Kumar",
    "email": "rajesh@example.com",
    "phone": "9876543210",
    "password": "password123",
    "licenseNumber": "DL-2023-123456",
    "licenseExpiry": "2026-12-31",
    "emergencyContact": {
      "name": "Priya",
      "phone": "9876543211",
      "relationship": "Wife"
    },
    "vehicleInfo": {
      "make": "Maruti",
      "model": "Swift",
      "color": "Silver",
      "year": 2022,
      "licensePlate": "DL-01-AB-1234",
      "vin": "MAR123456789",
      "registrationExpiry": "2026-06-15",
      "insuranceExpiry": "2025-06-15",
      "vehicleType": "hatchback"
    },
    "bankAccount": {
      "accountHolderName": "Rajesh Kumar",
      "accountNumber": "1234567890",
      "ifscCode": "SBIN0001234",
      "bankName": "SBI"
    }
  }'
```

### Login
```bash
curl -X POST http://localhost:3002/api/captains/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "rajesh@example.com",
    "password": "password123"
  }'
```

---

## Features

✅ Captain registration with document support
✅ JWT-based authentication  
✅ License and vehicle management
✅ Bank account for payouts
✅ Real-time location tracking
✅ Driver ratings and statistics
✅ Address management with GPS
✅ Preferences and ride types
✅ Error handling and validation
✅ Secure password hashing

---

## Environment Variables

```env
PORT=3002
NODE_ENV=development
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/captaindb
JWT_SECRET=your_secret_key
JWT_EXPIRY=7d
APP_NAME=Captain Service
```

---

Ready to go! 🎉
