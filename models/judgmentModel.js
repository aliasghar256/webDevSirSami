const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const { Schema } = mongoose;

const judgmentSchema = new Schema({
    JudgmentID: { type: Number, required: true, unique: true },
    CaseYear: { type: Number, required: true },
    Party1: { type: String, required: true },
    Party2: { type: String, required: true },
    Bench: { type: String, required: false },
    CaseDate: { type: Date, required: false },
    AFR: { type: String, required: false },
    JudgeID: { type: Number, required: false },
    JudgmentText: { type: String, required: false },
    CaseNo: { type: String, required: false }
});

judgmentSchema.plugin(mongoosePaginate);
const judgmentmodel = mongoose.model('Judgment', judgmentSchema, 'Judgments');


module.exports = judgmentmodel;