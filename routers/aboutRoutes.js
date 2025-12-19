const express = require("express");
const multer = require("multer");
const {
  createAbout,
  getAbouts,
  getAboutsMeta,
  updateAbout,
  deleteAbout,
} = require("../controllers/aboutController");
const { addCacheHeaders, metaResponse } = require("../middleware/cacheMiddleware");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("image"), createAbout);
router.get("/meta", metaResponse, getAboutsMeta);
router.get("/", addCacheHeaders, getAbouts);
router.put("/:id", upload.single("image"), updateAbout);
router.delete("/:id", deleteAbout);

module.exports = router;



