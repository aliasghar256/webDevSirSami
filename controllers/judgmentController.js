const express = require('express')
const judgmentmodel = require('../models/judgmentModel')

const judgmentIdSearch = async (req, res) => {
    try {
        const id = Number(req.headers.searchvalue)
        const judgmentFound = await judgmentmodel.findOne({ JudgmentID: id })
        if (judgmentFound) return res.status(200).json({ Message: "Judgment Found", judgment: judgmentFound })

        return res.status(404).json({ Message: "Error! Judgment not found" })
    } catch (error) {
        return res.status(500).json({ message: "Error! " + error.message })

    }
}

const judgmentValueSearch = async (req, res) => {
    try {
        const searchValue = req.headers.searchvalue
        const judgmentFound = await judgmentmodel.find({ JudgmentText: searchValue })
        if (!judgmentFound) return res.status(404).json({ Message: "Error! Judgment not found" })

        return res.status(200).json({ Message: "Judgment(s) Found", judgment: judgmentFound })
    } catch (error) {
        return res.status(500).json({ message: "Error! " + error.message })
    }
}

module.exports = { judgmentIdSearch, judgmentValueSearch }