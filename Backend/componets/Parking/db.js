const mongoose = require('mongoose')

const parkingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: true
    },

    assignedDriverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },

    location: {
      type: String,
      required: true
    },

    address: {
      type: String,
      required: true
    },

    parkingSlot: {
      type: String,
      default: null
    },

    taskType: {
      type: String,
      enum: ['park', 'retrieve'],
      default: 'park'
    },

    status: {
      type: String,
      enum: ['pending','assigned',  'in_progress', 'parked', 'completed', 'cancelled'],
      default: 'pending'
    },

    assignedAt: {
      type: Date,
      default: null
    },

    entryTime: {
      type: Date,
      default: null
    },

    exitTime: {
      type: Date,
      default: null
    },

    baseRate: {
      type: Number,
      default: 100
    },

    serviceFee: {
      type: Number,
      default: 30
    },

    gst: {
      type: Number,
      default: 20
    },

    totalAmount: {
      type: Number,
      required: true
    },

    paymentMethod: {
      type: String,
      enum: ['cash', 'upi', 'card'],
      required: true
    }
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('Parking', parkingSchema)
