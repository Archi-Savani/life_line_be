const Location = require("../models/locationModel");

// Create new location
const createLocation = async (req, res) => {
  try {
    if (!req.body.link) {
      return res.status(400).json({
        success: false,
        message: "Link is required.",
      });
    }

    const location = await Location.create({
      link: req.body.link,
    });

    return res.status(201).json({
      success: true,
      data: location,
    });
  } catch (error) {
    console.error("Error creating location:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to create location.",
    });
  }
};

// Get all locations
const getLocations = async (_req, res) => {
  try {
    const locations = await Location.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      data: locations,
    });
  } catch (error) {
    console.error("Error fetching locations:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch locations.",
    });
  }
};

// Update location
const updateLocation = async (req, res) => {
  try {
    const { id } = req.params;

    const location = await Location.findById(id);
    if (!location) {
      return res.status(404).json({
        success: false,
        message: "Location not found.",
      });
    }

    if (req.body.link) {
      location.link = req.body.link;
    }

    await location.save();

    return res.status(200).json({
      success: true,
      data: location,
    });
  } catch (error) {
    console.error("Error updating location:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to update location.",
    });
  }
};

// Delete location
const deleteLocation = async (req, res) => {
  try {
    const { id } = req.params;

    const location = await Location.findByIdAndDelete(id);
    if (!location) {
      return res.status(404).json({
        success: false,
        message: "Location not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Location deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting location:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to delete location.",
    });
  }
};

module.exports = {
  createLocation,
  getLocations,
  updateLocation,
  deleteLocation,
};


