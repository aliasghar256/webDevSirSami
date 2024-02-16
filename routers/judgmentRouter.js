const express = require('express')
const judgmentIdSearch = require('../controllers/judgmentController')
judgmentRouter = express.Router()

judgmentRouter.get('/searchID', judgmentIdSearch)

module.exports = judgmentRouter