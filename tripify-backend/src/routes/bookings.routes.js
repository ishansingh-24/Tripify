const express = require("express");
const {
  listBookings,
  createBooking,
  updateBookingStatus,
} = require("../controllers/bookings.controller");
const { auth, requireRole } = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", auth, listBookings);
router.post("/", auth, createBooking);
router.patch("/:bookingId/status", auth, requireRole("admin"), updateBookingStatus);

module.exports = router;
