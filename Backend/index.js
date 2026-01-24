require('dotenv').config()
const express = require('express')
const app = express()
app.use(express.json())

const authRoutes = require('./componets/Auth/routes')
const vehicleManageRoutes = require('./componets/User/vehicles/routes')
const userProfile = require('./componets/User/profile/routes')
const parkingRoutes = require('./componets/Parking/routes')
const connectDB = require('./db/config')

connectDB();
app.get('/',(req,res)=>{
    return res.status(200).json({message:'Smart Digital  parking app running'})
})

app.use('/api/auth/',authRoutes)
app.use('/api/vehicles', vehicleManageRoutes)
app.use('/api/users', userProfile)
app.use('/api/parking', parkingRoutes)
PORT = process.env.PORT || 3000
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})
