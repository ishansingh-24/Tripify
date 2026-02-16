const bcrypt = require("bcryptjs");
const { config } = require("../config/env");
const { User } = require("../models");
const { buildToken, toPublicUser } = require("../utils/auth");

async function register(req, res) {
  const { name, email, password } = req.body;
  const normalizedEmail = String(email || "").toLowerCase().trim();

  if (!name || !normalizedEmail || !password) {
    return res.status(400).json({ message: "Name, email and password are required." });
  }
  if (String(password).length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters." });
  }

  const exists = await User.findOne({ email: normalizedEmail });
  if (exists) {
    return res.status(409).json({ message: "Email already exists." });
  }

  const user = await User.create({
    name: String(name).trim(),
    email: normalizedEmail,
    passwordHash: await bcrypt.hash(String(password), config.bcryptSaltRounds),
    role: "customer",
  });

  const token = buildToken(user);
  return res.status(201).json({ token, user: toPublicUser(user) });
}

async function login(req, res) {
  const { email, password } = req.body;
  const normalizedEmail = String(email || "").toLowerCase().trim();

  if (!normalizedEmail || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  const user = await User.findOne({ email: normalizedEmail });
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  const valid = await bcrypt.compare(String(password), user.passwordHash);
  if (!valid) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  const token = buildToken(user);
  return res.json({ token, user: toPublicUser(user) });
}

function me(req, res) {
  return res.json({ user: toPublicUser(req.user) });
}

module.exports = {
  register,
  login,
  me,
};
