const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 5000);
const JWT_SECRET = process.env.JWT_SECRET || "tripify-dev-secret";
const FRONTEND_ORIGINS = (process.env.FRONTEND_ORIGIN ||
  "http://localhost:3000,http://localhost:3001")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("MONGODB_URI is required in environment variables.");
  process.exit(1);
}

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || FRONTEND_ORIGINS.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(null, false);
    },
    credentials: true,
  }),
);
app.use(express.json());

const baseSchemaOptions = {
  timestamps: true,
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform: (_doc, ret) => {
      ret.id = String(ret._id);
      delete ret._id;
      return ret;
    },
  },
};

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["admin", "customer"], default: "customer" },
  },
  baseSchemaOptions,
);

const citySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    image: { type: String, default: "", trim: true },
  },
  baseSchemaOptions,
);

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

const User = mongoose.model("User", userSchema);
const City = mongoose.model("City", citySchema);
const Trip = mongoose.model("Trip", tripSchema);
const Package = mongoose.model("Package", packageSchema);
const Booking = mongoose.model("Booking", bookingSchema);

const seedData = {
  users: [
    {
      name: "Admin User",
      email: "admin@travel.com",
      password: "admin123",
      role: "admin",
    },
    {
      name: "Ishan Singh",
      email: "ishan@travel.com",
      password: "password123",
      role: "customer",
    },
    {
      name: "John Doe",
      email: "john@travel.com",
      password: "password123",
      role: "customer",
    },
  ],
  cities: [
    {
      name: "Paris",
      country: "France",
      description: "The City of Light - Experience romance and culture",
      image: "/paris-eiffel-tower-cityscape.jpg",
    },
    {
      name: "Tokyo",
      country: "Japan",
      description: "Modern meets tradition in this vibrant metropolis",
      image: "/tokyo-city-lights-japan.jpg",
    },
    {
      name: "New York",
      country: "USA",
      description: "The city that never sleeps",
      image: "/new-york-skyline-cityscape.jpg",
    },
    {
      name: "Bali",
      country: "Indonesia",
      description: "Tropical paradise with beaches and culture",
      image: "/bali-beach-tropical-sunset.jpg",
    },
    {
      name: "Dubai",
      country: "UAE",
      description: "Luxury shopping and modern architecture",
      image: "/dubai-burj-khalifa-cityscape.jpg",
    },
    {
      name: "London",
      country: "UK",
      description: "Historic landmarks and royal heritage",
      image: "/london-big-ben-thames-river.jpg",
    },
  ],
  trips: [
    {
      cityName: "Paris",
      title: "Romantic Paris Getaway",
      duration: "5 days",
      description: "Visit the Eiffel Tower, Louvre, and Seine",
      places: ["Eiffel Tower", "Louvre", "Arc de Triomphe", "Notre-Dame"],
    },
    {
      cityName: "Paris",
      title: "Extended Paris Culture Tour",
      duration: "7 days",
      description: "Deep dive into Parisian art and history",
      places: ["Versailles", "Musee d'Orsay", "Latin Quarter", "Sacre-Coeur"],
    },
    {
      cityName: "Tokyo",
      title: "Tokyo Urban Adventure",
      duration: "4 days",
      description: "Experience Tokyo's bustling streets and culture",
      places: ["Shibuya", "Senso-ji", "Harajuku", "teamLab Borderless"],
    },
    {
      cityName: "Tokyo",
      title: "Traditional Japan Experience",
      duration: "6 days",
      description: "Combine Tokyo with traditional Japanese culture",
      places: ["Mount Fuji", "Kyoto", "Temples", "Traditional Tea Ceremony"],
    },
    {
      cityName: "New York",
      title: "NYC Weekend Escape",
      duration: "3 days",
      description: "Classic New York experience",
      places: ["Times Square", "Statue of Liberty", "Central Park", "Broadway"],
    },
    {
      cityName: "Bali",
      title: "Bali Beach Paradise",
      duration: "5 days",
      description: "Relax on pristine beaches",
      places: ["Ubud", "Seminyak Beach", "Sacred Monkey Forest", "Rice Terraces"],
    },
  ],
  packages: [
    {
      tripTitle: "Romantic Paris Getaway",
      name: "Paris Classic",
      duration: "5 days / 4 nights",
      price: 1200,
      maxPeople: 4,
      includedServices: ["Hotel", "Breakfast", "Guided Tours", "Transport"],
      places: ["Eiffel Tower", "Louvre", "Arc de Triomphe", "Notre-Dame"],
    },
    {
      tripTitle: "Romantic Paris Getaway",
      name: "Paris Luxury",
      duration: "5 days / 4 nights",
      price: 2000,
      maxPeople: 4,
      includedServices: ["5-Star Hotel", "All Meals", "Private Guide", "VIP Access"],
      places: ["Eiffel Tower", "Louvre", "Arc de Triomphe", "Notre-Dame"],
    },
    {
      tripTitle: "Extended Paris Culture Tour",
      name: "Paris Extended",
      duration: "7 days / 6 nights",
      price: 1600,
      maxPeople: 6,
      includedServices: ["Hotel", "Breakfast", "Guided Tours", "Versailles Tour"],
      places: ["Versailles", "Musee d'Orsay", "Latin Quarter", "Sacre-Coeur"],
    },
    {
      tripTitle: "Tokyo Urban Adventure",
      name: "Tokyo Discovery",
      duration: "4 days / 3 nights",
      price: 1100,
      maxPeople: 5,
      includedServices: ["Hotel", "JR Pass", "Guided Tours", "Breakfast"],
      places: ["Shibuya", "Senso-ji", "Harajuku", "teamLab Borderless"],
    },
    {
      tripTitle: "Tokyo Urban Adventure",
      name: "Tokyo Premium",
      duration: "4 days / 3 nights",
      price: 1800,
      maxPeople: 4,
      includedServices: ["Luxury Hotel", "Premium Meals", "Private Driver", "Experiences"],
      places: ["Shibuya", "Senso-ji", "Harajuku", "teamLab Borderless"],
    },
    {
      tripTitle: "NYC Weekend Escape",
      name: "NYC Weekend",
      duration: "3 days / 2 nights",
      price: 900,
      maxPeople: 6,
      includedServices: ["Hotel", "Breakfast", "Metro Pass", "Broadway Show"],
      places: ["Times Square", "Statue of Liberty", "Central Park", "Broadway"],
    },
    {
      tripTitle: "Bali Beach Paradise",
      name: "Bali Getaway",
      duration: "5 days / 4 nights",
      price: 950,
      maxPeople: 6,
      includedServices: ["Resort", "Meals", "Beach Activities", "Spa"],
      places: ["Ubud", "Seminyak Beach", "Sacred Monkey Forest", "Rice Terraces"],
    },
  ],
};

function toPublicUser(userDoc) {
  return {
    id: String(userDoc._id),
    name: userDoc.name,
    email: userDoc.email,
    role: userDoc.role,
  };
}

function buildToken(userDoc) {
  return jwt.sign(
    {
      sub: String(userDoc._id),
      role: userDoc.role,
      email: userDoc.email,
      name: userDoc.name,
    },
    JWT_SECRET,
    { expiresIn: "7d" },
  );
}

async function seedIfNeeded() {
  const existingUsers = await User.countDocuments();
  if (existingUsers > 0) {
    return;
  }

  const createdUsers = await Promise.all(
    seedData.users.map(async (user) => {
      const passwordHash = await bcrypt.hash(user.password, 10);
      return User.create({
        name: user.name,
        email: user.email,
        passwordHash,
        role: user.role,
      });
    }),
  );

  const createdCities = await City.insertMany(seedData.cities);
  const cityByName = new Map(createdCities.map((city) => [city.name, city]));

  const tripsToInsert = seedData.trips.map((trip) => {
    const city = cityByName.get(trip.cityName);
    if (!city) {
      throw new Error(`Missing city for seed trip: ${trip.title}`);
    }
    return {
      cityId: String(city._id),
      title: trip.title,
      duration: trip.duration,
      description: trip.description,
      places: trip.places,
    };
  });

  const createdTrips = await Trip.insertMany(tripsToInsert);
  const tripByTitle = new Map(createdTrips.map((trip) => [trip.title, trip]));

  const packagesToInsert = seedData.packages.map((pkg) => {
    const trip = tripByTitle.get(pkg.tripTitle);
    if (!trip) {
      throw new Error(`Missing trip for seed package: ${pkg.name}`);
    }
    return {
      tripId: String(trip._id),
      name: pkg.name,
      duration: pkg.duration,
      price: pkg.price,
      maxPeople: pkg.maxPeople,
      includedServices: pkg.includedServices,
      places: pkg.places,
    };
  });

  const createdPackages = await Package.insertMany(packagesToInsert);

  const ishan = createdUsers.find((u) => u.email === "ishan@travel.com");
  const parisClassic = createdPackages.find((p) => p.name === "Paris Classic");
  const tokyoDiscovery = createdPackages.find((p) => p.name === "Tokyo Discovery");
  const nycWeekend = createdPackages.find((p) => p.name === "NYC Weekend");
  const paris = createdCities.find((c) => c.name === "Paris");
  const tokyo = createdCities.find((c) => c.name === "Tokyo");
  const newYork = createdCities.find((c) => c.name === "New York");
  const parisTrip = createdTrips.find((t) => t.title === "Romantic Paris Getaway");
  const tokyoTrip = createdTrips.find((t) => t.title === "Tokyo Urban Adventure");
  const nyTrip = createdTrips.find((t) => t.title === "NYC Weekend Escape");

  await Booking.insertMany([
    {
      userId: String(ishan._id),
      packageId: String(parisClassic._id),
      tripId: String(parisTrip._id),
      cityId: String(paris._id),
      cityName: "Paris",
      packageName: "Paris Classic",
      date: "2026-03-20",
      numberOfPeople: 2,
      totalPrice: 2400,
      status: "confirmed",
    },
    {
      userId: String(ishan._id),
      packageId: String(tokyoDiscovery._id),
      tripId: String(tokyoTrip._id),
      cityId: String(tokyo._id),
      cityName: "Tokyo",
      packageName: "Tokyo Discovery",
      date: "2026-04-15",
      numberOfPeople: 3,
      totalPrice: 3300,
      status: "pending",
    },
    {
      userId: String(ishan._id),
      packageId: String(nycWeekend._id),
      tripId: String(nyTrip._id),
      cityId: String(newYork._id),
      cityName: "New York",
      packageName: "NYC Weekend",
      date: "2025-12-10",
      numberOfPeople: 2,
      totalPrice: 1800,
      status: "cancelled",
    },
  ]);
}

async function auth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Authorization token is required." });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(payload.sub);
    if (!user) {
      return res.status(401).json({ message: "Invalid token user." });
    }
    req.user = user;
    return next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden." });
    }
    return next();
  };
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "tripify-backend" });
});

app.post("/api/auth/register", async (req, res) => {
  const { name, email, password } = req.body;
  const normalizedEmail = String(email || "").toLowerCase().trim();

  if (!name || !normalizedEmail || !password) {
    return res.status(400).json({ message: "Name, email and password are required." });
  }
  if (String(password).length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters." });
  }

  const exists = await User.findOne({ email: normalizedEmail });
  if (exists) {
    return res.status(409).json({ message: "Email already exists." });
  }

  const user = await User.create({
    name: String(name).trim(),
    email: normalizedEmail,
    passwordHash: await bcrypt.hash(String(password), 10),
    role: "customer",
  });

  const token = buildToken(user);
  return res.status(201).json({ token, user: toPublicUser(user) });
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = String(email || "").toLowerCase().trim();

  if (!normalizedEmail || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  const user = await User.findOne({ email: normalizedEmail });
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  const valid = await bcrypt.compare(String(password), user.passwordHash);
  if (!valid) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  const token = buildToken(user);
  return res.json({ token, user: toPublicUser(user) });
});

app.get("/api/auth/me", auth, (req, res) => {
  res.json({ user: toPublicUser(req.user) });
});

app.put("/api/users/me", auth, async (req, res) => {
  const { name, email } = req.body;
  const normalizedEmail = String(email || "").toLowerCase().trim();

  if (!name || !normalizedEmail) {
    return res.status(400).json({ message: "Name and email are required." });
  }

  const conflict = await User.findOne({
    email: normalizedEmail,
    _id: { $ne: req.user._id },
  });
  if (conflict) {
    return res.status(409).json({ message: "Email already exists." });
  }

  req.user.name = String(name).trim();
  req.user.email = normalizedEmail;
  await req.user.save();

  return res.json({ user: toPublicUser(req.user) });
});

app.get("/api/cities", async (_req, res) => {
  const cities = await City.find().sort({ createdAt: 1 });
  res.json(cities.map((c) => c.toJSON()));
});

app.get("/api/cities/:cityId", async (req, res) => {
  const city = await City.findById(req.params.cityId);
  if (!city) {
    return res.status(404).json({ message: "City not found." });
  }
  return res.json(city.toJSON());
});

app.post("/api/cities", auth, requireRole("admin"), async (req, res) => {
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
});

app.put("/api/cities/:cityId", auth, requireRole("admin"), async (req, res) => {
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
});

app.delete("/api/cities/:cityId", auth, requireRole("admin"), async (req, res) => {
  const hasTrips = await Trip.exists({ cityId: req.params.cityId });
  if (hasTrips) {
    return res.status(409).json({ message: "Cannot delete city with existing trips." });
  }

  const removed = await City.findByIdAndDelete(req.params.cityId);
  if (!removed) {
    return res.status(404).json({ message: "City not found." });
  }

  return res.status(204).send();
});

app.get("/api/trips", async (req, res) => {
  const { cityId } = req.query;
  const query = cityId ? { cityId: String(cityId) } : {};
  const trips = await Trip.find(query).sort({ createdAt: 1 });
  res.json(trips.map((t) => t.toJSON()));
});

app.get("/api/trips/:tripId", async (req, res) => {
  const trip = await Trip.findById(req.params.tripId);
  if (!trip) {
    return res.status(404).json({ message: "Trip not found." });
  }
  return res.json(trip.toJSON());
});

app.post("/api/trips", auth, requireRole("admin"), async (req, res) => {
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
});

app.put("/api/trips/:tripId", auth, requireRole("admin"), async (req, res) => {
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
});

app.delete("/api/trips/:tripId", auth, requireRole("admin"), async (req, res) => {
  const hasPackages = await Package.exists({ tripId: req.params.tripId });
  if (hasPackages) {
    return res.status(409).json({ message: "Cannot delete trip with existing packages." });
  }

  const removed = await Trip.findByIdAndDelete(req.params.tripId);
  if (!removed) {
    return res.status(404).json({ message: "Trip not found." });
  }

  return res.status(204).send();
});

app.get("/api/packages", async (req, res) => {
  const { tripId } = req.query;
  const query = tripId ? { tripId: String(tripId) } : {};
  const packages = await Package.find(query).sort({ createdAt: 1 });
  res.json(packages.map((pkg) => pkg.toJSON()));
});

app.get("/api/packages/:packageId", async (req, res) => {
  const pkg = await Package.findById(req.params.packageId);
  if (!pkg) {
    return res.status(404).json({ message: "Package not found." });
  }
  return res.json(pkg.toJSON());
});

app.post("/api/packages", auth, requireRole("admin"), async (req, res) => {
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
});

app.put("/api/packages/:packageId", auth, requireRole("admin"), async (req, res) => {
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
});

app.delete("/api/packages/:packageId", auth, requireRole("admin"), async (req, res) => {
  const hasBookings = await Booking.exists({ packageId: req.params.packageId });
  if (hasBookings) {
    return res.status(409).json({ message: "Cannot delete package with existing bookings." });
  }

  const removed = await Package.findByIdAndDelete(req.params.packageId);
  if (!removed) {
    return res.status(404).json({ message: "Package not found." });
  }

  return res.status(204).send();
});

app.get("/api/bookings", auth, async (req, res) => {
  const { status } = req.query;
  const query = req.user.role === "admin" ? {} : { userId: String(req.user._id) };
  if (status) {
    query.status = String(status);
  }
  const bookings = await Booking.find(query).sort({ createdAt: -1 });
  res.json(bookings.map((b) => b.toJSON()));
});

app.post("/api/bookings", auth, async (req, res) => {
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
});

app.patch("/api/bookings/:bookingId/status", auth, requireRole("admin"), async (req, res) => {
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
});

app.get("/api/admin/dashboard", auth, requireRole("admin"), async (_req, res) => {
  const [totalBookings, totalCities, totalTrips, bookings] = await Promise.all([
    Booking.countDocuments(),
    City.countDocuments(),
    Trip.countDocuments(),
    Booking.find().sort({ createdAt: -1 }),
  ]);

  const totalRevenue = bookings.reduce(
    (sum, booking) => sum + (booking.status !== "cancelled" ? Number(booking.totalPrice) : 0),
    0,
  );

  const statusCounts = bookings.reduce(
    (acc, booking) => {
      acc[booking.status] = (acc[booking.status] || 0) + 1;
      return acc;
    },
    { confirmed: 0, pending: 0, cancelled: 0 },
  );

  res.json({
    stats: {
      totalBookings,
      totalRevenue,
      totalCities,
      totalTrips,
    },
    statusCounts,
    recentBookings: bookings.slice(0, 5).map((b) => b.toJSON()),
  });
});

app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.path}` });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error." });
});

(async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    await seedIfNeeded();

    app.listen(PORT, () => {
      console.log(`Tripify backend running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to initialize backend:", error);
    process.exit(1);
  }
})();
