const Profile = require("../models/Profile.models.js");
const { findById } = require("../models/Section.models");
const User = require("../models/User.models.js")

exports.updateProfile = async(req, res)=>{
    try {
        const {dateOfBirth="", about="", contactNumber, gender} = req.body;
        const id = req.user.id
        if(!contactNumber || !gender ||!id){
            return res.status(400).json({
                success: false,
                message:"All fields are required",
            })
        }
        const userDetails = await User.findById(id)
        const profileId = userDetails.profile
        const profileDetails = await findById(profileId)

        //update profile
        profileDetails.dateOfBirth = dateOfBirth;
        profileDetails.about = about;
        profileDetails.contactNumber = contactNumber;
        profileDetails.gender = gender;
        await profileDetails.save()

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            profileDetails
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Unable to updade profile details, please try again",
            error: error.message
            })
    }
}

//delete Account 
exports.deleteAccount = async(req, res)=>{
    try {
        const id = req.user.id;
        const userDetails = await User.findById(id)
        if(!userDetails){
            return res.status(404).json({
                success:false,
                message: "user not found"
            })
        }
        //delete profile details
        await Profile.findByIdAndDelete({_id:userDetails.profile})
        //TODO: unenroll user form all enrolled user
        // delere user
        await User.findByIdAndDelete({_id:id})
        //return response
        return res.status(200).json({
            success: true,
            message:"User deleted successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Unable to delete account, please try again",
            error: error.message
            })
    }
    }

//get user details
exprots.getUserDetails = async(req, res)=>{
    try {
        const id = req.user.id
        const userDetails = await findById(id).populate("profile").exec()
        if(!userDetails){
            return res.status(404).json({
                success:false,
                message: "user not found"
            })
        }
        return res.status(200).json({
            success: true,
            message:"user fetch details successfully",
            userDetails
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Unable to fetch account, please try again",
            error: error.message
            })
    }
}