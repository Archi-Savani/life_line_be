const express = require("express");
const multer = require("multer");
const {
  createGallery,
  getGalleries,
  getGalleriesByCategory,
  getGalleriesByCategoryId,
  updateGallery,
  deleteGallery,
} = require("../controllers/galleryController");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("image"), createGallery);
router.get("/", getGalleries);
router.get("/by-category", getGalleriesByCategory);
router.get("/:categoryId", getGalleriesByCategoryId);
router.put("/:id", upload.single("image"), updateGallery);
router.delete("/:id", deleteGallery);

module.exports = router;


