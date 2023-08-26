import joi from 'joi'
import { GENERAL_FIELDS } from '../../middlewares/validation.js'

// Post
export const createPostSchema = joi.object({
    content: GENERAL_FIELDS.postContent.required(),
    file: GENERAL_FIELDS.file
}).required()

export const updatePostSchema = joi.object({
    postId: GENERAL_FIELDS.Id.required(),
    title: GENERAL_FIELDS.postTitle,
    content: GENERAL_FIELDS.postContent,
    file: GENERAL_FIELDS.file
}).required()

export const postIdSchema = joi.object({
    postId: GENERAL_FIELDS.Id.required()
}).required()