const EventSubscriber = require('../../shared-utils/event-bus/event-subscriber');

/**
 * Driver Service Event Subscribers
 * Listens to events from other services
 */

async function setupDriverEventSubscribers() {
  console.log('🔄 Setting up Driver Service event subscribers...');

  try {
    // Subscribe to RideRequested event (published by Ride Service)
    await EventSubscriber.subscribe('rides', 'riderequested', async (event) => {
      console.log('🚗 RideRequested event received:', {
        rideId: event.data.rideId,
        userId: event.data.userId,
        pickupLocation: event.data.pickupLocation.address
      });

      // Drivers will be notified via WebSocket or push notifications
      // This is for backend processing if needed
      console.log(`✅ Ride request logged for notification system: ${event.data.rideId}`);
    }, 'driver-service');

    // Subscribe to RideAccepted event (published by Ride Service)
    await EventSubscriber.subscribe('rides', 'rideaccepted', async (event) => {
      console.log('✅ RideAccepted event received:', {
        rideId: event.data.rideId,
        driverId: event.data.driverId
      });

      const Captain = require('../models/captain.model');
      const driver = await Captain.findById(event.data.driverId);

      if (driver) {
        // Update driver status
        driver.status = 'busy';
        driver.currentRide = event.data.rideId;
        driver.totalRides = (driver.totalRides || 0) + 1;
        await driver.save();
        console.log(`✅ Driver ${event.data.driverId} status updated to BUSY`);
      }
    }, 'driver-service');

    // Subscribe to RideCompleted event (published by Ride Service)
    await EventSubscriber.subscribe('rides', 'ridecompleted', async (event) => {
      console.log('✅ RideCompleted event received:', {
        rideId: event.data.rideId,
        driverId: event.data.driverId,
        fare: event.data.fare
      });

      const Captain = require('../models/captain.model');
      const driver = await Captain.findById(event.data.driverId);

      if (driver) {
        // Update driver earnings and status
        driver.status = 'online';
        driver.currentRide = null;
        driver.earnings = (driver.earnings || 0) + (event.data.fare * 0.9); // Driver gets 90%
        driver.totalEarnings = (driver.totalEarnings || 0) + (event.data.fare * 0.9);
        await driver.save();
        console.log(`💰 Driver ${event.data.driverId} earnings updated: +${event.data.fare * 0.9}`);
      }
    }, 'driver-service');

    // Subscribe to RideCancelled event (published by Ride Service)
    await EventSubscriber.subscribe('rides', 'ridecancelled', async (event) => {
      console.log('❌ RideCancelled event received:', {
        rideId: event.data.rideId,
        driverId: event.data.driverId
      });

      const Captain = require('../models/captain.model');
      const driver = await Captain.findById(event.data.driverId);

      if (driver) {
        // Reset driver status if this was the current ride
        if (driver.currentRide === event.data.rideId) {
          driver.status = 'online';
          driver.currentRide = null;
          driver.cancelledRides = (driver.cancelledRides || 0) + 1;
          await driver.save();
          console.log(`✅ Driver ${event.data.driverId} status reset to ONLINE`);
        }
      }
    }, 'driver-service');

    console.log('✅ Driver Service event subscribers initialized');
  } catch (error) {
    console.error('❌ Error setting up event subscribers:', error.message);
    setTimeout(setupDriverEventSubscribers, 5000);
  }
}

module.exports = { setupDriverEventSubscribers };
