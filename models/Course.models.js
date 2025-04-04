const mongoose = require("mongoose")
const courseSchema = new mongoose.Schema({
   courseName:{
    type: String,
   },

   courseDescription:{
    type: String,
   },

   instructor: {
    type:mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
   },

   whatYouLearn:{
    type: String,
   },

   courseContent:[
    {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Section",
    }
   ],
   ratingAndReview: {
    type: mongoose.Schema.types.ObjectId,
    ref:"RatingAndReview",
   },


   price:{
    type: Number,
   },

   thumbnail:{
    type: String,
   },

   tag:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"Tag",

   },

   studentsEnrolled:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
   }]

},{timestamps: true})

module.exports = mongoose.model("Course", courseSchema)
