const express = require('express')
const judgmentmodel = require('../models/judgmentModel')

const judgmentIdSearch = async (req, res) => {
    try {
        const id = req.headers.judgmentId
        const judgmentFound = await judgmentmodel.findOne({ judgmentId: id })
        if (judgmentFound) return res.status(200).json({ Message: "Judgment Found", judgment: judgmentFound })

        return res.status(404).json({ Message: "Error! Judgment not found" })
    } catch (error) {
        return res.status(500).json({ message: "Error! " + error.message })

    }
}

module.exports = judgmentIdSearch