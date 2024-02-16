const express = require('express')
const favoritesModel = require('../models/favoritesModel')

const addFavorite = async (req, res) => {
    try {
        const judgmentId = req.headers.judgmentid
        const favoriteAdded = await favoritesModel.create({ userID: req.userId, judgmentID: judgmentId })
        if (favoriteAdded) return res.status(200).json({ Message: "Favorite Added", favorite: favoriteAdded })
        else {
            return res.status(404).json({ Message: "Error! Favorite not added" })
        }
    }
    catch (error) {
        return res.status(500).json({ message: "Error! " + error.message })
    }
}

module.exports = addFavorite