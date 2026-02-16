"use client"

import { useState, useEffect } from "react"
import Navbar from "../../components/Navbar"
import { api } from "../../lib/api"

function AdminBookings() {
  const [bookings, setBookings] = useState([])
  const [selectedStatus, setSelectedStatus] = useState("all")

  useEffect(() => {
    const load = async () => {
      const data = await api.bookings.list(selectedStatus === "all" ? undefined : selectedStatus)
      setBookings(data)
    }

    load()
  }, [selectedStatus])

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      const updated = await api.bookings.updateStatus(bookingId, newStatus)
      setBookings((prev) => prev.map((b) => (b.id === bookingId ? updated : b)))
    } catch (err) {
      alert(err.message)
    }
  }

  const navLinks = [
    { href: "/admin/dashboard", label: "Dashboard" },
    { href: "/admin/cities", label: "Cities" },
    { href: "/admin/trips", label: "Trips" },
    { href: "/admin/packages", label: "Packages" },
    { href: "/admin/bookings", label: "Bookings" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navbar links={navLinks} />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Manage Bookings</h1>

        <div className="mb-6 flex gap-2">
          {["all", "confirmed", "pending", "cancelled"].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedStatus === status
                  ? "bg-primary text-primary-foreground"
                  : "border border-border hover:bg-secondary"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">City</th>
                <th className="px-4 py-3 text-left font-semibold">Package</th>
                <th className="px-4 py-3 text-left font-semibold">Date</th>
                <th className="px-4 py-3 text-left font-semibold">People</th>
                <th className="px-4 py-3 text-left font-semibold">Price</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id} className="border-b border-border hover:bg-secondary/50 transition-colors">
                  <td className="px-4 py-3">{booking.cityName}</td>
                  <td className="px-4 py-3">{booking.packageName}</td>
                  <td className="px-4 py-3">{new Date(booking.date).toLocaleDateString()}</td>
                  <td className="px-4 py-3">{booking.numberOfPeople}</td>
                  <td className="px-4 py-3 font-bold text-primary">${booking.totalPrice}</td>
                  <td className="px-4 py-3">
                    <select
                      value={booking.status}
                      onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                      className="px-2 py-1 border border-border rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {bookings.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No bookings found</p>
          </div>
        )}
      </main>
    </div>
  )
}

export default AdminBookings
