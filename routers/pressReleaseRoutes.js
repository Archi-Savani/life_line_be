const express = require("express");
const multer = require("multer");
const {
  createPressRelease,
  getPressReleases,
  getPressReleasesMeta,
  updatePressRelease,
  deletePressRelease,
} = require("../controllers/pressReleaseController");
const { addCacheHeaders, metaResponse } = require("../middleware/cacheMiddleware");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("image"), createPressRelease);
router.get("/meta", metaResponse, getPressReleasesMeta);
router.get("/", addCacheHeaders, getPressReleases);
router.put("/:id", upload.single("image"), updatePressRelease);
router.delete("/:id", deletePressRelease);

module.exports = router;


