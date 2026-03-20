const EventSubscriber = require('../../shared-utils/event-bus/event-subscriber');

/**
 * User Service Event Subscribers
 * Listens to events from other services
 */

async function setupUserEventSubscribers() {
  console.log('🔄 Setting up User Service event subscribers...');

  try {
    // Subscribe to RideCompleted event (published by Ride Service)
    await EventSubscriber.subscribe('rides', 'ridecompleted', async (event) => {
      console.log('✅ RideCompleted event received:', {
        rideId: event.data.rideId,
        userId: event.data.riderId
      });

      const User = require('../models/user.model');
      const user = await User.findById(event.data.riderId);

      if (user) {
        // Add ride to user's history
        if (!user.rideHistory) {
          user.rideHistory = [];
        }
        user.rideHistory.push({
          rideId: event.data.rideId,
          driverId: event.data.driverId,
          distance: event.data.distance,
          duration: event.data.duration,
          fare: event.data.fare,
          completedAt: event.data.completedAt
        });

        // Update user stats
        user.totalRides = (user.totalRides || 0) + 1;
        user.totalSpent = (user.totalSpent || 0) + event.data.fare;

        await user.save();
        console.log(`✅ User ${event.data.riderId} ride history updated`);
      }
    }, 'user-service');

    // Subscribe to RideCancelled event (published by Ride Service)
    await EventSubscriber.subscribe('rides', 'ridecancelled', async (event) => {
      console.log('❌ RideCancelled event received:', {
        rideId: event.data.rideId,
        cancelledBy: event.data.cancelledBy
      });

      const User = require('../models/user.model');
      const user = await User.findById(event.data.riderId);

      if (user && event.data.cancellationFee > 0) {
        // Deduct cancellation fee from wallet or credit
        user.wallet = (user.wallet || 0) - event.data.cancellationFee;
        await user.save();
        console.log(`💸 Cancellation fee deducted from user ${event.data.riderId}: ${event.data.cancellationFee}`);
      }
    }, 'user-service');

    // Subscribe to DriverRated event (published by Driver Service)
    await EventSubscriber.subscribe('drivers', 'driverrated', async (event) => {
      console.log('⭐ DriverRated event received:', {
        driverId: event.data.driverId,
        rating: event.data.rating
      });

      const User = require('../models/user.model');
      // Update if there's a driver user rating in the system
      const driverUser = await User.findById(event.data.driverId);
      if (driverUser) {
        driverUser.rating = event.data.rating;
        await driverUser.save();
        console.log(`⭐ Driver ${event.data.driverId} rating updated to ${event.data.rating}`);
      }
    }, 'user-service');

    console.log('✅ User Service event subscribers initialized');
  } catch (error) {
    console.error('❌ Error setting up event subscribers:', error.message);
    setTimeout(setupUserEventSubscribers, 5000);
  }
}

module.exports = { setupUserEventSubscribers };
