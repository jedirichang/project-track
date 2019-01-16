const express = require('express');
const router = express.Router();
const userController=require('../../controllers/users');

router.route('/project')
      .post(userController.createProject);

exports.Router = router; 