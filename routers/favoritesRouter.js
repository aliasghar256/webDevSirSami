const express = require('express')
const { addFavorite, viewFavorites, deleteFavorite, modifyFavorite } = require('../controllers/favoritesController')
const favoritesRouter = express.Router()

favoritesRouter.post("/add", addFavorite)
favoritesRouter.get("/view", viewFavorites)
favoritesRouter.delete("/delete", deleteFavorite)
favoritesRouter.put("/updateID", modifyFavorite)

module.exports = favoritesRouter