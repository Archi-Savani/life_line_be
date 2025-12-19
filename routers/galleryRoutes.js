const express = require("express");
const multer = require("multer");
const {
  createGallery,
  getGalleries,
  getGalleriesMeta,
  getGalleriesByCategory,
  getGalleriesByCategoryId,
  updateGallery,
  deleteGallery,
} = require("../controllers/galleryController");
const { addCacheHeaders, metaResponse } = require("../middleware/cacheMiddleware");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("image"), createGallery);
router.get("/meta", metaResponse, getGalleriesMeta);
router.get("/", addCacheHeaders, getGalleries);
router.get("/by-category", addCacheHeaders, getGalleriesByCategory);
router.get("/:categoryId", addCacheHeaders, getGalleriesByCategoryId);
router.put("/:id", upload.single("image"), updateGallery);
router.delete("/:id", deleteGallery);

module.exports = router;


