const express = require('express')
const { addActOrdinance, addJudgmentToActOrdinance, getJudgmentsOfActOrdinance, removeJudgmentFromActOrdinance, removeActOrdinance } = require('../controllers/actOrdinanceController')
const actOrdinanceRouter = express.Router()

actOrdinanceRouter.post('/add', addActOrdinance)
actOrdinanceRouter.put('/addjudgment', addJudgmentToActOrdinance)
actOrdinanceRouter.put('/removejudgment', removeJudgmentFromActOrdinance)
actOrdinanceRouter.get('/getjudgments', getJudgmentsOfActOrdinance)
actOrdinanceRouter.delete('/remove', removeActOrdinance)

module.exports = actOrdinanceRouter
