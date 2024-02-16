const mongoose = require('mongoose');

const favoritesSchema = new mongoose.Schema({
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
    }
});

const favoritesModel = mongoose.model('Favorites', favoritesSchema);

module.exports = favoritesModel;