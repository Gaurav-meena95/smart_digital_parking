const Parking = require('../Parking/db')

const getAssignments = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'Unauthorized' })
        }
        if (req.user.role !== 'driver') {
            return res.status(403).json({ message: 'Access denied. Driver role required.' })
        }
        const assignments = await Parking.find({
            assignedDriverId: req.user.id,
            status: 'pending'
        }).sort({ assignedAt: -1 })

        res.status(200).json({
            message: "Assignment fetched successfully",
            data: assignments
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

const getCurrentAssignment = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'Unauthorized' })
        }

        if (req.user.role !== 'driver') {
            return res.status(403).json({ message: 'Access denied. Driver role required.' })
        }

        const assignment = await Parking.findOne({
            assignedDriverId: req.user.id,
            status: 'in_progress'
        }).sort({ assignedAt: -1 })

        res.status(200).json({
            success: true,
            data: assignment
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

const acceptAssignment = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'Unauthorized' })
        }

        if (req.user.role !== 'driver') {
            return res.status(403).json({ message: 'Access denied. Driver role required.' })
        }

        const { parkingId } = req.query
        if (!parkingId) {
            return res.status(400).json({ message: 'parkingId is required' })
        }

        const activeAssignment = await Parking.findOne({
            assignedDriverId: req.user.id,
            status: 'in_progress'
        })

        if (activeAssignment) {
            return res.status(400).json({
                message: 'You already have an active assignment. Please complete it first.'
            })
        }

        const parking = await Parking.findOne({
            _id: parkingId,
            assignedDriverId: req.user.id,
            status: 'pending'
        })

        if (!parking) {
            return res.status(404).json({
                message: 'Assignment not found or already accepted'
            })
        }
        const updatedparking = await Parking.updateOne(
            { _id: parkingId },
            { status: 'in_progress' }
        )

        res.status(200).json({
            message: 'Assignment accepted successfully',
            data: updatedparking
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

const rejectAssignment = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'Unauthorized' })
        }

        if (req.user.role !== 'driver') {
            return res.status(403).json({ message: 'Access denied. Driver role required.' })
        }

        const { parkingId } = req.query
        if (!parkingId) {
            return res.status(400).json({ message: 'parkingId is required' })
        }

        const parking = await Parking.findOne({
            _id: parkingId,
            assignedDriverId: req.user.id,
            status: 'pending'
        })

        if (!parking) {
            return res.status(404).json({
                message: 'Assignment not found or already processed'
            })
        }

        const rejected_Parking = await Parking.updateOne(
            { _id: parkingId },
            { assignedDriverId: null, assignedAt: null }
        )

        res.status(200).json({
            message: 'Assignment rejected successfully',
            rejected_Parking
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

const completeTask = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'Unauthorized' })
        }

        if (req.user.role !== 'driver') {
            return res.status(403).json({ message: 'Access denied. Driver role required.' })
        }

        const { parkingId } = req.query
        if (!parkingId) {
            return res.status(400).json({ message: 'parkingId is required' })
        }

        const parking = await Parking.findOne({
            _id: parkingId,
            assignedDriverId: req.user.id,
            status: 'in_progress'
        })

        if (!parking) {
            return res.status(404).json({ message: 'Active assignment not found' })
        }

        const updatedparking = await Parking.updateOne(
            { _id: parkingId },
            { status: 'completed', exitTime: new Date() }
        )
        res.status(200).json({
            message: 'Task completed successfully',
            data: updatedparking
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

module.exports = { getAssignments, getCurrentAssignment, acceptAssignment, rejectAssignment, completeTask }
