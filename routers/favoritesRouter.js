const express = require('express')
const { addFavorite, viewFavorites } = require('../controllers/favoritesController')
const favoritesRouter = express.Router()

favoritesRouter.post("/add", addFavorite)
favoritesRouter.get("/view", viewFavorites)

module.exports = favoritesRouter