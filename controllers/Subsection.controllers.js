const Section = require("../models/Section.models.js")
const SubSection = require("../models/SubSection.models.js");
const { uploadImageToCloudinary } = require("../utils/imageUploader.utils.js");

//create a subsection
exports.createSubSection = async(req, res)=>{
    try {
        const {sectionId, title, timeDuration, description}= req.body
        const video = req.files.videoFile;

        //validation 
        if(!sectionId || !title || !timeDuration || !description || !video){
            return res.status(404).json({
                success: false,
                message:"Missing properties"
            })
        }
        //upload to cloudinary
        const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME)
        //create a sub-section
        const SubSectionDetails = await SubSection.create({
            title,
            timeDuration,
            description,
            videoUrl: uploadDetails.secure_url
        })

        const updatedSection = await Section.findByIdAndUpdate({_id:sectionId},{
                                                                $push:{
                                                                    subSection: SubSectionDetails._id,
                                                                }},{
                                                                    new: true
                                                                }
    )
    //return res
    return res.status(200).json({
        success: true,
        message: "sub-section created successfully",
        updatedSection
    })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Unable to create Sub Section, please try again",
            error: error.message
            })
    }
}

//updateSubSection
