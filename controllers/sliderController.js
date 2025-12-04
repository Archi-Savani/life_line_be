const Slider = require("../models/sliderModel");
const { uploadImage } = require("../utils/upload");

// Add slider
const createSlider = async (req, res) => {
  try {
    let imageUrl = req.body.image;

    if (req.file) {
      imageUrl = await uploadImage(req.file.buffer);
    }

    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        message: "Image file or URL is required.",
      });
    }

    const slider = await Slider.create({ image: imageUrl });

    return res.status(201).json({
      success: true,
      data: slider,
    });
  } catch (error) {
    console.error("Error creating slider:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to create slider.",
    });
  }
};

// Get all sliders
const getSliders = async (_req, res) => {
  try {
    const sliders = await Slider.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      data: sliders,
    });
  } catch (error) {
    console.error("Error fetching sliders:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch sliders.",
    });
  }
};

// Edit slider
const updateSlider = async (req, res) => {
  try {
    const { id } = req.params;

    const slider = await Slider.findById(id);
    if (!slider) {
      return res.status(404).json({
        success: false,
        message: "Slider not found.",
      });
    }

    let imageUrl = slider.image;

    if (req.file) {
      imageUrl = await uploadImage(req.file.buffer);
    } else if (req.body.image) {
      imageUrl = req.body.image;
    }

    slider.image = imageUrl;
    await slider.save();

    return res.status(200).json({
      success: true,
      data: slider,
    });
  } catch (error) {
    console.error("Error updating slider:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to update slider.",
    });
  }
};

// Delete slider
const deleteSlider = async (req, res) => {
  try {
    const { id } = req.params;

    const slider = await Slider.findByIdAndDelete(id);
    if (!slider) {
      return res.status(404).json({
        success: false,
        message: "Slider not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Slider deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting slider:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to delete slider.",
    });
  }
};

module.exports = {
  createSlider,
  getSliders,
  updateSlider,
  deleteSlider,
};


