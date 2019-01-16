const jwt = require('jsonwebtoken');
// const helpers = require('../../helpers/helpers');
const responses = require('../../helpers/responses');
const md5 = require('md5');
const _ = require('lodash');
const Joi = require('joi');
var objectId = require('mongodb').ObjectID;
const UserModel = require('../../models/User');
const sendGrid = require('../../services/sendgrid');

exports.createProject=async(req,res)=>{
    try{
    let ProjectModel=req.ProjectModel;
    let projectInfo=req.body;
    
   let createdProject= await ProjectModel.create(projectInfo);
    responses.success(res,'Successfully created a project',createdProject);
    }
    catch(e){
        responses.sendErrorMessage(res,'Something went wrong, fix it. You are A dev');
    }
}

exports.createTask=async(req,res)=>{
    try{
        let TaskModel=req.TaskModel;
        let userDetail=req.userDetail;

        let taskInfo=req.body;

        let createTask=await TaskModel.create(taskInfo);

        responses.success(res,'Successfully created a new task',createTask);
    }
    catch(e){
        responses.sendErrorMessage(res,'Something went wrong, fix it. You are A dev');
    }
}