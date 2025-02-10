import { Link } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'

export default function Navbar() {
  const { isAuthenticated, logout } = useAuthStore()

  return (
    <nav className="bg-primary text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">Sports App</Link>
        <div className="space-x-4">
          <Link to="/games" className="hover:text-gray-300">Games</Link>
          {isAuthenticated ? (
            <>
              <Link to="/admin" className="hover:text-gray-300">Admin</Link>
              <button 
                onClick={logout}
                className="hover:text-gray-300"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="hover:text-gray-300">Login</Link>
          )}
        </div>
      </div>
    </nav>
  )
}