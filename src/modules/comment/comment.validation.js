import joi from 'joi'
import { GENERAL_FIELDS } from '../../middlewares/validation.js'

// Comment
export const createCommentSchema = joi.object({
    postId: GENERAL_FIELDS.Id.required(),
    content: GENERAL_FIELDS.CommentContent.required(),
}).required()

export const updateCommentSchema = joi.object({
    postId: GENERAL_FIELDS.Id.required(),
    commentId: GENERAL_FIELDS.Id.required(),
    content: GENERAL_FIELDS.CommentContent.required(),
}).required()

export const deleteCommentSchema = joi.object({
    postId: GENERAL_FIELDS.Id.required(),
    commentId: GENERAL_FIELDS.Id.required(),
}).required()

export const commentIdSchema = joi.object({
    postId: GENERAL_FIELDS.Id.required(),
    commentId: GENERAL_FIELDS.Id.required(),
}).required()