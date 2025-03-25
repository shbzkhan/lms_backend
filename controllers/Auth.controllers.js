require("dotenv").config()
const User = require("../models/User.models.js")
const OTP = require("../models/Otp.models.js")
const Profile = require("../models/Profile.models.js")
const otpGenerator = require("otp-generator")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

//send OTP
exports.sendOTP = async(req, res)=>{
    try {
        const {email}= req.body;

        //check user already exsits or not
        const userAlreadyExsits = await User.findOne({email});
        if(userAlreadyExsits){
            return res.status(401).json({
                success: false,
                message: "User Already Registered"
            })
        }

        //generate OTP
        let otp = otpGenerator.generate(6,{
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false
        })
         let otpExist = await OTP.findOne({otp: otp})
        // check unique OTP or not
        while(otpExist){
            let otp = otpGenerator.generate(6,{
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false
            })
            otpExist = await OTP.findOne({otp: otp})
        }

        const otpPayload = {email, otp}
        const otpBody = await OTP.create(otpPayload)
        console.log("OTP Created: ",otpBody)

        res.status(200).json({
            success: true,
            message: "Sent OTP successfully",
            otp
        })

    } catch (error) {
        console.log("Send OTP failed: ",error.message)
    }
}

//sign up 
exports.signUp = async(req, res) =>{
    try {
        const{
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            contactNumber,
            otp
        } = req.body

        if(!firstName || !lastName || !email || !password || !confirmPassword || !otp){
            return res.status(403).json({
                success: false,
                message: "All fields are required"
            })
        }
        //password match or not
        if(password !== confirmPassword){
            return res.status(403).json({
                success: false,
                message: "Password not matched"
            })
        }

        //validation Check
        const userExist = await User.findOne({email})
        if(userExist){
            return res.status(403).json({
                success: false,
                message: "User already registerd"
            })
        }

        //validation of OTP
        const recentOtp = await OTP.findOne({email}).sort({createAt: -1}).limit(5)
        console.log("Recent OTP: ", recentOtp)

        if(recentOtp.length == 0){
            res.status(404).json({
                success: false,
                message: "OTP not founed"
            })
        }else if(otp !== recentOtp.otp){
            res.status(400).json({
                success: false,
                message: "OTP not matched"
            })
        }
        // password Hash
        const hashPassword = await bcrypt.hash(password, 10)

        const profileDetails = await Profile.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            contactNumber: null
        })

        //create User in Database
        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashPassword,
            contactNumber,
            accountType,
            profile: profileDetails._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`

        })
        
        //send response
        res.status(200).json({
            success: true,
            message: "User Created successfully",
            user
        })
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({
            success: false,
            message: "User sign up failed"
        })
    }
}

//login
exports.login = async(req, res) =>{
    try {
        const {email, password} = req.body;

        if(!email || !password){
            return res.status(404).json({
                success: false,
                message: "All fields are required"
            })
        }

        const user = await User.findOne({email}).populate("profile");

        if(!user){
            return res.status(404).json({
                success: false,
                message: "User not exist"
            })
        }

        const comparedPassword = await bcrypt.compare(password, user.password)

        if(comparedPassword){
            const payload={
                email: user.email,
                id: user._id,
                accountType: user.accountType,
            }
            const token = jwt.sign(payload, process.env.JWT_TOKEN,{
                expiresIn: "2d",
            })
            user.token = token,
            user.password = undefined

            //create Cookie and send res
            const options = {
                expires: new Date(Date.now()+ 3*24*60*60*1000),
                httpOnly: true
            }
            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user,
                message: "Logged in successfully"
            })

        }else{
            return res.status(404).json({
                success: false,
                message: "Password not matched"
            })
        }

    } catch (error) {
        console.log("login Failed", error.message)
        return res.status(500).json({
            success: false,
            message: "Login failed"
        })
    }
}

//TODO: HOMEWORK
//password change