const Section = require("../models/Section.models.js")
const Course = require("../models/Course.models.js")

exports.createSection = async(req, res)=>{
    try {
        const {sectionName, courseId} = req.body

        if(!sectionName || !courseId){
            return res.status(404).json({
                success: false,
                message:"Missing properties"
            })
        }

        const newSection = await Section.create({sectionName})

        const updatedCourseDetails = await Course.findByIdAndUpdate(courseId,{
                                                    $push:{
                                                        courseContent:newSection._id
                                                    },
                                                },
                                                {new: true}
                                                
    )
        
    return res.status(200).json({
        success: true,
        message: "Section created Successfully",
        data: updatedCourseDetails
    })

    } catch (error) {
        return res.status(500).json({
        success: false,
        message: "Unable to create Section, please try again",
        error: error.message
        })
    }
}

exports.updateSection = async(req, res)=>{

    try {
        
        const{sectionName, sectionId}= req.body;
        if(!sectionName || !sectionId){
            return res.status(404).json({
                success: false,
                message:"Missing properties"
            })
        }
        //update data
        await Section.findByIdAndUpdate(sectionId,{sectionName},{new:true})
        
        //res return
        return res.status(200).json({
            success: true,
            message: "Section updated successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Unable to update Section, please try again",
            error: error.message
            })
    }
}


exports.deleteSection = async(req, res)=>{

    try {
        
        const{sectionId}= req.params;
        if(!sectionId){
            return res.status(404).json({
                success: false,
                message:"Missing properties"
            })
        }
        //delete data
        await Section.findByIdAndDelete(sectionId)
        
        //res return
        return res.status(200).json({
            success: true,
            message: "Section deleted successfully"
        })


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Unable to delete Section, please try again",
            error: error.message
            })
    }
}




