const Video = require("../models/videoModel");
const { uploadImage } = require("../utils/upload");

const requiredFields = ["title", "description", "duration", "category"];

const normalizeTags = (rawTags) => {
  if (!rawTags) return [];
  if (Array.isArray(rawTags)) {
    return rawTags.map((tag) => tag.trim()).filter(Boolean);
  }

  return rawTags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
};

const findMissingFields = (body) =>
  requiredFields.filter((field) => {
    if (field === "description") {
      return !(body.description || body.dec || body.desc);
    }
    return !body[field];
  });

const extractDescription = (body) =>
  body.description || body.dec || body.desc || "";

const parseViews = (views) => {
  if (views === undefined || views === null || views === "") {
    return 0;
  }
  const parsed = Number(views);
  return Number.isNaN(parsed) || parsed < 0 ? 0 : parsed;
};

const createVideo = async (req, res) => {
  try {
    const missingFields = findMissingFields(req.body);
    if (missingFields.length) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    const uploadedImage = req.file || req.files?.image?.[0];
    const imageInput =
      uploadedImage ||
      req.body.image ||
      req.body.imageUrl ||
      req.body.thumbnail;

    if (!imageInput) {
      return res.status(400).json({
        success: false,
        message: "Image is required (file or URL).",
      });
    }

    const imageUrl = await uploadImage(imageInput);

    const video = await Video.create({
      title: req.body.title,
      description: extractDescription(req.body),
      image: imageUrl,
      duration: req.body.duration,
      category: req.body.category,
      tags: normalizeTags(req.body.tags),
      views: parseViews(req.body.views),
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

