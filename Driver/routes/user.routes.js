const express = require('express');
const router = express.Router();
const captainController = require('../controllers/controller.user');
const { authMiddleware } = require('../middleware/auth.middleware');

// Authentication routes (no auth required)
router.post('/register', captainController.register);
router.post('/login', captainController.login);
router.post('/logout', captainController.logout);

// Captain profile routes (auth required)
router.get('/profile/:userId', authMiddleware, captainController.getProfile);
router.put('/profile/:userId', authMiddleware, captainController.updateProfile);
router.put('/change-password/:userId', authMiddleware, captainController.changePassword);
router.delete('/account/:userId', authMiddleware, captainController.deleteAccount);

// Address routes (auth required)
router.put('/home-address/:userId', authMiddleware, captainController.updateHomeAddress);

// Payment methods routes (auth required - for driver payouts)
router.post('/bank-account/:userId', authMiddleware, captainController.addPaymentMethod);
router.delete('/bank-account/:userId/:paymentMethodId', authMiddleware, captainController.deletePaymentMethod);

// Preferences routes (auth required)
router.put('/preferences/:userId', authMiddleware, captainController.updatePreferences);

// Admin routes (auth required)
router.get('/all-captains', authMiddleware, captainController.getAllUsers);

module.exports = router;module.exports = router;