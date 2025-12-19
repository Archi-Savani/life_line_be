const About = require("../models/aboutModel");
const { uploadImage } = require("../utils/upload");

// Create About
const createAbout = async (req, res) => {
  try {
    const { name, designation, mobile, email } = req.body;

    if (!name || !designation || !mobile || !email) {
      return res.status(400).json({
        success: false,
        message: "Name, designation, mobile, and email are required.",
      });
    }

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

    const about = await About.create({
      name,
      image: imageUrl,
      designation,
      mobile,
      email,
    });

    return res.status(201).json({
      success: true,
      data: about,
    });
  } catch (error) {
    console.error("Error creating about:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to create about entry.",
    });
  }
};

// Get all About entries
const getAbouts = async (_req, res) => {
  try {
    const abouts = await About.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      data: abouts,
    });
  } catch (error) {
    console.error("Error fetching about entries:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch about entries.",
    });
  }
};

// Update About entry
const updateAbout = async (req, res) => {
  try {
    const { id } = req.params;

    const about = await About.findById(id);
    if (!about) {
      return res.status(404).json({
        success: false,
        message: "About entry not found.",
      });
    }

    const { name, designation, mobile, email } = req.body;

    if (name) about.name = name;
    if (designation) about.designation = designation;
    if (mobile) about.mobile = mobile;
    if (email) about.email = email;

    if (req.file) {
      about.image = await uploadImage(req.file.buffer);
    } else if (req.body.image) {
      about.image = req.body.image;
    }

    await about.save();

    return res.status(200).json({
      success: true,
      data: about,
    });
  } catch (error) {
    console.error("Error updating about:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to update about entry.",
    });
  }
};

// Delete About entry
const deleteAbout = async (req, res) => {
  try {
    const { id } = req.params;

    const about = await About.findByIdAndDelete(id);
    if (!about) {
      return res.status(404).json({
        success: false,
        message: "About entry not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "About entry deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting about:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to delete about entry.",
    });
  }
};

// Get meta (lastUpdated only) for About entries
const getAboutsMeta = async (_req, res) => {
  try {
    const abouts = await About.find().sort({ updatedAt: -1 }).limit(1);
    
    let lastUpdated = new Date().toISOString();
    if (abouts.length > 0 && abouts[0].updatedAt) {
      lastUpdated = abouts[0].updatedAt.toISOString();
    }
    
    if (res.metaResponse) {
      return res.metaResponse(lastUpdated);
    }
    
    return res.status(200).json({
      lastUpdated: lastUpdated,
    });
  } catch (error) {
    console.error("Error fetching about meta:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch about meta.",
    });
  }
};

module.exports = {
  createAbout,
  getAbouts,
  getAboutsMeta,
  updateAbout,
  deleteAbout,
};



