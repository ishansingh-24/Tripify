const mongoose = require("mongoose");
const { baseSchemaOptions } = require("./schema-options");

const bookingSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    packageId: { type: String, required: true },
    tripId: { type: String, required: true },
    cityId: { type: String, required: true },
    cityName: { type: String, required: true, trim: true },
    packageName: { type: String, required: true, trim: true },
    date: { type: String, required: true },
    numberOfPeople: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
  },
  baseSchemaOptions,
);

module.exports = mongoose.models.Booking || mongoose.model("Booking", bookingSchema);
