import mongoose, {Schema} from 'mongoose'

const commentSchema = new Schema({
    content: {type: String, required: true},
    createdBy: {type: mongoose.Types.ObjectId, ref: 'User', required: true},
    createdOn: {type: mongoose.Types.ObjectId, ref: 'Post', required: true},
    like: [{type: mongoose.Types.ObjectId, ref: 'User'}],
    unlike: [{type: mongoose.Types.ObjectId, ref: 'User'}],
    isDeleted: {type: Boolean, default: false}
}, {
    timestamps: true
})

const CommentModel = mongoose.model('Comment', commentSchema)

export default CommentModel