const mongoose = require("mongoose");
const { baseSchemaOptions } = require("./schema-options");

const tripSchema = new mongoose.Schema(
  {
    cityId: { type: String, required: true },
    title: { type: String, required: true, trim: true },
    duration: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    places: [{ type: String, trim: true }],
  },
  baseSchemaOptions,
);

module.exports = mongoose.models.Trip || mongoose.model("Trip", tripSchema);
