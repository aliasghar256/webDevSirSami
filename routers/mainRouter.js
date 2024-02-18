const express = require('express')
const userRouter = require('./userRouter')
const authenticateToken = require('../middleware/auth')
const judgmentRouter = require('./judgmentRouter')
const favoritesRouter = require('./favoritesRouter')
const searchLogRouter = require('./searchLogRouter')
const actOrdinanceRouter = require('./actOrdinanceRouter')
const mainRouter = express.Router()

mainRouter.use('/user', userRouter)
mainRouter.use('/actordinance', actOrdinanceRouter)
//Middleware Added for all the routes after /judgment
mainRouter.use(authenticateToken)
mainRouter.use('/judgment', judgmentRouter)
mainRouter.use('/favorites', favoritesRouter)
mainRouter.use('/searchlog', searchLogRouter)
//mainRouter.post('/authtoken', (req, res) => res.send('Token Verified'))

module.exports = mainRouter