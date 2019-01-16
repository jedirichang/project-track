const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
config = require('./config.json');
var indexRouter = require('./routes/index');

app.use(cors());
app.use(bodyparser.urlencoded({
    limit: '50mb'
}));
app.use(bodyparser.json());

app.use('/', indexRouter);

// Connect to Mongoose instance
mongoose.connect(config.db);

let port = process.env.PORT || 9000;

app.listen(port, function (req, res) {
    console.log("app is listen on the port no ", port);
});