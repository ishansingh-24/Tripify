const { City, Trip } = require("../models");

async function listCities(_req, res) {
  const cities = await City.find().sort({ createdAt: 1 });
  return res.json(cities.map((city) => city.toJSON()));
}

async function getCity(req, res) {
  const city = await City.findById(req.params.cityId);
  if (!city) {
    return res.status(404).json({ message: "City not found." });
  }
  return res.json(city.toJSON());
}

async function createCity(req, res) {
  const { name, country, description, image = "" } = req.body;
  if (!name || !country || !description) {
    return res.status(400).json({ message: "name, country and description are required." });
  }

  const city = await City.create({
    name: String(name).trim(),
    country: String(country).trim(),
    description: String(description).trim(),
    image: String(image).trim(),
  });
  return res.status(201).json(city.toJSON());
}

async function updateCity(req, res) {
  const city = await City.findById(req.params.cityId);
  if (!city) {
    return res.status(404).json({ message: "City not found." });
  }

  const { name, country, description, image } = req.body;
  if (name !== undefined) city.name = String(name).trim();
  if (country !== undefined) city.country = String(country).trim();
  if (description !== undefined) city.description = String(description).trim();
  if (image !== undefined) city.image = String(image).trim();

  await city.save();
  return res.json(city.toJSON());
}

async function deleteCity(req, res) {
  const hasTrips = await Trip.exists({ cityId: req.params.cityId });
  if (hasTrips) {
    return res.status(409).json({ message: "Cannot delete city with existing trips." });
  }

  const removed = await City.findByIdAndDelete(req.params.cityId);
  if (!removed) {
    return res.status(404).json({ message: "City not found." });
  }
  return res.status(204).send();
}

module.exports = {
  listCities,
  getCity,
  createCity,
  updateCity,
  deleteCity,
};
