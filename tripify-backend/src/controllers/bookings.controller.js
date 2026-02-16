const { Booking, Package, Trip, City } = require("../models");

async function listBookings(req, res) {
  const { status } = req.query;
  const query = req.user.role === "admin" ? {} : { userId: String(req.user._id) };
  if (status) {
    query.status = String(status);
  }
  const bookings = await Booking.find(query).sort({ createdAt: -1 });
  return res.json(bookings.map((booking) => booking.toJSON()));
}

async function createBooking(req, res) {
  const { packageId, date, numberOfPeople = 1 } = req.body;
  if (!packageId || !date) {
    return res.status(400).json({ message: "packageId and date are required." });
  }

  const pkg = await Package.findById(packageId);
  if (!pkg) {
    return res.status(400).json({ message: "Invalid packageId." });
  }

  const trip = await Trip.findById(pkg.tripId);
  const city = trip ? await City.findById(trip.cityId) : null;
  if (!trip || !city) {
    return res.status(400).json({ message: "Package relations are invalid." });
  }

  const people = Number(numberOfPeople);
  if (Number.isNaN(people) || people < 1 || people > Number(pkg.maxPeople)) {
    return res.status(400).json({ message: `numberOfPeople must be between 1 and ${pkg.maxPeople}.` });
  }

  const booking = await Booking.create({
    userId: String(req.user._id),
    packageId: String(pkg._id),
    tripId: String(trip._id),
    cityId: String(city._id),
    cityName: city.name,
    packageName: pkg.name,
    date: String(date),
    numberOfPeople: people,
    totalPrice: Number(pkg.price) * people,
    status: "pending",
  });

  return res.status(201).json(booking.toJSON());
}

async function updateBookingStatus(req, res) {
  const { status } = req.body;
  if (!["pending", "confirmed", "cancelled"].includes(String(status))) {
    return res.status(400).json({ message: "status must be pending, confirmed or cancelled." });
  }

  const booking = await Booking.findById(req.params.bookingId);
  if (!booking) {
    return res.status(404).json({ message: "Booking not found." });
  }

  booking.status = String(status);
  await booking.save();

  return res.json(booking.toJSON());
}

module.exports = {
  listBookings,
  createBooking,
  updateBookingStatus,
};
