const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let task = new Schema({
    name:String,
    project:{type: Schema.Types.ObjectId, ref: 'Projects' },
    startedAt:Date,
    stopedAt:Date,
    pausedAt:Date,
    is_completed:{type:Boolean,default:false},
    is_paused:{type:Boolean,default:false},
    humanReadableTime:String,
    totalTime:{type:Number,default:0},
    createdBy:{type: Schema.Types.ObjectId, ref: 'Users' }
}, { timestamps: true });
module.exports = mongoose.model('Tasks', task);
