const express = require('express')
const { judgmentIdSearch, judgmentValueSearch,judgementMultiSearch, caseYearSearch, partySearch, caseNoSearch, benchSearch, judgeIdSearch} = require('../controllers/judgmentController')
const { addToLog } = require('../controllers/searchLogController')
judgmentRouter = express.Router()

//Add log functiona s middleware function, search functions need elastic search but logs are working

//Addto logissue to be patched.
judgmentRouter.get('/caseYearSearch', caseYearSearch)
judgmentRouter.get('/partySearch', partySearch)
judgmentRouter.get('/caseNoSearch', caseNoSearch)
judgmentRouter.get('/benchSearch', benchSearch)
judgmentRouter.get('/judgeIdSearch', judgeIdSearch)
judgmentRouter.get('/judgementMultiSearch', judgementMultiSearch)
// judgmentRouter.use(addToLog)
judgmentRouter.get('/searchbyid', judgmentIdSearch)
judgmentRouter.get('/searchValue', judgmentValueSearch)


module.exports = judgmentRouter