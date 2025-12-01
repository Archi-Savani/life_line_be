const express = require("express");
const multer = require("multer");
const { createVideo, getVideos } = require("../controllers/videoController");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post(
  "/",
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "image", maxCount: 1 },
  ]),
  createVideo
);
router.get("/", getVideos);

module.exports = router;

