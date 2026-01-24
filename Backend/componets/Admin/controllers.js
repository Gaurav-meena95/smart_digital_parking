const User = require('../Auth/db')
const Parking = require('../Parking/db')
const Vehicle = require('../User/vehicles/db')

const getDashboardStats = async (req, res) => {
    try {
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access required' })
        }
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)

        const yesterday = new Date(today)
        yesterday.setDate(yesterday.getDate() - 1)

        const todayparkings = await Parking.find({
            entryTime: { $gte: today, $lt: tomorrow }
        })

        const yesterdayparkings = await Parking.find({
            entryTime: { $gte: yesterday, $lt: today }
        })

        const totalparkings = await Parking.find({ status: 'completed' })

        const activeparkings = await Parking.find({ status: 'active' })

        const todayTickets = todayparkings.length
        const yesterdayTickets = yesterdayparkings.length

        const ticketsGrowth = yesterdayTickets > 0
            ? ((todayTickets - yesterdayTickets) / yesterdayTickets * 100).toFixed(1)
            : todayTickets > 0 ? 100 : 0

        const todayCollection = todayparkings.reduce((sum, p) => sum + p.totalAmount, 0)
        const yesterdayCollection = yesterdayparkings.reduce((sum, p) => sum + p.totalAmount, 0)

        const collectionGrowth = yesterdayCollection > 0
            ? ((todayCollection - yesterdayCollection) / yesterdayCollection * 100).toFixed(1)
            : todayCollection > 0 ? 100 : 0

        const totalCollection = totalparkings.reduce((sum, p) => sum + p.totalAmount, 0)

        const locationGroups = await Parking.aggregate([
            {
                $group: {
                    _id: "$location",
                    tickets: { $sum: 1 },
                    collection: { $sum: "$totalAmount" }
                }
            }
        ])

        const sites = await Promise.all(
            locationGroups.map(async (loc, index) => {
                const firstparking = await Parking.findOne({ location: loc._id })

                return {
                    id: `site-${index + 1}`,
                    name: loc._id,
                    address: firstparking?.address || '',
                    tickets: loc.tickets,
                    collection: loc.collection
                }
            })
        )

        res.status(200).json({
            data: {
                today: {
                    ticketsIssued: todayTickets,
                    collection: todayCollection,
                    ticketsGrowth: parseFloat(ticketsGrowth),
                    collectionGrowth: parseFloat(collectionGrowth)
                },
                overall: {
                    totalTickets: totalparkings.length,
                    totalCollection: totalCollection,
                    activeparking: activeparkings.length
                },
                sites
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

const getAllUsers = async (req, res) => {
    try {
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access required' })
        }
        const users = await User.find().sort({ createdAt: -1 })

        res.status(200).json({
            data: users
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

const getPendingDriverApprovals = async (req, res) => {
    try {
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access required' })
        }
        const pendingDrivers = await User.find({
            role: 'driver',
            approvalStatus: 'pending'
        }).sort({ createdAt: -1 })

        res.status(200).json({
            data: pendingDrivers
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

const approveDriver = async (req, res) => {
    try {
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access required' })
        }
        const { userId } = req.query
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' })
        }

        const user = await User.updateOne(
            {_id: userId },
            { approvalStatus: 'approved' },
        )

        res.status(200).json({
            message: 'Driver approved successfully',
            data: user
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

const rejectDriver = async (req, res) => {
    try {
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access required' })
        }
        const { userId } = req.query
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' })
        }
        const user = await User.updateOne(
            {_id: userId },
            
            { approvalStatus: 'rejected' },
        )

        res.status(200).json({
            message: 'Driver rejected successfully',
            data: user
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

const getAllparkings = async (req, res) => {
    try {
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access required' })
        }

        const parkings = await Parking.find().sort({ entryTime: -1 })
        res.status(200).json({
            data: parkings
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

module.exports = { getDashboardStats, getAllUsers, getAllparkings, getPendingDriverApprovals, approveDriver, rejectDriver }
