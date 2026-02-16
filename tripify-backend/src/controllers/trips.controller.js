const { City, Trip, Package } = require("../models");

async function listTrips(req, res) {
  const { cityId } = req.query;
  const query = cityId ? { cityId: String(cityId) } : {};
  const trips = await Trip.find(query).sort({ createdAt: 1 });
  return res.json(trips.map((trip) => trip.toJSON()));
}

async function getTrip(req, res) {
  const trip = await Trip.findById(req.params.tripId);
  if (!trip) {
    return res.status(404).json({ message: "Trip not found." });
  }
  return res.json(trip.toJSON());
}

async function createTrip(req, res) {
  const { cityId, title, duration, description, places = [] } = req.body;
  if (!cityId || !title || !duration || !description) {
    return res.status(400).json({ message: "cityId, title, duration and description are required." });
  }

  const city = await City.findById(cityId);
  if (!city) {
    return res.status(400).json({ message: "Invalid cityId." });
  }

  const trip = await Trip.create({
    cityId: String(city._id),
    title: String(title).trim(),
    duration: String(duration).trim(),
    description: String(description).trim(),
    places: Array.isArray(places) ? places.map((place) => String(place).trim()).filter(Boolean) : [],
  });

  return res.status(201).json(trip.toJSON());
}

async function updateTrip(req, res) {
  const trip = await Trip.findById(req.params.tripId);
  if (!trip) {
    return res.status(404).json({ message: "Trip not found." });
  }

  const { cityId, title, duration, description, places } = req.body;
  if (cityId !== undefined) {
    const city = await City.findById(cityId);
    if (!city) {
      return res.status(400).json({ message: "Invalid cityId." });
    }
    trip.cityId = String(city._id);
  }
  if (title !== undefined) trip.title = String(title).trim();
  if (duration !== undefined) trip.duration = String(duration).trim();
  if (description !== undefined) trip.description = String(description).trim();
  if (places !== undefined) {
    trip.places = Array.isArray(places) ? places.map((place) => String(place).trim()).filter(Boolean) : [];
  }

  await trip.save();
  return res.json(trip.toJSON());
}

async function deleteTrip(req, res) {
  const hasPackages = await Package.exists({ tripId: req.params.tripId });
  if (hasPackages) {
    return res.status(409).json({ message: "Cannot delete trip with existing packages." });
  }

  const removed = await Trip.findByIdAndDelete(req.params.tripId);
  if (!removed) {
    return res.status(404).json({ message: "Trip not found." });
  }
  return res.status(204).send();
}

module.exports = {
  listTrips,
  getTrip,
  createTrip,
  updateTrip,
  deleteTrip,
};
