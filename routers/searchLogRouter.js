const express = require('express')
const { retrieveUserSearchLog, deleteUserSearchLogEntry } = require('../controllers/searchLogController')
const searchLogRouter = express.Router()

//Add to log setup as middleware function in judgmentRouter
searchLogRouter.get('/getlog', retrieveUserSearchLog)
searchLogRouter.delete('/deletelogentry', deleteUserSearchLogEntry)

module.exports = searchLogRouter