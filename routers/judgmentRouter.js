const express = require('express')
const { judgmentIdSearch, judgmentValueSearch,basicSearch } = require('../controllers/judgmentController')
const { addToLog } = require('../controllers/searchLogController')
judgmentRouter = express.Router()

//Add log functiona s middleware function, search functions need elastic search but logs are working

judgmentRouter.use(addToLog)
judgmentRouter.get('/searchID', judgmentIdSearch)
judgmentRouter.get('/searchValue', judgmentValueSearch)
judgmentRouter.get('/basicSearch', basicSearch)


module.exports = judgmentRouter