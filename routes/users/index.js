const express = require('express');
const router = express.Router();
const userController=require('../../controllers/users');

router.route('/project')
      .post(userController.createProject)
      .get(userController.getProjects)

router.route('/project/:projectid')
      .get(userController.getSingleProject);

router.route('/task')
      .get(userController.getAllTasks)
      .post(userController.createTask)

router.route('/task/:taskid')
      .get(userController.getSingleTask)

router.route('/task/:taskid/start')
      .post(userController.startTask);

router.route('/task/:taskid/pause')
      .post(userController.pauseTask);

router.route('/task/:taskid/resume')
      .post(userController.resumeTask);

      router.route('/task/:taskid/stop')
      .post(userController.stopTask);


exports.Router = router; 