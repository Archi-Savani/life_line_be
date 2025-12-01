const Video = require("../models/videoModel");
const { uploadImage } = require("../utils/upload");

const createVideo = async (req, res) => {
  try {
    const { title, subtitle, videourl } = req.body;

    if (!title || !subtitle || !videourl) {
      return res.status(400).json({
        success: false,
        message: "Title, subtitle and videourl are required.",
      });
    }

    const uploadedImage =
      req.file ||
      req.body.image ||
      req.body.imageUrl ||
      req.body.thumbnail;

    let imageUrl;
    if (uploadedImage) {
      imageUrl = await uploadImage(uploadedImage);
    }

    const video = await Video.create({
      title,
      subtitle,
      videourl,
      ...(imageUrl && { image: imageUrl }),
    });

    return res.status(201).json({
      success: true,
      data: video,
    });
  } catch (error) {
    console.error("Error creating video:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to create video.",
      error: error.message,
    });
  }
};

const getVideos = async (_req, res) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      data: videos,
    });
  } catch (error) {
    console.error("Error fetching videos:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch videos.",
    });
  }
};

module.exports = {
  createVideo,
  getVideos,
};

