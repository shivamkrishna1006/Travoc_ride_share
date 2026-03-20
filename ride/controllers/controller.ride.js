const Ride = require('../models/ride.model');
const { calculateFare } = require('../utils/fareCalculator');
const asyncHandler = require('../utils/errorHandler').asyncHandler;
const EventPublisher = require('../../shared-utils/event-bus/event-publisher');
const UserServiceClient = require('../src/clients/user-service-client');
const DriverServiceClient = require('../src/clients/driver-service-client');
const LockManager = require('../../shared-utils/cache/lock-manager');

// Request a new ride
exports.requestRide = asyncHandler(async (req, res) => {
  try {
    const { pickupLocation, dropoffLocation, rideType, numberOfPassengers, specialRequests } = req.body;
    const riderId = req.userId;

    if (!pickupLocation || !pickupLocation.address || !pickupLocation.coordinates) {
      return res.status(400).json({ message: 'Pickup location is required with coordinates' });
    }

    if (!dropoffLocation || !dropoffLocation.address || !dropoffLocation.coordinates) {
      return res.status(400).json({ message: 'Dropoff location is required with coordinates' });
    }

    // Validate user exists
    const userValidation = await UserServiceClient.validateUser(riderId);
    if (!userValidation.exists) {
      return res.status(400).json({ message: 'User not found or inactive' });
    }

    const estimatedFare = calculateFare(pickupLocation.coordinates, dropoffLocation.coordinates, rideType);

    const ride = new Ride({
      riderId,
      pickupLocation,
      dropoffLocation,
      rideType: rideType || 'economy',
      numberOfPassengers: numberOfPassengers || 1,
      specialRequests: specialRequests || '',
      estimatedFare,
      status: 'requested',
    });

    await ride.save();

    // Publish RideRequested event (async, don't wait)
    EventPublisher.publish('RideRequested', {
      rideId: ride._id,
      userId: riderId,
      pickupLocation,
      dropoffLocation,
      rideType: ride.rideType,
      estimatedFare: ride.estimatedFare,
      numberOfPassengers: ride.numberOfPassengers
    }).catch(error => console.error('Error publishing RideRequested event:', error));

    res.status(201).json({
      message: 'Ride requested successfully',
      ride,
    });
  } catch (error) {
    console.error('Error requesting ride:', error);
    res.status(500).json({ message: 'Error requesting ride', error: error.message });
  }
});

// Get available drivers near pickup location
exports.getAvailableDrivers = asyncHandler(async (req, res) => {
  try {
    const { latitude, longitude, radius } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }

    const searchRadius = radius ? parseInt(radius) : 5000;

    const availableDrivers = await Ride.find({
      'pickupLocation.coordinates': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          $maxDistance: searchRadius,
        },
      },
      status: 'requested',
    }).populate('driverId', 'firstName lastName phone rating currentLocation');

    res.status(200).json({
      message: 'Available drivers retrieved',
      drivers: availableDrivers,
    });
  } catch (error) {
    console.error('Error getting available drivers:', error);
    res.status(500).json({ message: 'Error getting available drivers', error: error.message });
  }
});

// Driver accepts a ride
exports.acceptRide = asyncHandler(async (req, res) => {
  try {
    const { rideId } = req.params;
    const driverId = req.userId;

    // Try to acquire distributed lock to prevent double-acceptance
    const lockAcquired = await LockManager.acquireLock(
      `ride:${rideId}`,
      driverId,
      30 // 30 second TTL
    );

    if (!lockAcquired) {
      return res.status(409).json({ 
        message: 'Ride already accepted by another driver',
        locked: true
      });
    }

    const ride = await Ride.findById(rideId);

    if (!ride) {
      await LockManager.releaseLock(`ride:${rideId}`, driverId);
      return res.status(404).json({ message: 'Ride not found' });
    }

    if (ride.status !== 'requested') {
      await LockManager.releaseLock(`ride:${rideId}`, driverId);
      return res.status(400).json({ message: 'Ride is not available for acceptance' });
    }

    // Update ride
    ride.driverId = driverId;
    ride.status = 'accepted';
    ride.acceptedAt = new Date();
    ride.estimatedPickupTime = 5;

    await ride.save();

    // Get driver profile
    const driverProfile = await DriverServiceClient.getDriverProfile(driverId);

    // Publish RideAccepted event (async, don't wait)
    EventPublisher.publish('RideAccepted', {
      rideId: ride._id,
      driverId,
      driverName: driverProfile ? `${driverProfile.firstName} ${driverProfile.lastName}` : 'Driver',
      driverPhone: driverProfile?.phone,
      driverRating: driverProfile?.rating,
      acceptedAt: ride.acceptedAt
    }).catch(error => console.error('Error publishing RideAccepted event:', error));

    res.status(200).json({
      message: 'Ride accepted successfully',
      ride,
    });
  } catch (error) {
    console.error('Error accepting ride:', error);
    res.status(500).json({ message: 'Error accepting ride', error: error.message });
  }
});

// Driver rejects a ride
exports.rejectRide = asyncHandler(async (req, res) => {
  try {
    const { rideId } = req.params;
    const { reason } = req.body;

    const ride = await Ride.findById(rideId);

    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    if (ride.status !== 'requested') {
      return res.status(400).json({ message: 'Ride cannot be rejected at this stage' });
    }

    ride.status = 'requested';
    await ride.save();

    res.status(200).json({
      message: 'Ride rejected successfully',
      ride,
    });
  } catch (error) {
    console.error('Error rejecting ride:', error);
    res.status(500).json({ message: 'Error rejecting ride', error: error.message });
  }
});

// Update ride status
exports.updateRideStatus = asyncHandler(async (req, res) => {
  try {
    const { rideId } = req.params;
    const { status, distance, duration } = req.body;
    const driverId = req.userId;

    const validStatuses = ['requested', 'accepted', 'ongoing', 'completed', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const ride = await Ride.findById(rideId);

    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    // For completion, calculate actual fare and publish event
    if (status === 'completed') {
      ride.completedAt = new Date();
      if (distance) {
        ride.distance = distance;
        ride.actualFare = calculateFare(
          ride.pickupLocation.coordinates,
          ride.dropoffLocation.coordinates,
          ride.rideType,
          distance
        );
      }
      if (duration) ride.duration = duration;
      ride.paymentStatus = 'pending';

      await ride.save();

      // Add ride to user history
      UserServiceClient.addRideToHistory(ride.riderId, {
        rideId: ride._id,
        driverId,
        pickupLocation: ride.pickupLocation,
        dropoffLocation: ride.dropoffLocation,
        distance: ride.distance,
        duration: ride.duration,
        fare: ride.actualFare,
        completedAt: ride.completedAt
      }).catch(error => console.error('Error adding to user history:', error));

      // Publish RideCompleted event
      EventPublisher.publish('RideCompleted', {
        rideId: ride._id,
        riderId: ride.riderId,
        driverId,
        distance: ride.distance,
        duration: ride.duration,
        fare: ride.actualFare,
        completedAt: ride.completedAt
      }).catch(error => console.error('Error publishing RideCompleted event:', error));

      // Release the lock
      LockManager.releaseLock(`ride:${rideId}`, driverId).catch(error => 
        console.error('Error releasing lock:', error)
      );
    } else if (status === 'ongoing' && !ride.startedAt) {
      ride.startedAt = new Date();
      await ride.save();

      // Publish RideStarted event
      EventPublisher.publish('RideStarted', {
        rideId: ride._id,
        riderId: ride.riderId,
        driverId,
        startedAt: ride.startedAt
      }).catch(error => console.error('Error publishing RideStarted event:', error));
    } else {
      ride.status = status;
      await ride.save();
    }

    res.status(200).json({
      message: 'Ride status updated successfully',
      ride,
    });
  } catch (error) {
    console.error('Error updating ride status:', error);
    res.status(500).json({ message: 'Error updating ride status', error: error.message });
  }
});

// Get ride details
exports.getRideDetails = asyncHandler(async (req, res) => {
  try {
    const { rideId } = req.params;

    const ride = await Ride.findById(rideId)
      .populate('riderId', 'firstName lastName phone email')
      .populate('driverId', 'firstName lastName phone email vehicle rating');

    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    res.status(200).json({
      message: 'Ride details retrieved',
      ride,
    });
  } catch (error) {
    console.error('Error getting ride details:', error);
    res.status(500).json({ message: 'Error getting ride details', error: error.message });
  }
});

// Get ride history for user
exports.getUserRideHistory = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;

    const rides = await Ride.find({ riderId: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('driverId', 'firstName lastName phone rating vehicle');

    const totalRides = await Ride.countDocuments({ riderId: userId });

    res.status(200).json({
      message: 'Ride history retrieved',
      rides,
      totalRides,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalRides / limit),
    });
  } catch (error) {
    console.error('Error getting user ride history:', error);
    res.status(500).json({ message: 'Error getting user ride history', error: error.message });
  }
});

// Get ride history for driver
exports.getDriverRideHistory = asyncHandler(async (req, res) => {
  try {
    const { driverId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;

    const rides = await Ride.find({ driverId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('riderId', 'firstName lastName phone rating');

    const totalRides = await Ride.countDocuments({ driverId });

    res.status(200).json({
      message: 'Ride history retrieved',
      rides,
      totalRides,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalRides / limit),
    });
  } catch (error) {
    console.error('Error getting driver ride history:', error);
    res.status(500).json({ message: 'Error getting driver ride history', error: error.message });
  }
});

// Cancel a ride
exports.cancelRide = asyncHandler(async (req, res) => {
  try {
    const { rideId } = req.params;
    const { cancelledBy, reason } = req.body;
    const userId = req.userId;

    if (!['rider', 'driver'].includes(cancelledBy)) {
      return res.status(400).json({ message: 'Invalid cancellation party' });
    }

    const ride = await Ride.findById(rideId);

    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    if (['completed', 'cancelled'].includes(ride.status)) {
      return res.status(400).json({ message: 'Ride cannot be cancelled at this stage' });
    }

    // Calculate cancellation fee
    let cancellationFee = 0;
    if (ride.status === 'accepted' && ride.acceptedAt) {
      const minutesElapsed = Math.floor((new Date() - ride.acceptedAt) / 60000);
      if (minutesElapsed >= 2) {
        cancellationFee = Math.round(ride.estimatedFare * 0.25); // 25% cancellation fee
      }
    }

    ride.status = 'cancelled';
    ride.cancellationReason = {
      cancelledBy,
      reason: reason || 'No reason provided',
      cancelledAt: new Date(),
    };
    ride.cancellationFee = cancellationFee;

    await ride.save();

    // If cancelled by driver or system, refund user
    if ((cancelledBy === 'driver' || cancelledBy === 'system') && cancellationFee > 0) {
      UserServiceClient.processRefund(ride.riderId, cancellationFee, 'Ride cancellation')
        .catch(error => console.error('Error processing refund:', error));
    }

    // Publish RideCancelled event
    EventPublisher.publish('RideCancelled', {
      rideId: ride._id,
      riderId: ride.riderId,
      driverId: ride.driverId,
      cancelledBy,
      reason: reason || 'No reason provided',
      cancellationFee,
      cancelledAt: ride.cancellationReason.cancelledAt
    }).catch(error => console.error('Error publishing RideCancelled event:', error));

    // Release the lock if driver exists
    if (ride.driverId) {
      LockManager.releaseLock(`ride:${rideId}`, ride.driverId).catch(error => 
        console.error('Error releasing lock:', error)
      );
    }

    res.status(200).json({
      message: 'Ride cancelled successfully',
      ride,
    });
  } catch (error) {
    console.error('Error cancelling ride:', error);
    res.status(500).json({ message: 'Error cancelling ride', error: error.message });
  }
});

// Calculate fare
exports.calculateFareEstimate = asyncHandler(async (req, res) => {
  try {
    const { pickupCoordinates, dropoffCoordinates, rideType } = req.body;

    if (!pickupCoordinates || !dropoffCoordinates) {
      return res.status(400).json({ message: 'Coordinates are required' });
    }

    const estimatedFare = calculateFare(pickupCoordinates, dropoffCoordinates, rideType || 'economy');

    res.status(200).json({
      message: 'Fare calculated successfully',
      estimatedFare,
    });
  } catch (error) {
    console.error('Error calculating fare:', error);
    res.status(500).json({ message: 'Error calculating fare', error: error.message });
  }
});

// Track location (update rider or driver location)
exports.trackLocation = asyncHandler(async (req, res) => {
  try {
    const { rideId } = req.params;
    const { latitude, longitude, userType } = req.body;
    const userId = req.userId;

    if (!latitude || !longitude || !userType) {
      return res.status(400).json({ message: 'Latitude, longitude, and userType are required' });
    }

    if (!['rider', 'driver'].includes(userType)) {
      return res.status(400).json({ message: 'Invalid user type' });
    }

    const ride = await Ride.findById(rideId);

    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    if (userType === 'rider') {
      ride.riderCurrentLocation = {
        type: 'Point',
        coordinates: [longitude, latitude],
        lastUpdated: new Date(),
      };
    } else if (userType === 'driver') {
      ride.driverCurrentLocation = {
        type: 'Point',
        coordinates: [longitude, latitude],
        lastUpdated: new Date(),
      };
    }

    await ride.save();

    res.status(200).json({
      message: 'Location updated successfully',
      ride,
    });
  } catch (error) {
    console.error('Error tracking location:', error);
    res.status(500).json({ message: 'Error tracking location', error: error.message });
  }
});

// Get active rides for driver
exports.getActiveRidesForDriver = asyncHandler(async (req, res) => {
  try {
    const { driverId } = req.params;

    const activeRides = await Ride.find({
      driverId,
      status: { $in: ['accepted', 'ongoing'] },
    }).populate('riderId', 'firstName lastName phone');

    res.status(200).json({
      message: 'Active rides retrieved',
      rides: activeRides,
    });
  } catch (error) {
    console.error('Error getting active rides:', error);
    res.status(500).json({ message: 'Error getting active rides', error: error.message });
  }
});
