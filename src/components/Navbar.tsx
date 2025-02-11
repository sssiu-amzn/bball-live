import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="bg-primary text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">Sports App</Link>
        <div className="space-x-4">
          <Link to="/games" className="hover:text-gray-300">Games</Link>
          <Link
            to="/signup"
            className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
          >
            Sign In
          </Link>
        </div>
      </div>
    </nav>
  )
}