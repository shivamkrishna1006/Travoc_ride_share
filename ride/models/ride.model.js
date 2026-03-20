const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema(
  {
    riderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Captain',
      default: null,
    },
    pickupLocation: {
      address: {
        type: String,
        required: true,
      },
      coordinates: {
        type: {
          type: String,
          enum: ['Point'],
          default: 'Point',
        },
        coordinates: {
          type: [Number],
          required: true,
        },
      },
    },
    dropoffLocation: {
      address: {
        type: String,
        required: true,
      },
      coordinates: {
        type: {
          type: String,
          enum: ['Point'],
          default: 'Point',
        },
        coordinates: {
          type: [Number],
          required: true,
        },
      },
    },
    status: {
      type: String,
      enum: ['requested', 'accepted', 'ongoing', 'completed', 'cancelled'],
      default: 'requested',
    },
    rideType: {
      type: String,
      enum: ['economy', 'premium', 'xl'],
      default: 'economy',
    },
    estimatedFare: {
      type: Number,
      required: true,
    },
    actualFare: {
      type: Number,
      default: null,
    },
    distance: {
      type: Number,
      default: null,
    },
    duration: {
      type: Number,
      default: null,
    },
    numberOfPassengers: {
      type: Number,
      default: 1,
      min: 1,
      max: 6,
    },
    specialRequests: {
      type: String,
      default: '',
    },
    riderRating: {
      type: Number,
      min: 1,
      max: 5,
      default: null,
    },
    riderReview: {
      type: String,
      default: null,
    },
    driverRating: {
      type: Number,
      min: 1,
      max: 5,
      default: null,
    },
    driverReview: {
      type: String,
      default: null,
    },
    cancellationReason: {
      cancelledBy: {
        type: String,
        enum: ['rider', 'driver', 'system'],
        default: null,
      },
      reason: {
        type: String,
        default: null,
      },
      cancelledAt: {
        type: Date,
        default: null,
      },
    },
    riderCurrentLocation: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        default: null,
      },
      lastUpdated: {
        type: Date,
        default: null,
      },
    },
    driverCurrentLocation: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        default: null,
      },
      lastUpdated: {
        type: Date,
        default: null,
      },
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'card', 'wallet', 'upi'],
      default: 'cash',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
    estimatedPickupTime: {
      type: Number,
      default: null,
    },
    acceptedAt: {
      type: Date,
      default: null,
    },
    startedAt: {
      type: Date,
      default: null,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

rideSchema.index({ 'pickupLocation.coordinates': '2dsphere' });
rideSchema.index({ 'dropoffLocation.coordinates': '2dsphere' });
rideSchema.index({ 'riderCurrentLocation.coordinates': '2dsphere' });
rideSchema.index({ 'driverCurrentLocation.coordinates': '2dsphere' });
rideSchema.index({ riderId: 1, createdAt: -1 });
rideSchema.index({ driverId: 1, createdAt: -1 });
rideSchema.index({ status: 1 });

const Ride = mongoose.model('Ride', rideSchema);

module.exports = Ride;
