const express = require('express');
const router = express.Router();
const userController = require('../../controllers/users');

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

router.route('/recipient')
      .get(userController.getRecipients)
      .post(userController.createRecipient)

router.route('/update/recipient/:recipientid')
      .put(userController.updateRecipient)

router.route('/update/project/:projectid')
      .put(userController.updateProject);

router.route('/update/project/pushRecipient/:projectid')
      .put(userController.pushRecipientToProject);

exports.Router = router;