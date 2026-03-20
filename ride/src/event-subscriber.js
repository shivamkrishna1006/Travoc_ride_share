const EventSubscriber = require('../../shared-utils/event-bus/event-subscriber');

/**
 * Ride Service Event Subscribers
 * Listens to events from other services
 */

async function setupRideEventSubscribers() {
  console.log('🔄 Setting up Ride Service event subscribers...');

  try {
    // Subscribe to LocationUpdated event (published by Driver Service via ride service)
    await EventSubscriber.subscribe('rides', 'locationupdated', async (event) => {
      console.log('📍 LocationUpdated event received:', {
        rideId: event.data.rideId,
        driverId: event.data.driverId,
        latitude: event.data.latitude,
        longitude: event.data.longitude
      });
      
      // Update ride with latest driver location
      const Ride = require('../models/ride.model');
      const ride = await Ride.findById(event.data.rideId);
      
      if (ride && ride.status === 'ongoing') {
        ride.driverLocation = {
          latitude: event.data.latitude,
          longitude: event.data.longitude,
          timestamp: new Date()
        };
        await ride.save();
        console.log(`✅ Ride ${event.data.rideId} driver location updated`);
      }
    }, 'ride-service');

    // Subscribe to PaymentProcessed event (published by payment service)
    await EventSubscriber.subscribe('users', 'paymentprocessed', async (event) => {
      console.log('💳 PaymentProcessed event received:', {
        rideId: event.data.rideId,
        amount: event.data.amount
      });

      const Ride = require('../models/ride.model');
      const ride = await Ride.findById(event.data.rideId);
      
      if (ride) {
        ride.paymentStatus = 'completed';
        ride.paymentDetails = {
          amount: event.data.amount,
          processedAt: new Date(),
          transactionId: event.data.transactionId
        };
        await ride.save();
        console.log(`✅ Ride ${event.data.rideId} payment marked as completed`);
      }
    }, 'ride-service');

    // Subscribe to DriverOffline event (published by Driver Service)
    await EventSubscriber.subscribe('drivers', 'driveroffline', async (event) => {
      console.log('🚗 DriverOffline event received:', {
        driverId: event.data.driverId
      });

      const Ride = require('../models/ride.model');
      const activeRides = await Ride.find({
        driverId: event.data.driverId,
        status: 'ongoing'
      });

      for (const ride of activeRides) {
        console.log(`⚠️  Auto-cancelling ride ${ride._id} - driver offline`);
        ride.status = 'cancelled';
        ride.cancellationReason = {
          cancelledBy: 'system',
          reason: 'Driver went offline',
          cancelledAt: new Date()
        };
        ride.cancellationFee = 0; // No charge for system cancellation
        await ride.save();
      }
    }, 'ride-service');

    console.log('✅ Ride Service event subscribers initialized');
  } catch (error) {
    console.error('❌ Error setting up event subscribers:', error.message);
    // Retry after 5 seconds
    setTimeout(setupRideEventSubscribers, 5000);
  }
}

module.exports = { setupRideEventSubscribers };
