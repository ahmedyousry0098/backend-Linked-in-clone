import joi from 'joi'
import mongoose from 'mongoose'
import {GENERAL_FIELDS} from '../../middlewares/validation.js'


export const changePasswordSchema = joi.object({
    profileId: GENERAL_FIELDS.Id.required().messages({
        "any.required": "ID is Required"
    }),
    oldPassword: GENERAL_FIELDS.password.required().messages({
        "any.required": "Old Password is Required",
        "string.pattern.base": "In-valid Password"
    }),
    password: GENERAL_FIELDS.password.required().messages({
        "any.required": "Password is Required",
        "string.pattern.base": "In-valid Password"
    }),
    confirmationPassword: GENERAL_FIELDS.confirmationPassword.valid(joi.ref('password')).required().messages({
        "any.required": "Confirmation Password is Required",
        "any.only": "Confirmation Password Must Equal Password",
    }),
}).required()

export const updateProfileSchema = joi.object({
    profileId: GENERAL_FIELDS.Id.required().messages({
        "any.required": "ID is Required"
    }),
    firstName: joi.string().regex(/^[A-Za-z][a-z]{3,15}$/).required().messages({
        "string.pattern.base": "Please Enter Your First Name Without Special Characters",
        "any.required": "First Name is Required"
    }),
    lastName: joi.string().regex(/^[A-Za-z][a-z]{3,15}$/),
})

export const pictrueSchema = joi.object({
    profileId: GENERAL_FIELDS.Id.required().messages({
        "any.required": "ID is Required"
    }),
    file: GENERAL_FIELDS.file.required()
}).required()

export const getProfileSchema = joi.object({
    id: GENERAL_FIELDS.Id.required(),
    authorization: joi.string().required(),
})

export const getAllUsersSchema = joi.object({
    authorization: joi.string().required(),
    page: joi.number().integer().positive(),
    limit: joi.number().integer().positive().max(100),
    search: joi.string(),
    sort: joi.string(),
    filter: joi.string()
})