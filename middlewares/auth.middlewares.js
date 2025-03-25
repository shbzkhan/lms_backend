require("dotenv").config()
const User = require("../models/User.models.js")
const jwt = require("jsonwebtoken")

//auth
exports.auth = async(req, res, next)=>{
    try {
        const token = req.cookie.token
                        || req.body.token
                        || req.header("Authorization").replace("Bearer ", "")

        if(!token){
            return res.status(404).json({
                success: false,
                message: "Token missing"
            })
        }

        try {
            const decode = jwt.verify(token, process.env.JWT_TOKEN)
            console.log(decode)
            req.user = decode
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: "Token invalid"
            })
        }
        next()
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Somthing went wrong while validating token"
        })
    }
}

//isStudent
exports.isStudent = async(req, res, next)=>{
    try {
        if(req.user.accoutType !== "Student"){
            return res.status(401).json({
                success: false,
                message: "This is protected route for Student Only"
            })
        }
        next()
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Somthing went wrong"
        })
    }
}

//isInstructor
exports.isInstructor = async(req, res, next)=>{
    try {
        if(req.user.accoutType !== "Instructor"){
            return res.status(401).json({
                success: false,
                message: "This is protected route for Instructor Only"
            })
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Somthing went wrong"
        })
    }
}

//isAdmin
exports.isAdmin = async(req, res, next)=>{
    try {
        if(req.user.accoutType !== "Admin"){
            return res.status(401).json({
                success: false,
                message: "This is protected route for Admin Only"
            })
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Somthing went wrong"
        })
    }
}