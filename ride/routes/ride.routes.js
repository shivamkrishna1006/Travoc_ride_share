const express = require('express');
const router = express.Router();
const rideController = require('../controllers/controller.ride');
const authMiddleware = require('../middleware/auth.middleware');

// Public routes
router.post('/calculate-fare', rideController.calculateFareEstimate);

// Protected routes
router.post('/request', authMiddleware, rideController.requestRide);
router.get('/available-drivers', authMiddleware, rideController.getAvailableDrivers);
router.put('/:rideId/accept', authMiddleware, rideController.acceptRide);
router.put('/:rideId/reject', authMiddleware, rideController.rejectRide);
router.put('/:rideId/status', authMiddleware, rideController.updateRideStatus);
router.get('/:rideId', authMiddleware, rideController.getRideDetails);
router.get('/history/user/:userId', authMiddleware, rideController.getUserRideHistory);
router.get('/history/driver/:driverId', authMiddleware, rideController.getDriverRideHistory);
router.put('/:rideId/cancel', authMiddleware, rideController.cancelRide);
router.put('/:rideId/location', authMiddleware, rideController.trackLocation);
router.get('/active/driver/:driverId', authMiddleware, rideController.getActiveRidesForDriver);

module.exports = router;
