require("dotenv").config()
const mongoose = require("mongoose")

exports.connectDB = async()=>{
    await mongoose.connect(process.env.MONGODB_URL,{
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(()=>console.log("Database Connected!!!"))
    .catch((error)=>{
        console.log("Database Failed")
        console.log(error.message)
        process.exit(1)
    })
}