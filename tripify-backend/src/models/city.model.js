const mongoose = require("mongoose");
const { baseSchemaOptions } = require("./schema-options");

const citySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    image: { type: String, default: "", trim: true },
  },
  baseSchemaOptions,
);

module.exports = mongoose.models.City || mongoose.model("City", citySchema);
