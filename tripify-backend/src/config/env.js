const dotenv = require("dotenv");

dotenv.config();

const config = {
  port: Number(process.env.PORT || 5000),
  jwtSecret: process.env.JWT_SECRET,
  mongodbUri: process.env.MONGODB_URI,
  frontendOrigins: (process.env.FRONTEND_ORIGIN || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
  bcryptSaltRounds: Number(process.env.BCRYPT_SALT_ROUNDS || 10),
};

function validateEnv() {
  if (!config.mongodbUri) {
    throw new Error("MONGODB_URI is required in environment variables.");
  }
  if (!config.jwtSecret) {
    throw new Error("JWT_SECRET is required in environment variables.");
  }
  if (config.frontendOrigins.length === 0) {
    throw new Error("FRONTEND_ORIGIN is required and must include at least one origin.");
  }
}

module.exports = {
  config,
  validateEnv,
};
