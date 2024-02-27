const express = require('express')
const elasticSearchRouter = express.Router()

elasticSearchRouter.get('/', basicSearch)

module.exports = elasticSearchRouter