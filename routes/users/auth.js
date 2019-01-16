const express = require('express');
const router = express.Router();
const userAuthController=require('../../controllers/users/auth');

router.route('/signup')
      .post(userAuthController.signup);

router.route('/login')
      .post(userAuthController.login)

exports.Router = router; 