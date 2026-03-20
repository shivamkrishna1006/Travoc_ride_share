const mongoose = require('mongoose');

const captainSchema = new mongoose.Schema(
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
    // License Information
    licenseNumber: {
      type: String,
      required: true,
      unique: true
    },
    licenseExpiry: {
      type: Date,
      required: true
    },
    licenseVerified: {
      type: Boolean,
      default: false
    },
    licenseDocument: {
      type: String // URL to license document
    },
    // Vehicle Information
    vehicleInfo: {
      make: {
        type: String,
        required: true
      },
      model: {
        type: String,
        required: true
      },
      color: {
        type: String,
        required: true
      },
      year: {
        type: Number,
        required: true
      },
      licensePlate: {
        type: String,
        required: true,
        unique: true
      },
      vin: {
        type: String,
        required: true,
        unique: true
      },
      registrationExpiry: {
        type: Date,
        required: true
      },
      registrationVerified: {
        type: Boolean,
        default: false
      },
      registrationDocument: {
        type: String // URL to registration document
      },
      insuranceExpiry: {
        type: Date,
        required: true
      },
      insuranceVerified: {
        type: Boolean,
        default: false
      },
      insuranceDocument: {
        type: String // URL to insurance document
      },
      pollutionCertificate: {
        type: String // URL to pollution certificate
      },
      pollutionExpiryDate: {
        type: Date
      },
      seatingCapacity: {
        type: Number,
        default: 4
      },
      vehicleType: {
        type: String,
        enum: ['sedan', 'suv', 'hatchback', 'premium'],
        required: true
      }
    },
    // Bank Account for Payouts
    bankAccount: {
      accountHolderName: {
        type: String,
        required: true
      },
      accountNumber: {
        type: String,
        required: true
      },
      ifscCode: {
        type: String,
        required: true
      },
      bankName: {
        type: String,
        required: true
      },
      accountVerified: {
        type: Boolean,
        default: false
      }
    },
    // Emergency Contact
    emergencyContact: {
      name: {
        type: String,
        required: true
      },
      phone: {
        type: String,
        required: true
      },
      relationship: {
        type: String,
        required: true
      }
    },
    // Address
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
    // Driver Ratings & Statistics
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
    totalEarnings: {
      type: Number,
      default: 0
    },
    totalHours: {
      type: Number,
      default: 0
    },
    // Verification & Documents
    documents: {
      backgroundCheckPassed: {
        type: Boolean,
        default: false
      },
      backgroundCheckDate: Date,
      backgroundCheckDocument: String,
      policeVerificationPassed: {
        type: Boolean,
        default: false
      },
      policeVerificationDate: Date,
      aadharVerified: {
        type: Boolean,
        default: false
      },
      aadharNumber: String,
      panVerified: {
        type: Boolean,
        default: false
      },
      panNumber: String
    },
    // Account Status
    isActive: {
      type: Boolean,
      default: true
    },
    isOnline: {
      type: Boolean,
      default: false
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
    // Driver Preferences
    preferences: {
      acceptRideRequests: {
        type: Boolean,
        default: true
      },
      rideTypes: {
        type: [String],
        enum: ['economy', 'premium', 'xl'],
        default: ['economy']
      },
      acceptPooledRides: {
        type: Boolean,
        default: false
      },
      musicPreference: String,
      tempaturePreference: String,
      conversationLevel: {
        type: String,
        enum: ['quiet', 'normal', 'chatty'],
        default: 'normal'
      }
    },
    // Current Location
    currentLocation: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        default: [0, 0]
      }
    },
    // Last Updated Location
    lastLocationUpdate: {
      type: Date,
      default: Date.now
    },
    // Document Upload URLs
    uploadedDocuments: [
      {
        documentType: {
          type: String,
          enum: ['license', 'registration', 'insurance', 'vehicle_photo', 'pollution', 'aadhar', 'pan', 'background_check'],
          required: true
        },
        documentUrl: {
          type: String,
          required: true
        },
        uploadedAt: {
          type: Date,
          default: Date.now
        },
        expiryDate: Date,
        isVerified: {
          type: Boolean,
          default: false
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

// Index for geospatial queries
captainSchema.index({ 'homeAddress.coordinates': '2dsphere' });
captainSchema.index({ 'currentLocation': '2dsphere' });

module.exports = mongoose.model('Captain', captainSchema);
