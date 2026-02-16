import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../../components/Navbar"
import { api } from "../../lib/api"

function CustomerHome() {
  const navigate = useNavigate()
  const [cities, setCities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const result = await api.cities.list()
        setCities(result)
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar links={navLinks} />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Explore Destinations</h1>
          <p className="text-muted-foreground">Discover amazing places to visit</p>
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-lg border border-border bg-card p-4 ">
                <div className="h-48 bg-muted rounded-lg mb-4"></div>
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {cities.map((city) => (
              <div
                key={city.id}
                className="rounded-lg border border-border bg-card overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/customer/trips/${city.id}`)}
              >
                <div className="h-48 bg-muted">
                  <img src={city.image} alt={city.name} className="h-48 w-full object-cover" />
                </div>
                <div className="p-4">
                  <h2 className="text-lg font-bold">{city.name}</h2>
                  <p className="text-sm text-muted-foreground">{city.country}</p>
                  <p className="mt-2 text-sm text-foreground">{city.description}</p>
                  <button className="mt-4 w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
                    View Trips
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default CustomerHome
