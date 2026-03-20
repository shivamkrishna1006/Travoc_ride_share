// MongoDB initialization script
// Creates separate databases for each service

db = db.getSiblingDB('userdb');
db.createCollection('users');
db.createCollection('addresses');
db.createCollection('paymentmethods');

db = db.getSiblingDB('captaindb');
db.createCollection('captains');
db.createCollection('vehicles');
db.createCollection('bankaccounts');

db = db.getSiblingDB('ridedb');
db.createCollection('rides');
db.createCollection('fare_calculations');

print('✅ MongoDB initialization completed');
