"use client"

import { useState, useEffect } from "react"
import Navbar from "../../components/Navbar"
import { BookOpen, MapPin, Package, DollarSign } from "lucide-react"
import { api } from "../../lib/api"

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    totalCities: 0,
    totalTrips: 0,
  })
  const [statusCounts, setStatusCounts] = useState({ confirmed: 0, pending: 0, cancelled: 0 })
  const [recentBookings, setRecentBookings] = useState([])

  useEffect(() => {
    const load = async () => {
      const data = await api.admin.dashboard()
      setStats(data.stats)
      setStatusCounts(data.statusCounts)
      setRecentBookings(data.recentBookings)
    }

    load()
  }, [])

  const navLinks = [
    { href: "/admin/dashboard", label: "Dashboard" },
    { href: "/admin/cities", label: "Cities" },
    { href: "/admin/trips", label: "Trips" },
    { href: "/admin/packages", label: "Packages" },
    { href: "/admin/bookings", label: "Bookings" },
  ]

  const StatCard = ({ icon: Icon, title, value }) => (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      <Navbar links={navLinks} />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatCard icon={BookOpen} title="Total Bookings" value={stats.totalBookings} />
          <StatCard icon={DollarSign} title="Total Revenue" value={`$${stats.totalRevenue}`} />
          <StatCard icon={MapPin} title="Cities" value={stats.totalCities} />
          <StatCard icon={Package} title="Trips" value={stats.totalTrips} />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-lg font-bold mb-4">Recent Bookings</h2>
            <div className="space-y-3">
              {recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between pb-3 border-b border-border last:border-0">
                  <div>
                    <p className="font-medium">{booking.cityName}</p>
                    <p className="text-xs text-muted-foreground">{booking.packageName}</p>
                  </div>
                  <span className="text-sm font-bold text-primary">${booking.totalPrice}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-lg font-bold mb-4">Booking Status</h2>
            <div className="space-y-3">
              {[
                { label: "Confirmed", count: statusCounts.confirmed || 0, color: "text-green-600" },
                { label: "Pending", count: statusCounts.pending || 0, color: "text-yellow-600" },
                { label: "Cancelled", count: statusCounts.cancelled || 0, color: "text-red-600" },
              ].map((status) => (
                <div key={status.label} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{status.label}</span>
                  <span className={`text-lg font-bold ${status.color}`}>{status.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default AdminDashboard
