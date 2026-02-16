const express = require("express");
const { updateMe } = require("../controllers/users.controller");
const { auth } = require("../middleware/auth.middleware");

const router = express.Router();

router.put("/me", auth, updateMe);

module.exports = router;
