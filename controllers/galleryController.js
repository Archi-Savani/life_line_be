const Gallery = require("../models/galleryModel");
const Category = require("../models/categoryModel");
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

    if (!req.body.category) {
      return res.status(400).json({
        success: false,
        message: "Category is required.",
      });
    }

    const gallery = await Gallery.create({
      image: imageUrl,
      category: req.body.category,
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

const getGalleries = async (req, res) => {
  try {
    const query = {};
    
    // Filter by category id if provided
    if (req.query.category) {
      query.category = req.query.category;
    }

    const galleries = await Gallery.find(query)
      .populate("category", "categoryname")
      .sort({ createdAt: -1 });
    
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

// Get all galleries grouped by category
const getGalleriesByCategory = async (req, res) => {
  try {
    const galleries = await Gallery.find()
      .populate("category", "categoryname")
      .sort({ createdAt: -1 });

    // Group galleries by category
    const groupedGalleries = galleries.reduce((acc, gallery) => {
      if (!gallery.category) {
        return acc;
      }

      const categoryId = gallery.category._id.toString();
      const categoryName = gallery.category.categoryname;

      if (!acc[categoryId]) {
        acc[categoryId] = {
          category: {
            _id: gallery.category._id,
            categoryname: categoryName,
          },
          galleries: [],
        };
      }

      acc[categoryId].galleries.push({
        _id: gallery._id,
        image: gallery.image,
        createdAt: gallery.createdAt,
        updatedAt: gallery.updatedAt,
      });

      return acc;
    }, {});

    // Convert object to array
    const result = Object.values(groupedGalleries);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error fetching galleries by category:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch galleries by category.",
    });
  }
};

// Get galleries by specific category ID
const getGalleriesByCategoryId = async (req, res) => {
  try {
    const { categoryId } = req.params;

    if (!categoryId) {
      return res.status(400).json({
        success: false,
        message: "Category ID is required.",
      });
    }

    // Check if category exists first
    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found.",
      });
    }

    // Get galleries for this category
    const galleries = await Gallery.find({ category: categoryId })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: {
        category: {
          _id: category._id,
          categoryname: category.categoryname,
        },
        galleries: galleries.map((gallery) => ({
          _id: gallery._id,
          image: gallery.image,
          createdAt: gallery.createdAt,
          updatedAt: gallery.updatedAt,
        })),
      },
    });
  } catch (error) {
    console.error("Error fetching galleries by category ID:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch galleries for this category.",
    });
  }
};

const updateGallery = async (req, res) => {
  try {
    const { id } = req.params;

    const gallery = await Gallery.findById(id);
    if (!gallery) {
      return res.status(404).json({
        success: false,
        message: "Gallery item not found.",
      });
    }

    let imageUrl = gallery.image;
    if (req.file) {
      imageUrl = await uploadImage(req.file.buffer);
    } else if (req.body.image) {
      imageUrl = req.body.image;
    }

    gallery.image = imageUrl;
    
    if (req.body.category) {
      gallery.category = req.body.category;
    }

    await gallery.save();

    return res.status(200).json({
      success: true,
      data: gallery,
    });
  } catch (error) {
    console.error("Error updating gallery item:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to update gallery item.",
    });
  }
};

const deleteGallery = async (req, res) => {
  try {
    const { id } = req.params;

    const gallery = await Gallery.findByIdAndDelete(id);
    if (!gallery) {
      return res.status(404).json({
        success: false,
        message: "Gallery item not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Gallery item deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting gallery item:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to delete gallery item.",
    });
  }
};

module.exports = {
  createGallery,
  getGalleries,
  getGalleriesByCategory,
  getGalleriesByCategoryId,
  updateGallery,
  deleteGallery,
};

