const mongoose = require("mongoose");
const { baseSchemaOptions } = require("./schema-options");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["admin", "customer"], default: "customer" },
  },
  baseSchemaOptions,
);

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
