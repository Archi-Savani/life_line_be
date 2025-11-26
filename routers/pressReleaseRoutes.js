const express = require("express");
const multer = require("multer");
const {
  createPressRelease,
  getPressReleases,
} = require("../controllers/pressReleaseController");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("image"), createPressRelease);
router.get("/", getPressReleases);

module.exports = router;

