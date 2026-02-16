const { User } = require("../models");
const { toPublicUser } = require("../utils/auth");

async function updateMe(req, res) {
  const { name, email } = req.body;
  const normalizedEmail = String(email || "").toLowerCase().trim();

  if (!name || !normalizedEmail) {
    return res.status(400).json({ message: "Name and email are required." });
  }

  const conflict = await User.findOne({
    email: normalizedEmail,
    _id: { $ne: req.user._id },
  });
  if (conflict) {
    return res.status(409).json({ message: "Email already exists." });
  }

  req.user.name = String(name).trim();
  req.user.email = normalizedEmail;
  await req.user.save();

  return res.json({ user: toPublicUser(req.user) });
}

module.exports = {
  updateMe,
};
