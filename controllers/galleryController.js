const Gallery = require("../models/galleryModel");
const { uploadImage } = require("../utils/upload");

const createGallery = async (req, res) => {
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

    const gallery = await Gallery.create({ image: imageUrl });

    return res.status(201).json({
      success: true,
      data: gallery,
    });
  } catch (error) {
    console.error("Error creating gallery item:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to create gallery item.",
    });
  }
};

const getGalleries = async (_req, res) => {
  try {
    const galleries = await Gallery.find().sort({ order: 1, createdAt: -1 });
    return res.status(200).json({
      success: true,
      data: galleries,
    });
  } catch (error) {
    console.error("Error fetching gallery items:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch gallery items.",
    });
  }
};

module.exports = {
  createGallery,
  getGalleries,
};

