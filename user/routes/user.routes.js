const express = require('express');
const router = express.Router();
const userController = require('../controllers/controller.user');
const { authMiddleware } = require('../middleware/auth.middleware');

// Authentication routes (no auth required)
router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/logout', userController.logout);

// User profile routes (auth required)
router.get('/profile/:userId', authMiddleware, userController.getProfile);
router.put('/profile/:userId', authMiddleware, userController.updateProfile);
router.put('/change-password/:userId', authMiddleware, userController.changePassword);
router.delete('/account/:userId', authMiddleware, userController.deleteAccount);

// Address routes (auth required)
router.put('/home-address/:userId', authMiddleware, userController.updateHomeAddress);
router.put('/work-address/:userId', authMiddleware, userController.updateWorkAddress);

// Payment methods routes (auth required)
router.post('/payment-method/:userId', authMiddleware, userController.addPaymentMethod);
router.delete('/payment-method/:userId/:paymentMethodId', authMiddleware, userController.deletePaymentMethod);

// Preferences routes (auth required)
router.put('/preferences/:userId', authMiddleware, userController.updatePreferences);

// Admin routes (auth required)
router.get('/all-users', authMiddleware, userController.getAllUsers);

module.exports = router;