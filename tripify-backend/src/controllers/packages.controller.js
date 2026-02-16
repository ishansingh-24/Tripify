const { Trip, Package, Booking } = require("../models");

async function listPackages(req, res) {
  const { tripId } = req.query;
  const query = tripId ? { tripId: String(tripId) } : {};
  const packages = await Package.find(query).sort({ createdAt: 1 });
  return res.json(packages.map((pkg) => pkg.toJSON()));
}

async function getPackage(req, res) {
  const pkg = await Package.findById(req.params.packageId);
  if (!pkg) {
    return res.status(404).json({ message: "Package not found." });
  }
  return res.json(pkg.toJSON());
}

async function createPackage(req, res) {
  const { tripId, name, duration, price, maxPeople, includedServices = [], places = [] } = req.body;
  if (!tripId || !name || !duration || price === undefined || maxPeople === undefined) {
    return res
      .status(400)
      .json({ message: "tripId, name, duration, price and maxPeople are required." });
  }

  const trip = await Trip.findById(tripId);
  if (!trip) {
    return res.status(400).json({ message: "Invalid tripId." });
  }

  const pkg = await Package.create({
    tripId: String(trip._id),
    name: String(name).trim(),
    duration: String(duration).trim(),
    price: Number(price),
    maxPeople: Number(maxPeople),
    includedServices: Array.isArray(includedServices)
      ? includedServices.map((service) => String(service).trim()).filter(Boolean)
      : [],
    places: Array.isArray(places) ? places.map((place) => String(place).trim()).filter(Boolean) : [],
  });

  return res.status(201).json(pkg.toJSON());
}

async function updatePackage(req, res) {
  const pkg = await Package.findById(req.params.packageId);
  if (!pkg) {
    return res.status(404).json({ message: "Package not found." });
  }

  const { tripId, name, duration, price, maxPeople, includedServices, places } = req.body;
  if (tripId !== undefined) {
    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(400).json({ message: "Invalid tripId." });
    }
    pkg.tripId = String(trip._id);
  }
  if (name !== undefined) pkg.name = String(name).trim();
  if (duration !== undefined) pkg.duration = String(duration).trim();
  if (price !== undefined) pkg.price = Number(price);
  if (maxPeople !== undefined) pkg.maxPeople = Number(maxPeople);
  if (includedServices !== undefined) {
    pkg.includedServices = Array.isArray(includedServices)
      ? includedServices.map((service) => String(service).trim()).filter(Boolean)
      : [];
  }
  if (places !== undefined) {
    pkg.places = Array.isArray(places) ? places.map((place) => String(place).trim()).filter(Boolean) : [];
  }

  await pkg.save();
  return res.json(pkg.toJSON());
}

async function deletePackage(req, res) {
  const hasBookings = await Booking.exists({ packageId: req.params.packageId });
  if (hasBookings) {
    return res.status(409).json({ message: "Cannot delete package with existing bookings." });
  }

  const removed = await Package.findByIdAndDelete(req.params.packageId);
  if (!removed) {
    return res.status(404).json({ message: "Package not found." });
  }
  return res.status(204).send();
}

module.exports = {
  listPackages,
  getPackage,
  createPackage,
  updatePackage,
  deletePackage,
};
