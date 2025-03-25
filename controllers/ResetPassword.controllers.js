const User = require("../models/User.models.js")
const mailSender = require("../utils/mailSender.utils.js")
const bcrypt = require("bcrypt")

//resetPasswordToken
exports.restPasswordToken = async(req, res)=>{
    try {
        const email = req.body.email
        const user = await User.findOne({email: email})
        if(!user){
            return res.status(404).json({
                success: false,
                message: "Your Email is not registered with us"
            })
        }

        //generate token
        const token = crypto.randomUUID()
        const updatedDetails = await User.findOneAndUpdate(
                                            {email:email},
                                            {
                                                token:token,
                                                resetPasswordExpires: Date.now()+5*60*1000,
                                            },
                                            {new: true}
        )

        //createUrl
        const url = `http://localhost:3000/update-password/${token}`
        //send mail containing the url
        await mailSender(email, "Password Reset Link", `Password Reset Link: ${url}`)

        //return res
        return res.status(200).json({
            success: true,
            message: "Email send successfully, please check email and change password"
        })
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({
            success: false,
            message: "somthing went wrong"
        })
    }
}

//resetPassword
exports.resetPassword = async(req, res)=>{
    try {
        const {password, confirmPassword, token}= req.body;
        //check password match or not
        if(password !== confirmPassword){
            return res.status(401).json({
                success: false,
                message: "Password not match"
            }) 
        }

        //find user details using token
        const userDetails = await User.findOne({token: token})

        if(!userDetails){
            return res.status(404).json({
                success: false,
                message: "Token invalid"
            }) 
        }
        //check token expire
        if( userDetails.resetPasswordExpires < Date.now() ){
            return res.status(401).json({
                success: false,
                message: "Token expired"
            }) 
        }

        //password hash
        const hashedPassword = await bcrypt.hash(password, 10)

        //find user details and update
        const updatedPassowrd = await User.findOneAndUpdate(
            {token: token},
            {password:hashedPassword},
            {new: true}
        )

        //return res
        return res.status(200).json({
            success: true,
            message: "Password reset successfully"
        })
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({
            success: false,
            message: "somthing with wrong while password reset"
        })
    }
}