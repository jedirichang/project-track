const express = require('express');
const router = express.Router();

const userAuth=require('./users/auth').Router;

router.use('user/auth',userAuth);