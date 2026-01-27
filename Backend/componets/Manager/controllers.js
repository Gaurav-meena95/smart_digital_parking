const Parking = require('../Parking/db')
const User = require('../Auth/db')
const { validationInput } = require('../utils/utils')
const bcrypt = require('bcrypt')

const getDashboardStats = async (req, res) => {
    try {
        if (!req.user || req.user.role !== 'manager') {
            return res.status(403).json({ message: 'Manager access required' })
        }

        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const activeCars = await Parking.countDocuments({
            status: 'in_progress'
        })

        const pendingRetrieval = await Parking.countDocuments({
            status: 'pending',
            taskType: 'retrieve'
        })

        const todayEntries = await Parking.countDocuments({
            createdAt: { $gte: today }
        })

        return res.status(200).json({
            activeCars,
            pendingRetrieval,
            todayEntries
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}
const getparkingAssignments = async (req, res) => {
    try {
        if (!req.user || req.user.role !== 'manager') {
            return res.status(403).json({ message: 'Manager access required' })
        }

        const { status } = req.query
        let query = {}

        if (status === 'pending') {
            query.status = 'pending'
        } else if (status === 'in_progress') {
            query.status = 'in_progress'
        }

        const parkings = await Parking.find(query).sort({ createdAt: -1 })
        return res.status(200).json(parkings)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

const addDriver = async (req, res) => {
    try {
        if (!req.user || req.user.role !== 'manager') {
            return res.status(403).json({ message: 'Manager access required' })
        }

        const { fullName, phone, email ,licenseNumber } = req.body
        const value = validationInput({ fullName, phone, email ,licenseNumber})
        if (value) {
            return res.status(400).json({ message: `Missing field: ${value}` })
        }

        const existing = await User.findOne({ email })
        if (existing) {
            return res.status(400).json({ message: 'Email already exists' })
        }

        const hashedPassword = await bcrypt.hash('Driver@123', 10)

        const newDriver = await User.create({
            name: fullName,
            email,
            password: hashedPassword,
            phone,
            role: 'driver',
            approvalStatus: 'pending',
            licenseNumber:licenseNumber
        })

        return res.status(201).json({
            message: 'Driver added successfully',
            newDriver
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Internal Server Error' })
    }
}

const reassignValet = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'manager') {
      return res.status(403).json({ message: 'Manager access required' })
    }
    
    const { parkingId, driverId } = req.body
    const value = validationInput({ parkingId, driverId })
    if (value) {
      return res.status(400).json({ message: `Missing field: ${value}` })
    }

    const parking = await Parking.findById(parkingId)
    if (!parking) {
      return res.status(404).json({ message: 'Parking not found' })
    }

    if (['completed', 'cancelled'].includes(parking.status)) {
      return res.status(400).json({
        message: `Cannot assign driver to ${parking.status} parking`
      })
    }

    const driver = await User.findById(driverId)
    if (!driver || driver.role !== 'driver') {
      return res.status(404).json({ message: 'Driver not found' })
    }

    if (parking.assignedDriverId?.toString() === driverId) {
      return res.status(400).json({ message: 'Driver already assigned' })
    }

    const updatedParking = await Parking.findByIdAndUpdate(
      parkingId,
      {
        assignedDriverId: driverId,
        assignedAt: new Date(),
        status: 'assigned'
      }
    )

    return res.status(200).json({
      message: 'Driver assigned successfully',
      parking: updatedParking
    })

  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}


const getAvailableDrivers = async (req, res) => {
    try {
        if (!req.user || req.user.role !== 'manager') {
            return res.status(403).json({ message: 'Manager access required' })
        }
        const drivers = await User.find({
            role: 'driver',
            approvalStatus: 'approved'
        })
        return res.status(200).json({ drivers })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Internal Server Error' })
    }
}

module.exports = { getDashboardStats, getparkingAssignments, addDriver, reassignValet, getAvailableDrivers }
