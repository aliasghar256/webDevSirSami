const mongoose = require('mongoose');
const { Schema } = mongoose;

const searchLogSchema = new Schema({
    UserID: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    searchValue: { type: String, required: true },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const searchLogModel = mongoose.model('SearchLog', searchLogSchema);


module.exports = searchLogModel;