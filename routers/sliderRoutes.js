const express = require("express");
const multer = require("multer");
const {
  createSlider,
  getSliders,
  getSlidersMeta,
  updateSlider,
  deleteSlider,
} = require("../controllers/sliderController");
const { addCacheHeaders, metaResponse } = require("../middleware/cacheMiddleware");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("image"), createSlider);
router.get("/meta", metaResponse, getSlidersMeta);
router.get("/", addCacheHeaders, getSliders);
router.put("/:id", upload.single("image"), updateSlider);
router.delete("/:id", deleteSlider);

module.exports = router;



