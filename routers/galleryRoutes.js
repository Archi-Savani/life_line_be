const express = require("express");
const multer = require("multer");
const {
  createGallery,
  getGalleries,
} = require("../controllers/galleryController");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("image"), createGallery);
router.get("/", getGalleries);

module.exports = router;

