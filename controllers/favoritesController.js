const express = require('express')
const favoritesModel = require('../models/favoritesModel')

const addFavorite = async (req, res) => {
    try {
        const judgmentId = req.headers.judgmentid
        //Already Favorited?
        let favoriteAdded = await favoritesModel.findOne({ userID: req.userId, judgmentID: judgmentId })
        if (favoriteAdded) return res.status(409).json({ Message: "Error! Already Favorited", favorite: favoriteAdded })
        else {
            //Create favorite
            favoriteAdded = await favoritesModel.create({ userID: req.userId, judgmentID: judgmentId })
            if (favoriteAdded) return res.status(200).json({ Message: "Favorite Added", favorite: favoriteAdded })
        }
        return res.status(404).json({ Message: "Error! Favorite not added" })
    }
    catch (error) {
        return res.status(500).json({ message: "Error! " + error.message })
    }
}

const viewFavorites = async (req, res) => {
    try {
        const favorites = await favoritesModel.find({ userID: req.userId })
        if (favorites) return res.status(200).json({ Message: "Favorites", favorites: favorites })
        return res.status(404).json({ Message: "Error! No Favorites Found" })
    } catch (error) {
        return res.status(500).json({ message: "Error! " + error.message })
    }
}
module.exports = { addFavorite, viewFavorites }