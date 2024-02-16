const express = require('express')
const userRouter = require('./userRouter')
const authenticateToken = require('../middleware/auth')
const mainRouter = express.Router()

mainRouter.use('/user', userRouter)
//Middleware Added for all the routes after /judgment
mainRouter.use('/judgment', authenticateToken)
//mainRouter.post('/authtoken', (req, res) => res.send('Token Verified'))

module.exports = mainRouter