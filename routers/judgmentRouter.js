const express = require('express')
const { judgmentIdSearch,judgmentAdvancedSearch, judgmentKeywordSearch,judgementMultiSearch, caseYearSearch, partySearch, caseNoSearch, benchSearch, judgeIdSearch, modifyJudgmentText} = require('../controllers/judgmentController')
const { addToLog } = require('../controllers/searchLogController')
judgmentRouter = express.Router()

//Add log functiona s middleware function, search functions need elastic search but logs are working

//Addto logissue to be patched.
judgmentRouter.get('/searchbyid', judgmentIdSearch)
judgmentRouter.put('/modifyJudgement', modifyJudgmentText)
// judgmentRouter.use(addToLog)
judgmentRouter.get('/advanced_search',judgmentAdvancedSearch)
judgmentRouter.get('/keyword_search', judgmentKeywordSearch)

// judgmentRouter.get('/caseYearSearch', caseYearSearch)
// judgmentRouter.get('/partySearch', partySearch)
// judgmentRouter.get('/caseNoSearch', caseNoSearch)
// judgmentRouter.get('/benchSearch', benchSearch)
// judgmentRouter.get('/judgeIdSearch', judgeIdSearch)
// judgmentRouter.get('/judgementMultiSearch', judgementMultiSearch)




module.exports = judgmentRouter