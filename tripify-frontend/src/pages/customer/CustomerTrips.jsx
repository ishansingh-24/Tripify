

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import Navbar from "../../components/Navbar"
import { mockCities, mockTrips } from "../../data/mockData"
import { ArrowLeft } from "lucide-react"

function CustomerTrips() {
  const { cityId } = useParams()
  const navigate = useNavigate()
  const [city, setCity] = useState(null)
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      const foundCity = mockCities.find((c) => c.id === cityId)
      setCity(foundCity)
      const cityTrips = mockTrips.filter((t) => t.cityId === cityId)
      setTrips(cityTrips)
      setLoading(false)
    }, 300)
  }, [cityId])

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
          <div className="space-y-4">
            <div className="h-8 bg-muted rounded w-1/4 animate-pulse"></div>
            <div className="h-4 bg-muted rounded w-1/2 animate-pulse"></div>
          </div>
        ) : city ? (
          <>
            <h1 className="text-3xl font-bold mb-2">
              {city.name}, {city.country}
            </h1>
            <p className="text-muted-foreground mb-8">{city.description}</p>

            <div className="grid gap-6">
              {trips.map((trip) => (
                <div
                  key={trip.id}
                  className="rounded-lg border border-border bg-card p-6 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => navigate(`/customer/packages/${trip.id}`)}
                >
                  <h2 className="text-xl font-bold mb-2">{trip.title}</h2>
                  <p className="text-sm text-muted-foreground mb-3">{trip.duration}</p>
                  <p className="text-foreground mb-4">{trip.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {trip.places.map((place, i) => (
                      <span key={i} className="text-xs bg-secondary text-foreground px-2 py-1 rounded">
                        {place}
                      </span>
                    ))}
                  </div>
                  <button className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
                    View Packages
                  </button>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center">
            <p className="text-muted-foreground">City not found</p>
          </div>
        )}
      </main>
    </div>
  )
}

export default CustomerTrips
