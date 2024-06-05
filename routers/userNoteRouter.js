const express = require('express')
const { addNote,viewNote,modifyNote} = require('../controllers/userNoteController')
const userNoteRouter = express.Router()

userNoteRouter.post("/add", addNote)
userNoteRouter.get("/view", viewNote)
// userNoteRouter.delete("/delete", deleteFavorite)
userNoteRouter.put("/update", modifyNote)

module.exports = userNoteRouter