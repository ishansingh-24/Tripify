"use client"

import { useState, useEffect } from "react"
import Navbar from "../../components/Navbar"
import { Trash2, Edit2, Plus } from "lucide-react"
import { api } from "../../lib/api"

function AdminCities() {
  const [cities, setCities] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({})
  const [showForm, setShowForm] = useState(false)

  const loadCities = async () => {
    const data = await api.cities.list()
    setCities(data)
  }

  useEffect(() => {
    loadCities()
  }, [])

  const handleAdd = async () => {
    try {
      const newCity = await api.cities.create(formData)
      setCities((prev) => [...prev, newCity])
      setFormData({})
      setShowForm(false)
    } catch (err) {
      alert(err.message)
    }
  }

  const handleUpdate = async () => {
    try {
      const updatedCity = await api.cities.update(editingId, formData)
      setCities((prev) => prev.map((c) => (c.id === editingId ? updatedCity : c)))
      setEditingId(null)
      setFormData({})
    } catch (err) {
      alert(err.message)
    }
  }

  const handleDelete = async (id) => {
    try {
      await api.cities.remove(id)
      setCities((prev) => prev.filter((c) => c.id !== id))
    } catch (err) {
      alert(err.message)
    }
  }

  const handleEdit = (city) => {
    setEditingId(city.id)
    setFormData(city)
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
          <h1 className="text-3xl font-bold">Manage Cities</h1>
          {!showForm && !editingId && (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              <Plus className="h-4 w-4" />
              Add City
            </button>
          )}
        </div>

        {(showForm || editingId) && (
          <div className="rounded-lg border border-border bg-card p-6 mb-6">
            <h2 className="text-lg font-bold mb-4">{editingId ? "Edit City" : "Add New City"}</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="City Name"
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="text"
                placeholder="Country"
                value={formData.country || ""}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
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
                placeholder="Image path (optional)"
                value={formData.image || ""}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
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
          {cities.map((city) => (
            <div key={city.id} className="rounded-lg border border-border bg-card p-4 flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-bold text-lg">{city.name}</h3>
                <p className="text-sm text-muted-foreground">{city.country}</p>
                <p className="text-sm mt-2">{city.description}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(city)} className="p-2 rounded-lg hover:bg-secondary transition-colors">
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(city.id)}
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

export default AdminCities
