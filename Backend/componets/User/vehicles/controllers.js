const { validationInput } = require("../../utils/utils")
const Vehicle = require('./db')


const addVehicles = async (req, res) => {
    try {
        const { vehicleName, vehicleNumber, ownerName, vehicleType } = req.body

        const value = validationInput({ vehicleName, vehicleNumber, ownerName, vehicleType })
        if (value) {
            return res.status(400).json({ message: `Missing field: ${value}` })
        }

        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'Unauthorized' })
        }

        const existingVehicle = await Vehicle.findOne({ vehicleNumber })
        if (existingVehicle) {
            return res.status(409).json({
                message: 'Vehicle with this number already exists'
            })
        }

        const vehicle = await Vehicle.create({
            vehicleName,
            vehicleNumber,
            ownerName,
            ownerId: req.user.id,
            vehicleType
        })

        res.status(201).json({
            message: 'Vehicle added successfully',
            data: vehicle
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}


const updateVehicles = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'Unauthorized' })
        }

        const { vehicleId } = req.query
        const { vehicleName, ownerName, vehicleType, isActive } = req.body

        const existingVehicle = await Vehicle.findOne({
            _id: vehicleId,
            ownerId: req.user.id
        })
        console.log(existingVehicle)
        if (!existingVehicle) {
            return res.status(404).json({ message: 'Vehicle not found or access denied' })
        }

        const vehicle = await Vehicle.findByIdAndUpdate(
            vehicleId,
           { vehicleName,
            ownerName,
            vehicleType,
            isActive}
        )

        res.status(200).json({
            message: 'Vehicle updated successfully',
            data: vehicle
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}



const deleteVehicles = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'Unauthorized' })
        }

        const { id } = req.query

        const vehicle = await Vehicle.findOne({
            _id: id,
            ownerId: req.user.id
        })

        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found or access denied' })
        }

        const deleteedVehical = await Vehicle.deleteOne({_id:id})
        res.status(200).json({
            deleteedVehical,
            message: 'Vehicle deleted successfully'
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}


const getAllVehicles = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'Unauthorized' })
        }

        const vehicles = await Vehicle.find({
            ownerId: req.user.id
        }).sort({ createdAt: -1 })

        res.status(200).json({
            
            message: 'Vehicles fetched successfully',
            data: vehicles
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}





module.exports = { addVehicles, updateVehicles, deleteVehicles, getAllVehicles }