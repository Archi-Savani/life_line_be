const express = require("express");
const multer = require("multer");
const {
  createVideo,
  getVideos,
  updateVideo,
  deleteVideo,
} = require("../controllers/videoController");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("image"), createVideo);
router.get("/", getVideos);
router.put("/:id", upload.single("image"), updateVideo);
router.delete("/:id", deleteVideo);

module.exports = router;

