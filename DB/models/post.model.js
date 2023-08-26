import mongoose, {Schema} from 'mongoose'

const postSchema = new Schema({
    content: {type: String, required: true},
    image: {type: Object},
    createdBy: {type: mongoose.Types.ObjectId, ref: 'User', required: true},
    like: [{type: mongoose.Types.ObjectId, ref: 'User'}],
    unlike: [{type: mongoose.Types.ObjectId, ref: 'User'}],
    status: {
        type: String,
        enum: ['only-me', 'public', 'only-friends'],
        default: 'public'
    },
    isDeleted: {type: Boolean, default: false},
}, {
    toJSON: {virtuals: true},
    toObject: {virtuals: true},
    timestamps: true,
})

postSchema.virtual('comments', {
    ref: 'Comment',
    foreignField: 'createdOn',
    localField: "_id",
})

postSchema.virtual('user', {
    ref: 'User',
    foreignField: '_id',
    localField: 'createdBy'
})

const PostModel = mongoose.model('Post', postSchema)

export default PostModel