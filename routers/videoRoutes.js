const express = require("express");
const multer = require("multer");
const {
  createVideo,
  getVideos,
  getVideosMeta,
  updateVideo,
  deleteVideo,
} = require("../controllers/videoController");
const { addCacheHeaders, metaResponse } = require("../middleware/cacheMiddleware");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("image"), createVideo);
router.get("/meta", metaResponse, getVideosMeta);
router.get("/", addCacheHeaders, getVideos);
router.put("/:id", upload.single("image"), updateVideo);
router.delete("/:id", deleteVideo);

module.exports = router;

