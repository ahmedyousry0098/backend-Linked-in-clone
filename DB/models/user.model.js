import mongoose, {model, Schema} from 'mongoose'
import bcrypt from 'bcryptjs'
import { ResponseError } from '../../src/utils/ErrorHandling.js'

const userSchema = new Schema({
    username: {type: String},
    email: {type: String, required: true, unique: false},
    password: {type: String, required: true},
    position: {type: String},
    profilePic: {type: Object},
    profileCover: {type: Object},
    role: {
        type: String,
        enum: ['User', 'Admin'],
        default: 'User'
    },
    isConfirmed: {type: Boolean, default: false},
    isLoggedIn: {type: Boolean, default: false},
    isDeleted: {type: Boolean, default: false},
    verificationCode: String,
}, {
    timestamps: true,
    methods: {
        isPasswordMatch(password) {
            return bcrypt.compareSync(password, this.password)
        }
    }
})

userSchema.pre('save', function(next){
    if (!this.isModified('password')) return next()
    const salt = bcrypt.genSaltSync(Number(process.env.SALT_ROUND))
    const hashedPassword = bcrypt.hashSync(this.password, salt)
    if (!hashedPassword) return next(new ResponseError('Cannot hash Password', 500))
    this.password = hashedPassword
    next()
})

userSchema.virtual('fullName').get(function () {
    return `${this.firstName} ${this.lastName}`
})

const UserModel = model('User', userSchema)

export default UserModel