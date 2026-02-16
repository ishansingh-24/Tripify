const express = require("express");
const {
  listCities,
  getCity,
  createCity,
  updateCity,
  deleteCity,
} = require("../controllers/cities.controller");
const { auth, requireRole } = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", listCities);
router.get("/:cityId", getCity);
router.post("/", auth, requireRole("admin"), createCity);
router.put("/:cityId", auth, requireRole("admin"), updateCity);
router.delete("/:cityId", auth, requireRole("admin"), deleteCity);

module.exports = router;
