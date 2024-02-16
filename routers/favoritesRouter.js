const express = require('express')
const addFavorite = require('../controllers/favoritesController')
const favoritesRouter = express.Router()

favoritesRouter.post("/add", addFavorite)

module.exports = favoritesRouter