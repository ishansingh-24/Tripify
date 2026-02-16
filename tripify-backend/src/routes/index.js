const express = require("express");
const healthRoutes = require("./health.routes");
const authRoutes = require("./auth.routes");
const usersRoutes = require("./users.routes");
const citiesRoutes = require("./cities.routes");
const tripsRoutes = require("./trips.routes");
const packagesRoutes = require("./packages.routes");
const bookingsRoutes = require("./bookings.routes");
const adminRoutes = require("./admin.routes");

const router = express.Router();

router.use("/health", healthRoutes);
router.use("/auth", authRoutes);
router.use("/users", usersRoutes);
router.use("/cities", citiesRoutes);
router.use("/trips", tripsRoutes);
router.use("/packages", packagesRoutes);
router.use("/bookings", bookingsRoutes);
router.use("/admin", adminRoutes);

module.exports = router;
