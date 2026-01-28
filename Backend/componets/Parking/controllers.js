const { validationInput } = require('../../componets/utils/utils')
const Parking = require('./db')
const Vehicle = require('../User/vehicles/db')

const startparking = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'Unauthorized' })
        }
        const { vehicleId, location, address, paymentMethod } = req.body

        const value = validationInput({ vehicleId, location, address, paymentMethod })
        if (value) {
            return res.status(400).json({ message: `Missing field: ${value}` })
        }

        const vehicle = await Vehicle.findOne({
            _id: vehicleId,
            ownerId: req.user.id,
            isActive: true
        })

        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found' })
        }

        const activeparking = await Parking.findOne({
            userId: req.user.id,
            vehicleId,
            status: 'active'
        })

        if (activeparking) {
            return res.status(400).json({ message: 'Vehicle already has an active parking session' })
        }

        const baseRate = 100
        const serviceFee = 30
        const gst = 20
        const totalAmount = baseRate + serviceFee + gst

        const parking = await Parking.create({
            userId: req.user.id,
            vehicleId,
            location,
            address,
            entryTime: new Date(),
            baseRate,
            serviceFee,
            gst,
            totalAmount,
            paymentMethod,
            status: 'active'
        })


        return res.status(201).json({
            message: 'parking started successfully',
            data: parking




        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

const requestRetrieval = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'Unauthorized' })
        }

        const { parkingId } = req.body
        if (!parkingId) {
            return res.status(400).json({ message: 'parking ID is required' })
        }

        const parking = await Parking.findOne({
            _id: parkingId,
            userId: req.user.id,
        })

        if (!parking) {
            return res.status(404).json({ message: 'Active parking session not found' })
        }

        const updatedparking = await Parking.findByIdAndUpdate(
            parkingId,
            {
                taskType: 'Retrieve',
                status: 'pending',
                assignedDriverId: null,
                assignedAt: null
            }
        )
        res.status(200).json({
            message: 'Retrieval request submitted successfully',
            data: updatedparking
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

const endparking = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'Unauthorized' })
        }

        const { parkingId } = req.query

        const parking = await Parking.findOne({
            _id: parkingId,
            userId: req.user.id,
            status: { $in: ['pending', 'in_progress'] }
        })

        if (!parking) {
            return res.status(404).json({ message: 'Active parking session not found' })
        }
        const updatedparking = await Parking.findByIdAndUpdated(
            parkingId,
            { exitTime, status: 'completed' },
            { new: true }
        )
        res.status(200).json({
            message: 'parking ended successfully',
            data: { updatedparking }
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

const getActiveparking = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'Unauthorized' })
        }
       
        const parking = await Parking.findOne({
            userId: req.user.id,
            status: { $in: ['active', 'pending', 'in_progress'] }
        }).sort({ entryTime: -1 })

        if (!parking) {
            return res.status(404).json({ message: 'Active parking session not found' })
        }
         const vehicle = await Vehicle.findOne({
            _id: parking.vehicleId,
            ownerId: req.user.id,
            isActive: true
        })

        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found' })
        }
        return res.status(200).json({ 
            parking ,
            vehicle: {
                vehicleName: vehicle.vehicleName,
                ownerName: vehicle.ownerName,
            }
        })


    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

const getparkingHistory = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'Unauthorized' })
        }
        const parkings = await Parking.find({
            userId: req.user.id,
            status: 'completed'
        }).sort({ entryTime: -1 })

        res.status(200).json({
            data: parkings
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

const getparkingById = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'Unauthorized' })
        }

        const { parkingId } = req.query

        const parking = await Parking.findOne({
            _id: parkingId,
            userId: req.user.id
        })

        if (!parking) {
            return res.status(404).json({ message: 'parking not found' })
        }

        res.status(200).json({

            data: { parking }
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}



module.exports = { startparking, endparking, getActiveparking, getparkingHistory, getparkingById, requestRetrieval }
