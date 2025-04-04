const Category = require("../models/Category.models.js");

exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !!description) {
      return res.status(404).json({
        success: false,
        message: "All fields are required",
      });
    }

    const tagDetails = await Category.create({
      name,
      description,
    });

    return res.status(200).json({
      success: true,
      tagDetails,
      message: "Category created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//find all tags
exports.showAllCategory = async (req, res) => {
  try {
    const allTags = await Category.find({}, { name: true, description: true });

    res.status(200).json({
      success: true,
      allTags,
      message: "All Category find successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
