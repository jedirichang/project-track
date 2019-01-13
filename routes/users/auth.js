const express = require('express');
const router = express.Router();
const userAuthController=require('../../controllers/users/auth');

router.route('/signup')
      .post(userAuthController.signup);

exports.Router = router;