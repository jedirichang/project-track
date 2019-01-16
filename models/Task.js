const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let task = new Schema({
    name:String,
    project:{type: Schema.Types.ObjectId, ref: 'Project' },
    startedAt:Date,
    stopedAt:Date,
    pausedAt:Date,
    createdBy:{type: Schema.Types.ObjectId, ref: 'Users' }
}, { timestamps: true });
module.exports = mongoose.model('Tasks', task);
