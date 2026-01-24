const dotenv = require('dotenv')
const mongoose = require("mongoose");
// dotenv.config({path:""})
const url = process.env.MONGO_URI
if (!url) {
    throw new Error("MONGO_URI is undefined. Check your .env file location.");
}

const connectDB = async () => {
    try {
        await mongoose.connect(url, {
            dbName: 'smart_digital_parking_sys'
        })
        console.log('MongoDB connected successfully')

    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1);
    }
}
module.exports = connectDB;