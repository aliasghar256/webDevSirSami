const mongoose = require('mongoose');

const userNoteSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    judgmentID: {
        type: Number,
        required: true
    },
    judgment_ID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Judgment',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    note: {
        type: String,
        required: true
    }
});

const userNoteModel = mongoose.model('usernotes', userNoteSchema);

module.exports = userNoteModel;