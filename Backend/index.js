require('dotenv').config()
const express = require('express')
const app = express()
app.use(express.json())

app.get('/',(req,res)=>{
    return res.status(200).json({message:'Hello World !'})
})

PORT = process.env.PORT || 3000
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})