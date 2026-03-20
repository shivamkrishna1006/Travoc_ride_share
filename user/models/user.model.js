const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 10
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    },
    profilePicture: {
      type: String,
      default: null
    },
    homeAddress: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
      coordinates: {
        type: {
          type: String,
          enum: ['Point'],
          default: 'Point'
        },
        coordinates: {
          type: [Number], // [longitude, latitude]
          default: [0, 0]
        }
      }
    },
    workAddress: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String
    },
    rating: {
      type: Number,
      default: 5,
      min: 1,
      max: 5
    },
    totalRatings: {
      type: Number,
      default: 0
    },
    totalRides: {
      type: Number,
      default: 0
    },
    emergencyContact: {
      name: String,
      phone: String,
      relationship: String
    },
    // Account status
    isActive: {
      type: Boolean,
      default: true
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    isBanned: {
      type: Boolean,
      default: false
    },
    banReason: {
      type: String,
      default: null
    },
    paymentMethods: [
      {
        type: {
          type: String,
          enum: ['credit_card', 'debit_card', 'wallet'],
          required: true
        },
        cardNumber: String,
        cardHolderName: String,
        expiryDate: String,
        isDefault: Boolean
      }
    ],
    preferences: {
      premiumRides: {
        type: Boolean,
        default: false
      },
      pooledRides: {
        type: Boolean,
        default: true
      },
      musicPreference: String,
      tempaturePreference: String,
      conversationLevel: {
        type: String,
        enum: ['quiet', 'normal', 'chatty'],
        default: 'normal'
      }
    }
  },
  {
    timestamps: true
  }
);


userSchema.index({ 'homeAddress.coordinates': '2dsphere' });

module.exports = mongoose.model('User', userSchema);
