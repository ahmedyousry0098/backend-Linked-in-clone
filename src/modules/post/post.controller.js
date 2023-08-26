import PostModel from '../../../DB/models/post.model.js'
import { generalMsgs, ResponseError } from '../../utils/ErrorHandling.js'
import cloudinary from '../../utils/cloudinary.js'
import CommentModel from '../../../DB/models/comment.model.js'

export const getPosts = async (req, res, next) => {
    const {_id} = req.user
    const posts = await PostModel.find({}).populate([
        {path: 'user', select: 'email position username'},
        {path: 'comments', select: 'content'}
    ])
    if (!posts) {
        return next(new ResponseError(generalMsgs.SERVER_ERROR, 500))
    }
    return res.status(200).json({posts})
}

export const createPost = async (req, res, next) => {
    const {content} = req.body
    const {_id} = req.user
    if (req.file) {
        const {secure_url, public_id} = await cloudinary.uploader.upload(
            req.file.path,
            {
                folder: `linkedIn/${_id}/posts`,
                public_id: `${_id}_post`
            }
        )
        if (!secure_url || !public_id) return next(new ResponseError(generalMsgs.SERVER_ERROR, 500))
        req.body.image = {secure_url, public_id}
    }
    const post = await PostModel.create({
        content, 
        createdBy: _id, 
        image: req.body.image
    })
    if (!post) return next(new ResponseError(generalMsgs.SERVER_ERROR, 500))
    return res.status(201).json({message: 'Done'})
}

export const updatePost = async (req, res, next) => {
    const {_id} = req.user
    const {post_id} = req.params
    const post = await PostModel.findById(post_id)
    if (!post) return next(new ResponseError(generalMsgs.NOT_FOUND, 400))
    if (post.createdBy.toString() !== _id.toString()) return next(new ResponseError(generalMsgs.CANNOT_ACCESS, 401))
    if (req.file) {
        const {secure_url, public_id} = await cloudinary.uploader.upload(
            req.file.path,
            {
                folder: `social/${_id}/posts`,
                public_id: `${_id}_post`
            }
        )
        if (!secure_url || !public_id) return next(new ResponseError(generalMsgs.SERVER_ERROR, 500))
        req.body.image = {secure_url, public_id}
    }
    const updatedPost = await PostModel.updateOne({_id}, req.body, {new: false})
    if (!updatedPost.modifiedCount) return next(new ResponseError(generalMsgs.SERVER_ERROR, 500))
    await cloudinary.uploader.destroy(updatedPost.image.public_id)
    return res.status(200).json({message: 'Done'})
}

export const likePost = async (req, res, next) => {
    const {_id} = req.user
    const {postId} = req.params
    const post = await PostModel.findByIdAndUpdate(
        postId, 
        {
            $addToSet: {like: _id},
            $pull: {unlike: _id}
        }
    )
    if (!post) return next(new ResponseError(generalMsgs.NOT_FOUND, 400))
    return res.status(202).json({message: 'Done'})
}

export const unlikePost = async (req, res, next) => {
    const {_id} = req.user
    const {postId} = req.params
    const post = await PostModel.findByIdAndUpdate(
        postId, 
        {
            $addToSet: {unlike: _id},
            $pull: {like: _id}
        }
    )
    if (!post) return next(new ResponseError(generalMsgs.NOT_FOUND, 400))
    return res.status(202).json({message: 'Done'})
}

export const deletePost = async (req, res, next) => {
    const {postId} = req.params 
    const {_id} = req.user
    const post = await PostModel.findById(postId)
    if (!post) return next(new ResponseError(generalMsgs.NOT_FOUND, 400))
    if (post.createdBy.toString() !== _id.toString()) return next(new ResponseError(generalMsgs.CANNOT_ACCESS, 401))
    const deletedPost = await PostModel.updateOne({_id:postId}, {isDeleted: true})
    if (!deletedPost) return next(new ResponseError(generalMsgs.SERVER_ERROR, 500))
    return res.status(200).json({message: 'Deleted'})
}
