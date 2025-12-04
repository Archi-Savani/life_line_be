const express = require("express");
const multer = require("multer");
const {
  createSlider,
  getSliders,
  updateSlider,
  deleteSlider,
} = require("../controllers/sliderController");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("image"), createSlider);
router.get("/", getSliders);
router.put("/:id", upload.single("image"), updateSlider);
router.delete("/:id", deleteSlider);

module.exports = router;


