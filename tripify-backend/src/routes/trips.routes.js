const express = require("express");
const {
  listTrips,
  getTrip,
  createTrip,
  updateTrip,
  deleteTrip,
} = require("../controllers/trips.controller");
const { auth, requireRole } = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", listTrips);
router.get("/:tripId", getTrip);
router.post("/", auth, requireRole("admin"), createTrip);
router.put("/:tripId", auth, requireRole("admin"), updateTrip);
router.delete("/:tripId", auth, requireRole("admin"), deleteTrip);

module.exports = router;
