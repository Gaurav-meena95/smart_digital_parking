require('dotenv').config()
const express = require('express')
const app = express()
app.use(express.json())

const authRoutes = require('./componets/Auth/routes')
const connectDB = require('./db/config')

connectDB();
app.get('/',(req,res)=>{
    return res.status(200).json({message:'Smart Digital  parking app running'})
})

app.use('/api/auth/',authRoutes)
PORT = process.env.PORT || 3000
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})