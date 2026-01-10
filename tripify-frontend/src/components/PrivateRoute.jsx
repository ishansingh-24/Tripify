import { Navigate, Outlet } from "react-router-dom"

function PrivateRoute({ role }) {
  const currentUser = localStorage.getItem("currentUser")

  if (!currentUser) {
    return <Navigate to="/auth/login" replace />
  }

  const user = JSON.parse(currentUser)

  if (role && user.role !== role) {
    return <Navigate to={user.role === "admin" ? "/admin/dashboard" : "/customer/home"} replace />
  }

  return <Outlet />
}

export default PrivateRoute
