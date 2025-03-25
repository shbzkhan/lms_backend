const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender.utils");
const OtpSchema = new mongoose.Schema({
    email:{
        type:String,
        required: true,
    },

    otp:{
        type:String,
        required:true,
    },

    createdAt:{
        type:Date,
        default:Date.now(),
        expires: 5*60,
    }
})
async function sendVerificationEmail(email, otp){
    try {
        const mailResponse = await mailSender(email, "Verification Email from LMS", otp)
        console.log("Email sent successfully: ", mailResponse)

    } catch (error) {
        console.log("error occure while sendmail", error)
        throw error;
    }
}

OtpSchema.pre("save", async function(next){
 await sendVerificationEmail(this.email, this.otp)
 next()
})

module.exports = mongoose.model("OTP", OtpSchema)
