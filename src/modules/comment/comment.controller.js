import PostModel from '../../../DB/models/post.model.js'
import CommentModel from '../../../DB/models/comment.model.js'
import { generalMsgs, ResponseError } from '../../utils/ErrorHandling.js'

export const addComment = async (req, res, next) => {
    const {content} = req.body
    const {_id} = req.user
    const {postId} = req.params
    const comment = await CommentModel.create({content, createdBy: _id, createdOn: postId})
    if (!comment) return next(new ResponseError(generalMsgs.SERVER_ERROR, 500))
    return res.status(201).json({message: 'Success'})
}

export const likeComment = async (req, res, next) => {
    const {postId, commentId} = req.params
    const {_id} = req.user
    const comment = await CommentModel.findOneAndUpdate(
        {_id: commentId, createdOn: postId},
        {
            $addToSet: {like: _id},
            $pull: {unlike: _id}
        },
        {new: true}
    )
    if (!comment) return next(new ResponseError(generalMsgs.NOT_FOUND, 400))
    return res.status(201).json({message: 'Done'})
}

export const unlikeComment = async (req, res, next) => {
    const {postId, commentId} = req.params
    const {_id} = req.user
    const comment = await CommentModel.findOneAndUpdate(
        {_id: commentId, createdOn: postId},
        {
            $addToSet: {unlike: _id},
            $pull: {like: _id}
        },
        {new: true}
    )
    if (!comment) return next(new ResponseError(generalMsgs.NOT_FOUND, 400))
    return res.status(201).json({message: 'Done'})
}

export const updateComment = async (req, res, next) => {
    const {postId, commentId} = req.params
    const {_id} = req.user
    const {content} = req.body
    const comment = await CommentModel.findOneAndUpdate(
        {
            _id: commentId,
            createdOn: postId,
            createdBy: _id // We Can Check this Condition To Return Unique Response But This Will Cost Us Additional Request On DB
        }, 
        { content }, 
        { new: true }
    )
    if (!comment) return next(new ResponseError(generalMsgs.NOT_FOUND, 400))
    return res.status(201).json({message: 'Done!'})
}

export const deleteComment = async (req, res, next) => {
    const {postId, commentId} = req.params
    const {_id} = req.user
    const comment = await CommentModel.findOneAndUpdate(
        {
            _id: commentId,
            createdOn: postId,
            createdBy: _id
        },
        {isDeleted: true},
        {new: true}
    )
    if (!comment) return next(new ResponseError(generalMsgs.NOT_FOUND, 400))
    return res.status(201).json({message: 'Comment Deleted!'})
}