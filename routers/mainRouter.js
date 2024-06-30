const express = require('express')
const userRouter = require('./userRouter')
const authenticateToken = require('../middleware/auth')
const judgmentRouter = require('./judgmentRouter')
const favoritesRouter = require('./favoritesRouter')
const searchLogRouter = require('./searchLogRouter')
const actOrdinanceRouter = require('./actOrdinanceRouter')
const userNoteRouter = require('./userNoteRouter')
const mainRouter = express.Router()

mainRouter.use('/user', userRouter)
mainRouter.use('/actordinance', actOrdinanceRouter)
//mainRouter.use('/elasticsearch', elasticSearchRouter)
//Middleware Added for all the routes after /judgment
// mainRouter.use(authenticateToken)
mainRouter.use('/judgment', judgmentRouter)
mainRouter.use('/favorites', favoritesRouter)
mainRouter.use('/searchlog', searchLogRouter)
mainRouter.use('/usernote',userNoteRouter)
//mainRouter.post('/authtoken', (req, res) => res.send('Token Verified'))

module.exports = mainRouter