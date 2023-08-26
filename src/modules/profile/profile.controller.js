import UserModel from '../../../DB/models/user.model.js'
import { sendEmail } from '../../utils/sendEmail.js'
import { resetPasswordTemp } from '../../utils/templates/resetPasswordEmail.js'
import cloudinary from '../../utils/cloudinary.js'
import { ResponseError, generalMsgs } from '../../utils/ErrorHandling.js'
import { nanoid } from 'nanoid'

export const getAllUsers = async (req, res, next) => { 
    const users = await UserModel.find({isDeleted: false})
    if (!users.length) return res.status(200).json({message: 'No Users has registers yet'})
    if (!users) return next(new ResponseError(generalMsgs.SERVER_ERROR, 500))
    return res.status(200).json({message: 'Done', users})
}

export const getUser = async (req, res, next) => {
    const userId = req.user._id
    const user = await UserModel.findOne({_id: userId, isDeleted: false})
    if (!user) return next(new ResponseError(generalMsgs.SERVER_ERROR, 500))
    return res.status(200).json({user})
}

export const changePassword = async (req, res, next) => {
    const {profileId} = req.params
    const {oldPassword, password} = req.body
    const {_id} = req.user
    const profile = await UserModel.findOne({_id: profileId})
    if (!profile) return next(new ResponseError(generalMsgs.NOT_FOUND, 404))
    if (_id.toString() !== profileId) return next(new ResponseError(generalMsgs.CANNOT_ACCESS, 401))
    if (!profile.isPasswordMatch(oldPassword)) return (next(new ResponseError('In-Valid Password, Please Try Again', 403)))
    profile.password = password
    if (!profile.save()) return next(new ResponseError(generalMsgs.SERVER_ERROR, 500))
    return res.status(202).json({message: 'Password Updated Successfully'})
}

export const changeProfilePic = async (req, res, next) => {
    const {_id} = req.user
    const {profileId} = req.params
    if (_id.toString() !== profileId) return next(new ResponseError(generalMsgs.CANNOT_ACCESS, 401))
    const profile = await UserModel.findById(profileId)
    if (!profile) return next(new ResponseError(generalMsgs.NOT_FOUND, 404))
    const {secure_url, public_id} = await cloudinary.uploader.upload(
        req.file.path, 
        {
            folder: `Social/${profile._id}/profilePic`,
            public_id: `${profile._id}_profile-pic`
        }
    )
    const updatedProfile = await UserModel.findByIdAndUpdate(profileId, {profilePic: {secure_url, public_id}}, {new: false})
    if (!updatedProfile.public_id) {
        return res.status(200).json({message: 'Done!'})
    }
    const deletedPreviousOne = await cloudinary.uploader.destroy(updatedProfile.public_id)
    return deletedPreviousOne ? res.status(200).json({message: 'Done!'})
    : next(new ResponseError('Cannot delete old picture from cloud', 500))
}

export const changeProfileCover = async (req, res, next) => {
    const {_id} = req.user
    const {profileId} = req.params
    if (_id.toString() !== profileId) return next(new ResponseError(generalMsgs.CANNOT_ACCESS, 401))
    const profile = await UserModel.findById(profileId)
    if (!profile) return next(new ResponseError(generalMsgs.NOT_FOUND, 404))
    const {secure_url, public_id} = await cloudinary.uploader.upload(
        req.file.path, 
        {
            folder: `Social/${profile._id}/profileCover`,
            public_id: `${profile._id}_profile-cover`
        }
    )
    const updatedProfile = await UserModel.findByIdAndUpdate(profileId, {profileCover: {secure_url, public_id}}, {new: false})
    if (!updatedProfile.public_id) {
        return res.status(200).json({message: 'Done!'})
    }
    const deletedPreviousOne = await cloudinary.uploader.destroy(updatedProfile.public_id)
    return deletedPreviousOne ? res.status(200).json({message: 'Done!'})
    : next(new ResponseError('Cannot delete old picture from cloud', 500))
}

export const updateProfile = async (req, res, next) => {
    const {profileId} = req.params
    const {_id} = req.user
    if (profileId !== _id.toString()) {
        return next(new ResponseError(generalMsgs.CANNOT_ACCESS, 401))
    }
    const updatedProfile = UserModel.findByIdAndUpdate(_id, req.body, {new: true})
    if (!updatedProfile) {
        return next(new ResponseError(generalMsgs.SERVER_ERROR, 500))
    }
    return res.status(200).json({message: "Done!", updateProfile})
}

export const deleteProfile = async (req, res, next) => {
    const {profileId} = req.params
    const {_id} = req.user
    if (_id.toString() !== profileId) return next(new ResponseError(generalMsgs.CANNOT_ACCESS, 401))
    if (!await UserModel.findByIdAndUpdate(_id, {isDeleted: true})) return next(new ResponseError(generalMsgs.NOT_FOUND, 404))
    return res.status(202).json({message: 'Logged Out Successfully'})
}

export const logOut = async (req, res, next) => {
    const {_id} = req.user;
    const {profileId} = req.params;
    if (_id.toString() !== profileId) return next(new ResponseError(generalMsgs.CANNOT_ACCESS, 401))
    const logUserOut = await UserModel.findByIdAndUpdate(_id, {isLoggedIn: false}, {new: true})
    if (!logUserOut) return next(new ResponseError(generalMsgs.NOT_FOUND, 404))
    return res.status(200).json({message: 'Logged Out Successfully'})
}