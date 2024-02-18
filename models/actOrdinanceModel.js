const mongoose = require('mongoose');
const { Schema } = mongoose;

const actOrdinanceSchema = new Schema({
    ActOrdinanceName: { type: String, required: true, ref: 'User' },
    JudgmentIDs: [{ type: String, required: true }],
    Judgment_IDs: [{ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Judgment' }],
});

const actOrdinanceModel = mongoose.model('ActOrdinance', actOrdinanceSchema);


module.exports = actOrdinanceModel;