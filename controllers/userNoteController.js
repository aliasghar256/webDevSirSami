const express = require('express')
const mongoose = require('mongoose')
const userNoteModel = require('../models/userNoteModel')
const judgmentModel = require('../models/judgmentModel')

//Adding a favorite (CRUD 1)
const addNote = async (req, res) => {
    try {
        const judgmentId = req.headers.judgmentid; // Ensure this matches the header key in your request
        const note = req.body.note;

        // Already Added?
        let noteAdded = await userNoteModel.findOne({ userID: req.userId, judgmentID: judgmentId });
        if (noteAdded) {
            // Update the note value
            // console.log("Already ADded, New Notw; ",note)
            noteAdded.note = note;
            // Save the updated user note
            await noteAdded.save();
            return res.status(200).json({ Message: "Note Modified", userNote: userNote });
        } else {
            // Retrieve Judgment_ID
            const judgment = await judgmentModel.findOne({ JudgmentID: judgmentId });
            if (!judgment) {
                return res.status(404).json({ Message: "Error! Judgment not found" });
            }

            // Create favorite
            noteAdded = await userNoteModel.create({ userID: req.userId, judgmentID: judgmentId, judgment_ID: judgment._id, note: note });
            if (noteAdded) {
                return res.status(200).json({ Message: "Note Added", note: noteAdded });
            }
        }
        return res.status(404).json({ Message: "Error! Favorite not added" });
    } catch (error) {
        return res.status(500).json({ message: "Error! " + error.message });
    }
};


//Removing a favorite (CRUD 2)
const deleteNote = async (req, res) => {
    const JudgmentID = req.headers.JudgmentID
    try {
        const favoriteInstance = await favoritesModel.findOneAndDelete({ userID:req.userId,JudgmentID: JudgmentID });
        //const favoriteInstance = await favoritesModel.findOneAndDelete({ userID: req.userId, _id: favoriteID })
        if (favoriteInstance) return res.status(200).json({ Message: "Favorite Deleted", favorite: favoriteInstance })
        else return res.status(404).json({ Message: "Error! Favorite not found" })
    } catch (error) {
        return res.status(500).json({ message: "Error! " + error.message })
    }
}

//Viewing all favorites (CRUD 3)
const viewNote = async (req, res) => {
    const judgmentid = req.headers.judgmentid
    try {
        const note = await userNoteModel.findOne({ userID: req.userId,judgmentID:judgmentid })
        if (note) return res.status(200).json({ Message: "Note", note: note })
        else return res.status(404).json({ Message: "Error! No Note Found" })
    } catch (error) {
        return res.status(500).json({ message: "Error! " + error.message })
    }
}

const modifyNote = async (req, res) => {
    const judgmentid = req.headers.judgmentid;
    const note = req.body.note; // Assuming the new note value is sent in the request body

    try {
        // Find the user note with the specified judgmentID and userID
        const userNote = await userNoteModel.findOne({ judgmentID: judgmentid, userID: req.userId });

        if (!userNote) {
            return res.status(404).json({ Message: "Error! User note not found" });
        }

        // Update the note value
        userNote.note = note;

        // Save the updated user note
        await userNote.save();

        return res.status(200).json({ Message: "Note Modified", userNote: userNote });

    } catch (error) {
        return res.status(500).json({ message: "Error! " + error.message });
    }
};


module.exports = { addNote, viewNote, deleteNote, modifyNote }