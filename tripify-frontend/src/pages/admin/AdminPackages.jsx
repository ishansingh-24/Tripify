"use client"

import { useState, useEffect } from "react"
import Navbar from "../../components/Navbar"
import { mockPackages, mockTrips } from "../../data/mockData"
import { Trash2, Edit2, Plus } from "lucide-react"

function AdminPackages() {
  const [packages, setPackages] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({})
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    const storedPackages = JSON.parse(localStorage.getItem("packages") || "[]")
    setPackages(storedPackages.length > 0 ? storedPackages : mockPackages)
  }, [])

  const handleAdd = () => {
    const newPackage = {
      id: String(Date.now()),
      ...formData,
      price: Number.parseInt(formData.price),
      maxPeople: Number.parseInt(formData.maxPeople),
      includedServices: formData.includedServices?.split(",").map((s) => s.trim()) || [],
      places: formData.places?.split(",").map((p) => p.trim()) || [],
    }
    const updated = [...packages, newPackage]
    setPackages(updated)
    localStorage.setItem("packages", JSON.stringify(updated))
    setFormData({})
    setShowForm(false)
  }

  const handleUpdate = () => {
    const updated = packages.map((p) =>
      p.id === editingId
        ? {
            ...p,
            ...formData,
            price: Number.parseInt(formData.price),
            maxPeople: Number.parseInt(formData.maxPeople),
            includedServices: formData.includedServices?.split(",").map((s) => s.trim()) || [],
            places: formData.places?.split(",").map((p) => p.trim()) || [],
          }
        : p,
    )
    setPackages(updated)
    localStorage.setItem("packages", JSON.stringify(updated))
    setEditingId(null)
    setFormData({})
  }

  const handleDelete = (id) => {
    const updated = packages.filter((p) => p.id !== id)
    setPackages(updated)
    localStorage.setItem("packages", JSON.stringify(updated))
  }

  const handleEdit = (pkg) => {
    setEditingId(pkg.id)
    setFormData({
      ...pkg,
      includedServices: pkg.includedServices?.join(", ") || "",
      places: pkg.places?.join(", ") || "",
    })
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
          <h1 className="text-3xl font-bold">Manage Packages</h1>
          {!showForm && !editingId && (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              <Plus className="h-4 w-4" />
              Add Package
            </button>
          )}
        </div>

        {(showForm || editingId) && (
          <div className="rounded-lg border border-border bg-card p-6 mb-6">
            <h2 className="text-lg font-bold mb-4">{editingId ? "Edit Package" : "Add New Package"}</h2>
            <div className="space-y-4">
              <select
                value={formData.tripId || ""}
                onChange={(e) => setFormData({ ...formData, tripId: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select Trip</option>
                {mockTrips.map((trip) => (
                  <option key={trip.id} value={trip.id}>
                    {trip.title}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Package Name"
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="text"
                placeholder="Duration (e.g., 5 days / 4 nights)"
                value={formData.duration || ""}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="number"
                placeholder="Price"
                value={formData.price || ""}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="number"
                placeholder="Max People"
                value={formData.maxPeople || ""}
                onChange={(e) => setFormData({ ...formData, maxPeople: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="text"
                placeholder="Included Services (comma separated)"
                value={formData.includedServices || ""}
                onChange={(e) => setFormData({ ...formData, includedServices: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
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
          {packages.map((pkg) => (
            <div key={pkg.id} className="rounded-lg border border-border bg-card p-4 flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-bold text-lg">{pkg.name}</h3>
                <p className="text-sm text-muted-foreground">{pkg.duration}</p>
                <p className="text-sm font-bold text-primary mt-1">${pkg.price} per person</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(pkg)} className="p-2 rounded-lg hover:bg-secondary transition-colors">
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(pkg.id)}
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

export default AdminPackages
