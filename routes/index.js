const express = require('express');
const router = express.Router();

const userAuthMiddleware=require('../middlewares/userAuth');
const attachCollections=require('../middlewares/attachCollections');

const userAuthRoute=require('./users/auth').Router;
const userRoute=require('./users').Router;


router.use('/user/auth',attachCollections,userAuthRoute);
router.use('/user',attachCollections,userAuthMiddleware,userRoute);

module.exports = router;