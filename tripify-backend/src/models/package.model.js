const mongoose = require("mongoose");
const { baseSchemaOptions } = require("./schema-options");

const packageSchema = new mongoose.Schema(
  {
    tripId: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    duration: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    maxPeople: { type: Number, required: true },
    includedServices: [{ type: String, trim: true }],
    places: [{ type: String, trim: true }],
  },
  baseSchemaOptions,
);

module.exports = mongoose.models.Package || mongoose.model("Package", packageSchema);
