const express = require('express')
const { verifyUserMiddleware } = require('../Auth/middleware')
const { startparking, requestRetrieval, endparking, getActiveparking, getparkingHistory, getparkingById } = require('./controllers')
const router = express.Router()

router.use(verifyUserMiddleware)

router.post('/start', startparking)
router.patch('/request-retrieval', requestRetrieval)
router.patch('/end', endparking)
router.get('/active', getActiveparking)
router.get('/history', getparkingHistory)
router.get('/details', getparkingById)

module.exports = router
