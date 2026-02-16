const express = require("express");
const {
  listPackages,
  getPackage,
  createPackage,
  updatePackage,
  deletePackage,
} = require("../controllers/packages.controller");
const { auth, requireRole } = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", listPackages);
router.get("/:packageId", getPackage);
router.post("/", auth, requireRole("admin"), createPackage);
router.put("/:packageId", auth, requireRole("admin"), updatePackage);
router.delete("/:packageId", auth, requireRole("admin"), deletePackage);

module.exports = router;
