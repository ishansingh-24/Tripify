"use client"

import { useState, useEffect } from "react"
import Navbar from "../../components/Navbar"
import { Trash2, Edit2, Plus } from "lucide-react"
import { api } from "../../lib/api"

function AdminTrips() {
  const [trips, setTrips] = useState([])
  const [cities, setCities] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({})
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    const load = async () => {
      const [tripData, cityData] = await Promise.all([api.trips.list(), api.cities.list()])
      setTrips(tripData)
      setCities(cityData)
    }

    load()
  }, [])

  const handleAdd = async () => {
    try {
      const created = await api.trips.create({
        ...formData,
        places: formData.places?.split(",").map((p) => p.trim()) || [],
      })
      setTrips((prev) => [...prev, created])
      setFormData({})
      setShowForm(false)
    } catch (err) {
      alert(err.message)
    }
  }

  const handleUpdate = async () => {
    try {
      const updated = await api.trips.update(editingId, {
        ...formData,
        places: formData.places?.split(",").map((p) => p.trim()) || [],
      })
      setTrips((prev) => prev.map((t) => (t.id === editingId ? updated : t)))
      setEditingId(null)
      setFormData({})
    } catch (err) {
      alert(err.message)
    }
  }

  const handleDelete = async (id) => {
    try {
      await api.trips.remove(id)
      setTrips((prev) => prev.filter((t) => t.id !== id))
    } catch (err) {
      alert(err.message)
    }
  }

  const handleEdit = (trip) => {
    setEditingId(trip.id)
    setFormData({ ...trip, places: trip.places?.join(", ") || "" })
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
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Manage Trips</h1>
          {!showForm && !editingId && (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              <Plus className="h-4 w-4" />
              Add Trip
            </button>
          )}
        </div>

        {(showForm || editingId) && (
          <div className="rounded-lg border border-border bg-card p-6 mb-6">
            <h2 className="text-lg font-bold mb-4">{editingId ? "Edit Trip" : "Add New Trip"}</h2>
            <div className="space-y-4">
              <select
                value={formData.cityId || ""}
                onChange={(e) => setFormData({ ...formData, cityId: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select City</option>
                {cities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Trip Title"
                value={formData.title || ""}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="text"
                placeholder="Duration (e.g., 5 days)"
                value={formData.duration || ""}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <textarea
                placeholder="Description"
                value={formData.description || ""}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary min-h-20"
              />
              <input
                type="text"
                placeholder="Places (comma separated)"
                value={formData.places || ""}
                onChange={(e) => setFormData({ ...formData, places: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <div className="flex gap-2">
                <button
                  onClick={editingId ? handleUpdate : handleAdd}
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
                >
                  {editingId ? "Update" : "Add"}
                </button>
                <button
                  onClick={() => {
                    setShowForm(false)
                    setEditingId(null)
                    setFormData({})
                  }}
                  className="flex-1 px-4 py-2 border border-border rounded-lg font-medium hover:bg-secondary transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {trips.map((trip) => (
            <div key={trip.id} className="rounded-lg border border-border bg-card p-4 flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-bold text-lg">{trip.title}</h3>
                <p className="text-sm text-muted-foreground">{trip.duration}</p>
                <p className="text-sm mt-2">{trip.description}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(trip)} className="p-2 rounded-lg hover:bg-secondary transition-colors">
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(trip.id)}
                  className="p-2 rounded-lg hover:bg-destructive/10 transition-colors text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

export default AdminTrips
