const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let recipients = new Schema({
    name: String,
    email:String
}, {
    timestamps: true
});
module.exports = mongoose.model('Recipients', recipients);