const express = require('express')
const { verifyUserMiddleware } = require('./middleware')
const { signup, login } = require('./controllers')
const router = express.Router()

router.post('/signup',signup)
router.post('/login',login)
router.get('/me',verifyUserMiddleware,(req,res)=>{
    res.status(200).json(req.user)
})

module.exports = router
