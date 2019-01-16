const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let user = new Schema({
    password: String,
    email: String,
    access_token: String
}, { timestamps: true });
module.exports = mongoose.model('Users', user);
