const express = require('express')
const mongoose = require('mongoose')
const favoritesModel = require('../models/favoritesModel')
const judgmentModel = require('../models/judgmentModel')

//Adding a favorite (CRUD 1)
const addFavorite = async (req, res) => {
    try {
        const judgmentId = req.headers.judgmentid
        //Already Favorited?
        let favoriteAdded = await favoritesModel.findOne({ userID: req.userId, judgmentID: judgmentId })
        if (favoriteAdded) return res.status(409).json({ Message: "Error! Already Favorited", favorite: favoriteAdded })
        else {
            //Retrieve Judgment_ID
            const judgment = await judgmentModel.findOne({ JudgmentID: judgmentId })
            //Create favorite
            favoriteAdded = await favoritesModel.create({ userID: req.userId, judgmentID: judgmentId, judgment_ID: judgment._id })
            if (favoriteAdded) return res.status(200).json({ Message: "Favorite Added", favorite: favoriteAdded })
        }
        return res.status(404).json({ Message: "Error! Favorite not added" })
    }
    catch (error) {
        return res.status(500).json({ message: "Error! " + error.message })
    }
}

//Removing a favorite (CRUD 2)
const deleteFavorite = async (req, res) => {
    const favoriteID = req.headers.favoriteid
    try {
        const favoriteInstance = await favoritesModel.findByIdAndDelete({ _id: favoriteID })
        //const favoriteInstance = await favoritesModel.findOneAndDelete({ userID: req.userId, _id: favoriteID })
        if (favoriteInstance) return res.status(200).json({ Message: "Favorite Deleted", favorite: favoriteInstance })
        else return res.status(404).json({ Message: "Error! Favorite not found" })
    } catch (error) {
        return res.status(500).json({ message: "Error! " + error.message })
    }
}

//Viewing all favorites (CRUD 3)
const viewFavorites = async (req, res) => {
    try {
        const favorites = await favoritesModel.find({ userID: req.userId })
        if (favorites) return res.status(200).json({ Message: "Favorites", favorites: favorites })
        else return res.status(404).json({ Message: "Error! No Favorites Found" })
    } catch (error) {
        return res.status(500).json({ message: "Error! " + error.message })
    }
}

//modifying a favorite's JudgmentID (CRUD 4)
const modifyFavorite = async (req, res) => {
    const favoriteID = req.headers.favoriteid
    const newjudgmentId = req.headers.newjudgmentid
    const newjudgment_Id = await judgmentModel.findOne({ JudgmentID: newjudgmentId })._id
    try {
        const newFavorite = {
            userID: req.userId,
            judgmentID: newjudgmentId,
            judgment_ID: newjudgment_Id,
        }
        const favoriteInstance = await favoritesModel.findOneAndUpdate({ _id: favoriteID }, newFavorite, { new: true })
        if (favoriteInstance) return res.status(200).json({ Message: "Favorite Modified", favorite: favoriteInstance })
        else return res.status(404).json({ Message: "Error! Favorite not found" })
    } catch (error) {
        return res.status(500).json({ message: "Error! " + error.message })
    }
}
module.exports = { addFavorite, viewFavorites, deleteFavorite, modifyFavorite }