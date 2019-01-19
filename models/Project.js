const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let project = new Schema({
    name: String,
    recipients: []
}, {
    timestamps: true
});
module.exports = mongoose.model('Projects', project);