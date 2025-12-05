const express = require("express");
const multer = require("multer");
const {
  createAbout,
  getAbouts,
  updateAbout,
  deleteAbout,
} = require("../controllers/aboutController");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("image"), createAbout);
router.get("/", getAbouts);
router.put("/:id", upload.single("image"), updateAbout);
router.delete("/:id", deleteAbout);

module.exports = router;


