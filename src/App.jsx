import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import AdminPage from './pages/AdminPage'
import GamesPage from './pages/GamesPage'
import LoginPage from './pages/LoginPage'
import ProtectedRoute from './components/ProtectedRoute'
import GameDetail from './pages/GameDetail'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <AdminPage />
              </ProtectedRoute>
            } 
          />
          <Route path="/games" element={<GamesPage />} />
          <Route path="/games/:id" element={<GameDetail />} />
          <Route path="/" element={<GamesPage />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App