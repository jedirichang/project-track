const jwt = require('jsonwebtoken');
// const helpers = require('../../helpers/helpers');
const responses = require('../../helpers/responses');
const md5 = require('md5');
const _ = require('lodash');
const Joi = require('joi');
var objectId = require('mongodb').ObjectID;
const UserModel = require('../../models/User');
const sendGrid = require('../../services/sendgrid');
const timeHelper = require('../../helpers/time');


exports.createProject = async (req, res) => {
    try {
        let ProjectModel = req.ProjectModel;
        let projectInfo = req.body;

        let createdProject = await ProjectModel.create(projectInfo);
        responses.success(res, 'Successfully created a project', createdProject);
    } catch (e) {
        responses.sendErrorMessage(res, 'Something went wrong, fix it. You are A dev');
    }
}

exports.getProjects = async (req, res) => {
    try {
        let ProjectModel = req.ProjectModel;
        let projects = await ProjectModel.find();
        responses.success(res, 'Successfully fetched Projects', projects);
    } catch (e) {
        responses.sendErrorMessage(res, 'Something went wrong');
    }
}

exports.getSingleProject = async (req, res) => {
    try {
        let query = req.params.projectid;
        let ProjectModel = req.ProjectModel;
        let project = await ProjectModel.findOne({
            _id: query
        });
        responses.success(res, 'Project successfully fethced', project);
    } catch (e) {
        console.log(e);
        responses.sendErrorMessage(res, 'Something Went Wrong')
    }
}

exports.createTask = async (req, res) => {
    try {
        let TaskModel = req.TaskModel;

        let taskInfo = req.body;
        taskInfo.createdBy = req.userDetail._id;

        let createTask = await TaskModel.create(taskInfo);

        responses.success(res, 'Successfully created a new task', createTask);
    } catch (e) {
        responses.sendErrorMessage(res, 'Something went wrong, fix it. You are A dev');
    }
}

exports.getAllTasks = async (req, res) => {
    try {
        let TaskModel = req.TaskModel;
        let {
            projectid
        } = req.body;

        let tasks = await TaskModel.find({
            project: projectid
        });
        responses.success(res, 'Successfully fetched all tasks', tasks);

    } catch (e) {
        responses.sendErrorMessage(res, 'Something went wrong');
    }
}

exports.getSingleTask = async (req, res) => {
    try {
        let TaskModel = req.TaskModel;
        let query = req.params.taskid;
        let task = await TaskModel.findOne({
            _id: query
        }).populate('project');
        responses.success(res, 'Successfully fetched task', task);
    } catch (e) {
        console.log(e)
        responses.sendErrorMessage(res, 'Something went wrong');
    }
}

exports.startTask = async (req, res) => {
    try {
        let TaskModel = req.TaskModel;
        let taskid = req.params.taskid;
        await TaskModel.findByIdAndUpdate(taskid, {
            $set: {
                startedAt: new Date()
            }
        })
        responses.success(res, 'Task Successfully started');
    } catch (e) {
        responses.sendErrorMessage(res, 'Something went wrong');
    }
}

exports.pauseTask = async (req, res) => {
    try {
        let TaskModel = req.TaskModel;
        let taskid = req.params.taskid;
        let task = await TaskModel.findById(taskid);

        if (task.is_completed)
            return responses.sendErrorMessage(res, 'Task Already Completed');

        if (task.is_paused)
            return responses.sendErrorMessage(res, 'Task Already Paused');
        let currentTimeStamp = new Date();
        let minutes;
        if (!task.pausedAt) {
            let startTime = task.get('startedAt');
            minutes = timeHelper.getMinutesDiff(startTime, currentTimeStamp);
        } else {
            let pauseTime = task.get('pausedAt');
            minutes = timeHelper.getMinutesDiff(pauseTime, currentTimeStamp);
        }

        task.pausedAt = currentTimeStamp;
        task.is_paused = true;
        task.totalTime += minutes;
        task.humanReadableTime = timeHelper.convertMinutesToHumanReadableTime(task.totalTime);

        await task.save();

        responses.success(res, 'Task Successfully paused', task);
    } catch (e) {
        console.log(e)
        responses.sendErrorMessage(res, 'Something went wrong');
    }
}

exports.resumeTask = async (req, res) => {
    try {
        let TaskModel = req.TaskModel;
        let taskid = req.params.taskid;
        let task = await TaskModel.findById(taskid);

        if (task.is_completed)
            return responses.sendErrorMessage(res, 'Task Already Completed');

        if (!task.is_paused)
            return responses.sendErrorMessage(res, 'Task Already running');
        let currentTimeStamp = new Date();

        task.is_paused = false;
        task.pausedAt = currentTimeStamp;

        await task.save();
        //Increase totalTime and set is_paused:false and set pauseTime to currentTimeStamp
        responses.success(res, 'Task Successfully resumed', task);

    } catch (e) {
        console.log(e)
        responses.sendErrorMessage(res, 'Something went wrong');
    }
}

exports.stopTask = async (req, res) => {
    try {
        let TaskModel = req.TaskModel;
        let taskid = req.params.taskid;
        let task = await TaskModel.findById(taskid);

        if (task.is_completed)
            return responses.sendErrorMessage(res, 'Task Already Completed');

        if (task.is_completed)
            return responses.sendErrorMessage(res, 'Task Already Completed');

        let currentTimeStamp = new Date();
        let startTime = task.startedAt;
        let minutes;

        if (task.pausedAt)
            startTime = task.pausedAt;

        minutes = timeHelper.getMinutesDiff(startTime, currentTimeStamp);

        if (task.is_paused)
            minutes = 0;

        task.is_paused = false;
        task.is_completed = true;
        task.totalTime += minutes;
        task.humanReadableTime = timeHelper.convertMinutesToHumanReadableTime(task.totalTime);
        task.completedAt = minutes ? currentTimeStamp : task.pausedAt;

        await task.save();
        //Increase totalTime and set is_paused:false and set pauseTime to currentTimeStamp
        responses.success(res, 'Task Successfully Completed', task);

    } catch (e) {
        console.log(e)
        responses.sendErrorMessage(res, 'Something went wrong');
    }
}

exports.getRecipients = async (req, res) => {
    try {
        let RecipientModel = req.RecipientsModel;

        let recipients = await RecipientModel.find();

        responses.success(res, 'Successfully fetched recipients', recipients);
    } catch (e) {
        console.log(e);
        responses.sendErrorMessage(res, 'Error while fetching recipients')
    }
}

exports.createRecipient = async (req, res) => {
    try {
        let RecipientModel = req.RecipientsModel;

        let recipient = req.body;

        recipient = await RecipientModel.create(recipient);
        responses.success(res, 'Successfully Created Recipient', recipient);
    } catch (e) {
        console.log(e);
        responses.sendErrorMessage(res, 'Error while creating recipient');
    }
}

exports.updateRecipient = async (req, res) => {
    try {
        let RecipientModel = req.RecipientsModel;
        let recipientid = req.params.recipientid;
        let updateQuery = req.body;

        let recipient = await RecipientModel.findByIdAndUpdate(recipientid, {
            $set: updateQuery
        });
        responses.success(res, 'Successfully Created Recipient', recipient);
    } catch (e) {
        console.log(e);
        responses.sendErrorMessage(res, 'Error while creating recipient');
    }
}

exports.updateProject = async (req, res) => {
    try {
        let ProjectModel = req.ProjectModel;
        let updateQuery = req.body;
        let projectid = req.params.projectid;

         await ProjectModel.findByIdAndUpdate(projectid, {
            $set: updateQuery
        });

        responses.success(res, 'Successfully Updated the project', ProjectModel);
    } catch (e) {
        console.log(e);
        responses.sendErrorMessage(res, 'Error while updating the project');
    }
}

exports.pushRecipientToProject =async (req, res) => {
    try {
        let ProjectModel = req.ProjectModel;
        let newRecipients = req.body.newRecipients;
        let projectid = req.params.projectid;

        let project = await ProjectModel.findByIdAndUpdate(projectid, {
            $push: {
                "recipients": {
                    $each: newRecipients
                }
            }
        });

        responses.success(res, 'Successfully Updated the project', project);
    } catch (e) {
        console.log(e);
        responses.sendErrorMessage(res, 'Error while updating the project');
    }
}