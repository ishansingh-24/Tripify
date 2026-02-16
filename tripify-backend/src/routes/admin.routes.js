const express = require("express");
const { getDashboard } = require("../controllers/admin.controller");
const { auth, requireRole } = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/dashboard", auth, requireRole("admin"), getDashboard);

module.exports = router;
