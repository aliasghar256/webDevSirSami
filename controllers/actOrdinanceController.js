const express = require('express')
const actOrdinanceModel = require('../models/actOrdinanceModel')
const judgmentmodel = require('../models/judgmentModel')

// CRUD1 Add an Ordinance/Act
const addActOrdinance = async (req, res) => {
    try {
        const { ActOrdinanceName, JudgmentIDs } = req.body

        if (!ActOrdinanceName || !JudgmentIDs) {
            return res.status(400).json({ error: 'Please provide Act/OrdinanceName, JudgmentIDs' })
        }
        //Does Act/Ordinance Already Exist?
        const actOrdinanceExist = await actOrdinanceModel.findOne({ ActOrdinanceName })
        if (actOrdinanceExist) return res.status(400).json({ error: 'Act/Ordinance already exists' })

        // Retrieve Judgment_IDs
        const Judgment_IDs = await judgmentmodel.find({ JudgmentID: JudgmentIDs }).select('_id')
        if (!Judgment_IDs) return res.status(404).json({ error: 'Judgment_IDs not found' })
        newData = { ActOrdinanceName, JudgmentIDs, Judgment_IDs }

        // Add New Act/Ordinance
        const actOrdinance = await actOrdinanceModel.create({ ActOrdinanceName: newData.ActOrdinanceName, JudgmentIDs: newData.JudgmentIDs, Judgment_IDs: newData.Judgment_IDs })
        return res.status(201).json({ Message: "New Act/Ordinance Added:", actOrdinance: actOrdinance })
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

//CRUD2 Modify an Act/Ordinance (By adding a new JudgmentID)
const addJudgmentToActOrdinance = async (req, res) => {
    try {
        const { ActOrdinanceName, JudgmentIDs } = req.body
        if (!ActOrdinanceName || !JudgmentIDs) {
            return res.status(400).json({ error: 'Please provide Act/OrdinanceName, JudgmentIDs' })
        }
        //Retrieve Act/Ordinance
        const actOrdinance = await actOrdinanceModel.findOne({ ActOrdinanceName })
        if (!actOrdinance) return res.status(404).json({ error: 'Act/Ordinance not found' })

        //Retrieve Judgment_ID
        const judgment = await judgmentmodel.find({ JudgmentID: JudgmentIDs }).select('_id')
        if (!judgment) return res.status(404).json({ error: 'Judgment not found' })

        //Add JudgmentID to Act/Ordinance
        const updatedActOrdinance = await actOrdinanceModel.findOneAndUpdate({ ActOrdinanceName }, { $push: { JudgmentIDs: JudgmentIDs, Judgment_IDs: judgment } }, { new: true })
        return res.status(200).json({ Message: "Judgment(s) Added to Act/Ordinance:", actOrdinance: updatedActOrdinance })
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

//CRUD3 Modify an Act/Ordinance (By removing JudgmentIDs)
const removeJudgmentFromActOrdinance = async (req, res) => {
    try {
        const { ActOrdinanceName, JudgmentIDs } = req.body;

        if (!ActOrdinanceName || !JudgmentIDs) {
            return res.status(400).json({ error: 'Please provide Act/OrdinanceName and JudgmentIDs' });
        }

        // Retrieve Act/Ordinance
        let actOrdinance = await actOrdinanceModel.findOne({ ActOrdinanceName });
        if (!actOrdinance) {
            return res.status(404).json({ error: 'Act/Ordinance not found' });
        }

        //Does JudgmentID exist in Act/Ordinance?
        let judgmentExist = actOrdinance.JudgmentIDs.includes(JudgmentIDs)
        if (!judgmentExist) return res.status(400).json({ error: 'JudgmentID does not exist in Act/Ordinance' })

        //Retrieve Judgment_IDs
        let judgment_Ids = await judgmentmodel.find({ JudgmentID: JudgmentIDs })
        if (!judgment_Ids) return res.status(404).json({ error: 'Judgment_IDs not found' })

        judgment_Ids = judgment_Ids.map(judgment => judgment._id)

        // Remove specified JudgmentIDs from the Act/Ordinance
        actOrdinance = await actOrdinanceModel.findOneAndUpdate(
            { ActOrdinanceName },
            { $pull: { JudgmentIDs: JudgmentIDs } },
            { $pull: { Judgment_IDs: judgment_Ids } },
            { new: true }
        );

        return res.status(200).json({ Message: "Judgment(s) Removed from Act/Ordinance:", actOrdinance });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};


//CRUD 3 Retrieve all Judgments of an Act/Ordinance & Populates
const getJudgmentsOfActOrdinance = async (req, res) => {
    try {
        const actOrdinanceName = req.headers.actordinancename
        const actOrdinance = await actOrdinanceModel.find({ ActOrdinanceName: actOrdinanceName }).populate('Judgment_IDs')
        if (!actOrdinance) return res.status(404).json({ error: 'Judgments not found' })
        return res.status(200).json({ Message: "Judgments of Act/Ordinance:", ActOrdinance: actOrdinance })
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

//Remove an Act/Ordinance
const removeActOrdinance = async (req, res) => {
    try {
        const actOrdinanceName = req.headers.actordinancename
        const actOrdinance = await actOrdinanceModel.findOneAndDelete({ ActOrdinanceName: actOrdinanceName })
        if (!actOrdinance) return res.status(404).json({ error: 'Act/Ordinance not found' })
        return res.status(200).json({ Message: "Act/Ordinance Deleted:", actOrdinance })
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}
module.exports = { addActOrdinance, addJudgmentToActOrdinance, getJudgmentsOfActOrdinance, removeJudgmentFromActOrdinance, removeActOrdinance }