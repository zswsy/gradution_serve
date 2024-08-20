const Joi = require('joi')

const username=Joi.string().required()
const password=Joi.string().min(3).max(10).required()
const capture=Joi.string().required()

exports.loginSchema={
    body:{
        username,
        password,
        capture,
    }
}