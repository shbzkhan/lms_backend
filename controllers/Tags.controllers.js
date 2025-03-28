const Tag = require("../models/Tags.models.js")

exports.createTag = async(req, res) =>{
    try {
        const {name, description} = req.body;

        if(!name || !!description){
            return res.status(404).json({
                success: false,
                message: "All fields are required"
            })
        }

        const tagDetails = await Tag.create({
            name,
            description
        })

        return res.status(200).json({
            success: true,
            tagDetails,
            message: "Created Successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

//find all tags
exports.showAllTags = async(req, res)=>{
    try {
        const allTags = await find({},{name:true, description: true})

        res.status(200).json({
            success: true,
            allTags,
            message: "All tags find successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}