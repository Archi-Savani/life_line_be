const express = require("express");
const {
  createPersonalDetail,
  getPersonalDetails,
  updatePersonalDetail,
  deletePersonalDetail,
} = require("../controllers/personalDetailController");

const router = express.Router();

router.post("/", createPersonalDetail);
router.get("/", getPersonalDetails);
router.put("/:id", updatePersonalDetail);
router.delete("/:id", deletePersonalDetail);

module.exports = router;



