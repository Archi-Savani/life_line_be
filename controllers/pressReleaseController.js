const PressRelease = require("../models/pressReleaseModel");
const { uploadImage } = require("../utils/upload");

const requiredFields = ["title", "content", "author", "publishDate"];

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
  requiredFields.filter((field) => !body[field]);

const parsePublishDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const createPressRelease = async (req, res) => {
  try {
    const missingFields = findMissingFields(req.body);
    if (missingFields.length) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    const parsedDate = parsePublishDate(req.body.publishDate);
    if (!parsedDate) {
      return res.status(400).json({
        success: false,
        message: "Invalid publishDate provided.",
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

    const pressRelease = await PressRelease.create({
      title: req.body.title,
      content: req.body.content,
      author: req.body.author,
      publishDate: parsedDate,
      image: imageUrl,
      tags: normalizeTags(req.body.tags),
      status: req.body.status?.toLowerCase() === "publish" ? "publish" : "draft",
    });

    return res.status(201).json({
      success: true,
      data: pressRelease,
    });
  } catch (error) {
    console.error("Error creating press release:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to create press release.",
    });
  }
};

const getPressReleases = async (_req, res) => {
  try {
    const pressReleases = await PressRelease.find().sort({
      publishDate: -1,
      createdAt: -1,
    });
    return res.status(200).json({
      success: true,
      data: pressReleases,
    });
  } catch (error) {
    console.error("Error fetching press releases:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch press releases.",
    });
  }
};

module.exports = {
  createPressRelease,
  getPressReleases,
};

