import joi from 'joi'
import { GENERAL_FIELDS } from '../../middlewares/validation.js'

export const registerSchema = joi.object({
    email: GENERAL_FIELDS.email.required(),
    password: GENERAL_FIELDS.password.required().messages({
        "any.required": "Password is Required",
        "string.pattern.base": "Minimum five characters, at least one letter and one number"
    }),
    username: joi.string().required(),
    position: joi.string().required()
}).required()

export const loginSchema = joi.object({
    email: GENERAL_FIELDS.email.required(),
    password: GENERAL_FIELDS.password.required().messages({
        "any.required": "Password is Required",
        "string.pattern.base": "In-valid Password"
    })
}).required()

export const forgetPasswordSchema = joi.object({
    email: GENERAL_FIELDS.email.required()
}).required()

export const resetPasswordSchema = joi.object({
    email: GENERAL_FIELDS.email.required(),
    code: joi.string().length(4).required().messages({
        "any.required": "Code is Required",
        "string.base": "In-valid Code",
        "string.length": "In-valid Code"
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
