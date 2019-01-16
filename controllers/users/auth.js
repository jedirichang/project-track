const jwt = require('jsonwebtoken');
const helpers = require('../../helpers/helpers');
const responses = require('../../helpers/responses');
const md5 = require('md5');
const _ = require('lodash');
const Joi = require('joi');
var objectId = require('mongodb').ObjectID;
const UserModel = require('../../models/User');
const sendGrid = require('../../services/sendgrid');

exports.signup = async (req, res) => {
    try {
        let user_information = req.body;
        const schema = Joi.object().keys({
            email: Joi.string().email().required(),
            password: Joi.string().required()
        })

        const result = Joi.validate(req.body, schema, {
            abortEarly: true
        });
        if (result.error) {
            console.log('******* JOI Validatio Error at user/signup_email : ', result.error);
            responses.parameterMissing(res, result.error.details[0].message);
            return;
        }

        UserModel
            .findOne({
                username: user_information.email
            })
            .then(async alreadyExistingUser => {
                if (alreadyExistingUser) {
                    responses.alreaedyExists(res, 'User with this Email Already Exists');
                } else {
                    user_information.password = md5(user_information.password);
                    user_information.email = user_information.email;
                    user_information.password = user_information.password;
                    await UserModel.create(user_information);
                    delete user_information.password
                    responses.success(res, `User Createdf Successfully`, user_information);
                }
            })

            //User Find With Email catch
            .catch((e) => {
                responses.sendErrorMessage(res, e.message);
                return;
            });
    }
    //Parent Try Catch
    catch (error) {
        console.log(error);
        responses.sendErrorMessage(res, error.message);
        return;
    }
}


exports.login = async (req, res) => {
    try {
        let user_information = req.body;
        const schema = Joi.object().keys({
            email: Joi.string().email().required(),
            password: Joi.string().required()
        })

        const result = Joi.validate(req.body, schema, {
            abortEarly: true
        });
        if (result.error) {
            console.log('******* JOI Validatio Error at user/signup_email : ', result.error);
            responses.parameterMissing(res, result.error.details[0].message);
            return;
        }

        UserModel
            .findOne({
                email: user_information.email
            })
            .then(async user => {
                if (user) {
                    if (md5(user_information.password) == user.password) {
                        if (user.access_token)
                            user.access_token = "";
                        user.access_token = helpers.getJWTToken(JSON.parse(JSON.stringify(user)));
                        await user.save();
                        delete user.password;
                        responses.success(res, 'Success', user);
                    }
                    else
                        responses.invalidCredential(res, 'Wrong Password');
                }
                else {
                    responses.invalidCredential(res, 'Email Not Registered');
                }
            })

            //User Find With Email catch
            .catch((e) => {
                responses.sendErrorMessage(res, e.message);
                return;
            });
    }
    //Parent Try Catch
    catch (error) {
        console.log(error);
        responses.sendErrorMessage(res, error.message);
        return;
    }
}
