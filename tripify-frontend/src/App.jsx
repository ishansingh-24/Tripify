import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
// import { ThemeProvider } from "./context/ThemeContext"
import LoginPage from "./pages/auth/LoginPage"
import RegisterPage from "./pages/auth/RegisterPage"
import CustomerHome from "./pages/customer/CustomerHome"
import CustomerDashboard from "./pages/customer/CustomerDashboard"
import CustomerTrips from "./pages/customer/CustomerTrips"
import CustomerPackages from "./pages/customer/CustomerPackages"
import CustomerProfile from "./pages/customer/CustomerProfile"
import AdminDashboard from "./pages/admin/AdminDashboard"
import AdminCities from "./pages/admin/AdminCities"
import AdminTrips from "./pages/admin/AdminTrips"
import AdminPackages from "./pages/admin/AdminPackages"
import AdminBookings from "./pages/admin/AdminBookings"
import PrivateRoute from "./components/PrivateRoute"

function App() {
  return (
    // <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/register" element={<RegisterPage />} />

          {/* Customer Routes */}
          <Route element={<PrivateRoute role="customer" />}>
            <Route path="/customer/home" element={<CustomerHome />} />
            <Route path="/customer/dashboard" element={<CustomerDashboard />} />
            <Route path="/customer/trips/:cityId" element={<CustomerTrips />} />
            <Route path="/customer/packages/:tripId" element={<CustomerPackages />} />
            <Route path="/customer/profile" element={<CustomerProfile />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<PrivateRoute role="admin" />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/cities" element={<AdminCities />} />
            <Route path="/admin/trips" element={<AdminTrips />} />
            <Route path="/admin/packages" element={<AdminPackages />} />
            <Route path="/admin/bookings" element={<AdminBookings />} />
          </Route>

          <Route path="/" element={<Navigate to="/auth/login" replace />} />
        </Routes>
      </Router>
    // </ThemeProvider>
  )
}

export default App
