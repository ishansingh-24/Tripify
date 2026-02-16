import { useState, useEffect } from "react"
import Navbar from "../../components/Navbar"
import StatusBadge from "../../components/StatusBadge"
import EmptyState from "../../components/EmptyState"
import { Calendar } from "lucide-react"
import { api } from "../../lib/api"

function CustomerDashboard() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const data = await api.bookings.list()
        setBookings(data)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const navLinks = [
    { href: "/customer/home", label: "Home" },
    { href: "/customer/dashboard", label: "My Trips" },
    { href: "/customer/profile", label: "Profile" },
  ]

  const upcomingBookings = bookings.filter((b) => new Date(b.date) > new Date() && b.status !== "cancelled")
  const pastBookings = bookings.filter((b) => new Date(b.date) <= new Date() || b.status === "cancelled")

  return (
    <div className="min-h-screen bg-background">
      <Navbar links={navLinks} />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Trips</h1>

        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-bold mb-4">Upcoming Trips</h2>
            {loading ? (
              <div className="space-y-4">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="rounded-lg border border-border bg-card p-4 animate-pulse">
                    <div className="h-4 bg-muted rounded mb-2"></div>
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            ) : upcomingBookings.length > 0 ? (
              <div className="space-y-4">
                {upcomingBookings.map((booking) => (
                  <div key={booking.id} className="rounded-lg border border-border bg-card p-4 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg">{booking.cityName}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{booking.packageName}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(booking.date).toLocaleDateString()}
                          </span>
                          <span>{booking.numberOfPeople} people</span>
                        </div>
                        <p className="text-lg font-bold mt-3 text-primary">${booking.totalPrice}</p>
                      </div>
                      <StatusBadge status={booking.status} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState icon={Calendar} title="No upcoming trips" description="Start booking your next adventure!" />
            )}
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4">Past Trips</h2>
            {pastBookings.length > 0 ? (
              <div className="space-y-4">
                {pastBookings.map((booking) => (
                  <div key={booking.id} className="rounded-lg border border-border bg-card p-4 opacity-75">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg">{booking.cityName}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{booking.packageName}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(booking.date).toLocaleDateString()}
                          </span>
                          <span>{booking.numberOfPeople} people</span>
                        </div>
                        <p className="text-lg font-bold mt-3 text-primary">${booking.totalPrice}</p>
                      </div>
                      <StatusBadge status={booking.status} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState icon={Calendar} title="No past trips" description="Your completed trips will appear here" />
            )}
          </section>
        </div>
      </main>
    </div>
  )
}

export default CustomerDashboard
