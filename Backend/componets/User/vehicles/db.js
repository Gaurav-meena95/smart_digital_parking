const mongoose = require('mongoose')
const vehicleSchema = new mongoose.Schema(
  {
    vehicleName: {
      type: String,
      required: true,
    },

    vehicleNumber: {
      type: String,
      required: true,
      unique: true,
    },

    ownerName: {
      type: String,
      required: true,
    },

    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    vehicleType: {
      type: String,
      enum: [
        "Car",
        "Bike",
        "Cycle",
        "Jeep",
        "Bus",
        "Truck",
        "Van",
        "Scooter",
        "Auto",
        "Tractor",
        "Ambulance",
        "FireTruck",
        "PoliceCar",
      ],
      default: "Car",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Vehicle", vehicleSchema);
