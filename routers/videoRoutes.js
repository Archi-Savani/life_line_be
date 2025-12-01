const express = require("express");
const multer = require("multer");
const { createVideo, getVideos } = require("../controllers/videoController");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("image"), createVideo);
router.get("/", getVideos);

module.exports = router;

