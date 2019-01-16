
const ProjectModel=require('../models/Project');
const TaskModel=require('../models/Task');
const UserModel=require('../models/User');

//Attachs Mongoose models to request object.
const middleware = (req, res, next) => {
    req.ProjectModel=ProjectModel;
    req.TaskModel=TaskModel;
    req.UserModel=UserModel;
    next();
}

module.exports=middleware;