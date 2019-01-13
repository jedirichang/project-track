const jwt = require('jsonwebtoken');
// const helpers = require('../../helpers/helpers');
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
            email: Joi.email().required(),
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

        // user_information.createdAt = new Date();
        // user_information.createdAtIso = user_information.createdAt.toISOString();

        UserModel
            .findOne({
                username: user_information.email
            })
            .then(alreadyExistingUser => {
                if (alreadyExistingUser) {
                    responses.alreaedyExists(res, 'User with this Email Already Exists');
                } else {
                    user_information.password = md5(user_information.password);
                    user_information.email = user_information.email;
                    user_information.password = user_information.password;
                    await UserModel.create(user_information)
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