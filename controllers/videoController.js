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

const updateVideo = async (req, res) => {
  try {
    const { id } = req.params;

    const video = await Video.findById(id);
    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found.",
      });
    }

    const { title, subtitle, videourl } = req.body;

    if (title) video.title = title;
    if (subtitle) video.subtitle = subtitle;
    if (videourl) video.videourl = videourl;

    const uploadedImage =
      req.file ||
      req.body.image ||
      req.body.imageUrl ||
      req.body.thumbnail;

    if (uploadedImage) {
      const imageUrl = await uploadImage(uploadedImage);
      video.image = imageUrl;
    }

    await video.save();

    return res.status(200).json({
      success: true,
      data: video,
    });
  } catch (error) {
    console.error("Error updating video:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to update video.",
      error: error.message,
    });
  }
};

const deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;

    const video = await Video.findByIdAndDelete(id);
    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Video deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting video:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to delete video.",
      error: error.message,
    });
  }
};

// Get meta (lastUpdated only) for Video entries
const getVideosMeta = async (_req, res) => {
  try {
    const videos = await Video.find().sort({ updatedAt: -1 }).limit(1);
    
    let lastUpdated = new Date().toISOString();
    if (videos.length > 0 && videos[0].updatedAt) {
      lastUpdated = videos[0].updatedAt.toISOString();
    }
    
    if (res.metaResponse) {
      return res.metaResponse(lastUpdated);
    }
    
    return res.status(200).json({
      lastUpdated: lastUpdated,
    });
  } catch (error) {
    console.error("Error fetching video meta:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch video meta.",
    });
  }
};

module.exports = {
  createVideo,
  getVideos,
  getVideosMeta,
  updateVideo,
  deleteVideo,
};

