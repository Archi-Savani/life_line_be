const Gallery = require("../models/galleryModel");
const { uploadImage } = require("../utils/upload");

const requiredGalleryFields = ["title", "description", "category"];

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
  requiredGalleryFields.filter((field) => !body[field]);

const parseOrder = (order) => {
  if (order === undefined || order === null || order === "") {
    return 0;
  }
  const parsed = Number(order);
  return Number.isNaN(parsed) ? 0 : parsed;
};

const createGallery = async (req, res) => {
  try {
    const missingFields = findMissingFields(req.body);
    if (missingFields.length) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(", ")}`,
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

    const gallery = await Gallery.create({
      title: req.body.title,
      description: req.body.description,
      image: imageUrl,
      category: req.body.category,
      tags: normalizeTags(req.body.tags),
      order: parseOrder(req.body.order),
    });

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

