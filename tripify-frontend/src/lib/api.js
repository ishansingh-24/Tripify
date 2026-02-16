const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(path, options = {}) {
  const token = localStorage.getItem("authToken");
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (response.status === 204) {
    return null;
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

export const api = {
  auth: {
    login: (payload) => request("/auth/login", { method: "POST", body: JSON.stringify(payload) }),
    register: (payload) => request("/auth/register", { method: "POST", body: JSON.stringify(payload) }),
    me: () => request("/auth/me"),
  },
  users: {
    updateMe: (payload) => request("/users/me", { method: "PUT", body: JSON.stringify(payload) }),
  },
  cities: {
    list: () => request("/cities"),
    get: (cityId) => request(`/cities/${cityId}`),
    create: (payload) => request("/cities", { method: "POST", body: JSON.stringify(payload) }),
    update: (cityId, payload) => request(`/cities/${cityId}`, { method: "PUT", body: JSON.stringify(payload) }),
    remove: (cityId) => request(`/cities/${cityId}`, { method: "DELETE" }),
  },
  trips: {
    list: (cityId) => request(`/trips${cityId ? `?cityId=${encodeURIComponent(cityId)}` : ""}`),
    get: (tripId) => request(`/trips/${tripId}`),
    create: (payload) => request("/trips", { method: "POST", body: JSON.stringify(payload) }),
    update: (tripId, payload) => request(`/trips/${tripId}`, { method: "PUT", body: JSON.stringify(payload) }),
    remove: (tripId) => request(`/trips/${tripId}`, { method: "DELETE" }),
  },
  packages: {
    list: (tripId) => request(`/packages${tripId ? `?tripId=${encodeURIComponent(tripId)}` : ""}`),
    get: (packageId) => request(`/packages/${packageId}`),
    create: (payload) => request("/packages", { method: "POST", body: JSON.stringify(payload) }),
    update: (packageId, payload) => request(`/packages/${packageId}`, { method: "PUT", body: JSON.stringify(payload) }),
    remove: (packageId) => request(`/packages/${packageId}`, { method: "DELETE" }),
  },
  bookings: {
    list: (status) => request(`/bookings${status ? `?status=${encodeURIComponent(status)}` : ""}`),
    create: (payload) => request("/bookings", { method: "POST", body: JSON.stringify(payload) }),
    updateStatus: (bookingId, status) =>
      request(`/bookings/${bookingId}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),
  },
  admin: {
    dashboard: () => request("/admin/dashboard"),
  },
};
