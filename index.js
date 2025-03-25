require("dotenv").config()
const express = require("express")
const { connectDB } = require("./config/database.config")
const app = express()

//connection
connectDB()








app.listen(process.env.PORT,()=>{
    console.log("Server run on port: ",process.env.PORT)
})