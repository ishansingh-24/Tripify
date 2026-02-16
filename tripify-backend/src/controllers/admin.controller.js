const { Booking, City, Trip } = require("../models");

async function getDashboard(_req, res) {
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

  return res.json({
    stats: {
      totalBookings,
      totalRevenue,
      totalCities,
      totalTrips,
    },
    statusCounts,
    recentBookings: bookings.slice(0, 5).map((booking) => booking.toJSON()),
  });
}

module.exports = {
  getDashboard,
};
