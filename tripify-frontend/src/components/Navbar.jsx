import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Menu, X } from "lucide-react"

function Navbar({ links = [] }) {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const userData = localStorage.getItem("currentUser")
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    localStorage.removeItem("authToken")
    navigate("/auth/login")
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex items-center justify-between px-6 py-2">
        <div className="flex items-center gap-8">
          <a href="/" className="text-xl font-bold text-primary">
            <img src="../public/logo.png" width="70" />
          </a>
          <div className="hidden gap-6 md:flex">
            {links.map((link) => (
              <a key={link.href} href={link.href} className="text-sm font-medium transition-colors hover:text-primary">
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="hidden text-sm font-medium sm:inline">{user.name}</span>
              <button
                onClick={handleLogout}
                className="hidden sm:inline-flex px-3 py-2 text-sm font-medium border border-border rounded-lg hover:bg-secondary transition-colors bg-transparent"
              >
                Logout
              </button>
            </>
          ) : null}

          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden">
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-border bg-card md:hidden">
          <div className="flex flex-col gap-2 p-4">
            {links.map((link) => (
              <a key={link.href} href={link.href} className="rounded px-3 py-2 text-sm font-medium hover:bg-secondary">
                {link.label}
              </a>
            ))}
            {user && (
              <button
                onClick={handleLogout}
                className="w-full px-3 py-2 text-sm font-medium border border-border rounded-lg hover:bg-secondary transition-colors bg-primary"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
