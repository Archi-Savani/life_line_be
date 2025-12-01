const express = require("express");
const multer = require("multer");
const {
  createPressRelease,
  getPressReleases,
  updatePressRelease,
  deletePressRelease,
} = require("../controllers/pressReleaseController");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("image"), createPressRelease);
router.get("/", getPressReleases);
router.put("/:id", upload.single("image"), updatePressRelease);
router.delete("/:id", deletePressRelease);

module.exports = router;


