const PressRelease = require("../models/pressReleaseModel");
const { uploadImage } = require("../utils/upload");

const parseDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const createPressRelease = async (req, res) => {
  try {
    if (!req.body.title) {
      return res.status(400).json({
        success: false,
        message: "Title is required.",
      });
    }

    const parsedDate = parseDate(req.body.date);
    if (!parsedDate) {
      return res.status(400).json({
        success: false,
        message: "A valid date is required.",
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
      image: imageUrl,
      date: parsedDate,
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
      date: -1,
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

const updatePressRelease = async (req, res) => {
  try {
    const { id } = req.params;

    const pressRelease = await PressRelease.findById(id);
    if (!pressRelease) {
      return res.status(404).json({
        success: false,
        message: "Press release not found.",
      });
    }

    if (req.body.title) {
      pressRelease.title = req.body.title;
    }

    if (req.body.date) {
      const parsedDate = parseDate(req.body.date);
      if (!parsedDate) {
        return res.status(400).json({
          success: false,
          message: "A valid date is required.",
        });
      }
      pressRelease.date = parsedDate;
    }

    if (req.file || req.body.image) {
      let imageUrl = pressRelease.image;
      if (req.file) {
        imageUrl = await uploadImage(req.file.buffer);
      } else if (req.body.image) {
        imageUrl = req.body.image;
      }
      pressRelease.image = imageUrl;
    }

    await pressRelease.save();

    return res.status(200).json({
      success: true,
      data: pressRelease,
    });
  } catch (error) {
    console.error("Error updating press release:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to update press release.",
    });
  }
};

const deletePressRelease = async (req, res) => {
  try {
    const { id } = req.params;

    const pressRelease = await PressRelease.findByIdAndDelete(id);
    if (!pressRelease) {
      return res.status(404).json({
        success: false,
        message: "Press release not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Press release deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting press release:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to delete press release.",
    });
  }
};

module.exports = {
  createPressRelease,
  getPressReleases,
  updatePressRelease,
  deletePressRelease,
};

