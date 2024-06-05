const express = require('express')
const searchLogModel = require('../models/searchLogModel')

//CRUD 1 Create/Add to Log
const addToLog = async (req, res, next) => {
    try {
        const searchValue = req.headers.keyword
        const userID = req.userId
        if (!searchValue) {
            return res.status(400).json({ message: "Error! No search value" })
        }
        const addition = await searchLogModel.create({ UserID: userID, searchValue: searchValue })
        next()
    } catch (error) {
        return res.status(500).json({ message: "Error! " + error.message })
    }
}

//CRUD 2 Retrieve/Read Log
const retrieveUserSearchLog = async (req, res) => {
    try {
        const userID = req.userId
        const searchLog = await searchLogModel.find({ UserID: userID })
        if (!searchLog) {
            return res.status(404).json({ message: "Error! No search log found" })
        }
        return res.status(200).json({ message: "Search Log", searchLog: searchLog })
    } catch (error) {
        return res.status(500).json({ message: "Error! " + error.message })
    }
}

//Update doesn't apply here

//CRUD 3 Delete/Remove from Log
const deleteUserSearchLogEntry = async (req, res) => {
    try {
        const userID = req.userId
        const entryID = req.headers.entryid
        const deletion = await searchLogModel.findOneAndDelete({ _id: entryID })
        if (!deletion) {
            return res.status(404).json({ message: "Error! No search log found" })
        }
        return res.status(200).json({ message: "Search Log Deleted", searchLog: deletion })
    } catch (error) {
        return res.status(500).json({ message: "Error! " + error.message })
    }
}

module.exports = { addToLog, retrieveUserSearchLog, deleteUserSearchLogEntry }