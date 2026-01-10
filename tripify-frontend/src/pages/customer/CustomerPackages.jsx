

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import Navbar from "../../components/Navbar"
import { mockPackages, mockTrips } from "../../data/mockData"
import { ArrowLeft, Users, Clock } from "lucide-react"

function CustomerPackages() {
  const { tripId } = useParams()
  const navigate = useNavigate()
  const [trip, setTrip] = useState(null)
  const [packages, setPackages] = useState([])
  const [selectedPackage, setSelectedPackage] = useState(null)
  const [bookingData, setBookingData] = useState({
    date: "",
    numberOfPeople: 1,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      const foundTrip = mockTrips.find((t) => t.id === tripId)
      setTrip(foundTrip)
      const tripPackages = mockPackages.filter((p) => p.tripId === tripId)
      setPackages(tripPackages)
      setLoading(false)
    }, 300)
  }, [tripId])

  const handleBooking = () => {
    if (!selectedPackage || !bookingData.date) {
      alert("Please select a package and date")
      return
    }

    const newBooking = {
      id: String(Date.now()),
      userId: JSON.parse(localStorage.getItem("currentUser")).id,
      packageId: selectedPackage.id,
      tripId: selectedPackage.tripId,
      date: bookingData.date,
      numberOfPeople: bookingData.numberOfPeople,
      totalPrice: selectedPackage.price * bookingData.numberOfPeople,
      status: "pending",
    }

    const bookings = JSON.parse(localStorage.getItem("bookings") || "[]")
    bookings.push(newBooking)
    localStorage.setItem("bookings", JSON.stringify(bookings))

    alert("Booking confirmed!")
    navigate("/customer/dashboard")
  }

  const navLinks = [
    { href: "/customer/home", label: "Home" },
    { href: "/customer/dashboard", label: "My Trips" },
    { href: "/customer/profile", label: "Profile" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navbar links={navLinks} />
      <main className="container mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-6 text-primary hover:opacity-80 transition-opacity"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        {loading ? (
          <div>Loading...</div>
        ) : trip ? (
          <>
            <h1 className="text-3xl font-bold mb-2">{trip.title}</h1>
            <p className="text-muted-foreground mb-8">Select a package and book your trip</p>

            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-4">
                {packages.map((pkg) => (
                  <div
                    key={pkg.id}
                    className={`rounded-lg border-2 p-6 cursor-pointer transition-all ${
                      selectedPackage?.id === pkg.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary"
                    }`}
                    onClick={() => setSelectedPackage(pkg)}
                  >
                    <h2 className="text-xl font-bold mb-2">{pkg.name}</h2>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {pkg.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        Up to {pkg.maxPeople} people
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-primary mb-4">${pkg.price} per person</p>
                    <p className="text-sm mb-3">Included:</p>
                    <div className="flex flex-wrap gap-2">
                      {pkg.includedServices.map((service, i) => (
                        <span key={i} className="text-xs bg-secondary text-foreground px-2 py-1 rounded">
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {selectedPackage && (
                <div className="rounded-lg border border-border bg-card p-6 h-fit sticky top-4">
                  <h3 className="text-xl font-bold mb-4">Booking Details</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Travel Date</label>
                      <input
                        type="date"
                        value={bookingData.date}
                        onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                        className="w-full mt-1 px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Number of People</label>
                      <input
                        type="number"
                        min="1"
                        max={selectedPackage.maxPeople}
                        value={bookingData.numberOfPeople}
                        onChange={(e) =>
                          setBookingData({ ...bookingData, numberOfPeople: Number.parseInt(e.target.value) })
                        }
                        className="w-full mt-1 px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div className="border-t border-border pt-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-muted-foreground">Subtotal:</span>
                        <span>${selectedPackage.price * bookingData.numberOfPeople}</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total:</span>
                        <span className="text-primary">${selectedPackage.price * bookingData.numberOfPeople}</span>
                      </div>
                    </div>
                    <button
                      onClick={handleBooking}
                      className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg font-bold hover:opacity-90 transition-opacity"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="text-center">
            <p className="text-muted-foreground">Trip not found</p>
          </div>
        )}
      </main>
    </div>
  )
}

export default CustomerPackages
