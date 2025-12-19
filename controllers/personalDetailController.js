const PersonalDetail = require("../models/personalDetailModel");

// Add personal detail
const createPersonalDetail = async (req, res) => {
  try {
    const { phone, address, email } = req.body;

    if (!phone || !address || !email) {
      return res.status(400).json({
        success: false,
        message: "Phone, address and email are required.",
      });
    }

    const detail = await PersonalDetail.create({ phone, address, email });

    return res.status(201).json({
      success: true,
      data: detail,
    });
  } catch (error) {
    console.error("Error creating personal detail:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to create personal detail.",
    });
  }
};

// Get all personal details
const getPersonalDetails = async (_req, res) => {
  try {
    const details = await PersonalDetail.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      data: details,
    });
  } catch (error) {
    console.error("Error fetching personal details:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch personal details.",
    });
  }
};

// Edit personal detail
const updatePersonalDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const detail = await PersonalDetail.findById(id);
    if (!detail) {
      return res.status(404).json({
        success: false,
        message: "Personal detail not found.",
      });
    }

    const { phone, address, email } = req.body;

    if (typeof phone !== "undefined") detail.phone = phone;
    if (typeof address !== "undefined") detail.address = address;
    if (typeof email !== "undefined") detail.email = email;

    await detail.save();

    return res.status(200).json({
      success: true,
      data: detail,
    });
  } catch (error) {
    console.error("Error updating personal detail:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to update personal detail.",
    });
  }
};

// Delete personal detail
const deletePersonalDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const detail = await PersonalDetail.findByIdAndDelete(id);
    if (!detail) {
      return res.status(404).json({
        success: false,
        message: "Personal detail not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Personal detail deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting personal detail:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to delete personal detail.",
    });
  }
};

module.exports = {
  createPersonalDetail,
  getPersonalDetails,
  updatePersonalDetail,
  deletePersonalDetail,
};



