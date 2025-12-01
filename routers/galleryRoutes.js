const express = require("express");
const multer = require("multer");
const {
  createGallery,
  getGalleries,
  updateGallery,
  deleteGallery,
} = require("../controllers/galleryController");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("image"), createGallery);
router.get("/", getGalleries);
router.put("/:id", upload.single("image"), updateGallery);
router.delete("/:id", deleteGallery);

module.exports = router;


