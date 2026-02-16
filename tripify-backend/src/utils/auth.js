const jwt = require("jsonwebtoken");
const { config } = require("../config/env");

function toPublicUser(userDoc) {
  return {
    id: String(userDoc._id),
    name: userDoc.name,
    email: userDoc.email,
    role: userDoc.role,
  };
}

function buildToken(userDoc) {
  return jwt.sign(
    {
      sub: String(userDoc._id),
      role: userDoc.role,
      email: userDoc.email,
      name: userDoc.name,
    },
    config.jwtSecret,
    { expiresIn: "7d" },
  );
}

module.exports = {
  toPublicUser,
  buildToken,
};
