import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthenticator, Authenticator } from '@aws-amplify/ui-react';
import Layout from './components/Layout'
import AdminPage from './pages/AdminPage'
import GamesPage from './pages/GamesPage'
import GameDetail from './pages/GameDetail'
import SignUpPage from './pages/SignUpPage'

function App() {
  const ProtectedRoute = ({ children }) => {
    const { user } = useAuthenticator((context) => [context.user]);
    
    if (!user) {
      return <Navigate to="/signup" />;
    }
    
    return children;
  };

  return (
    <Authenticator.Provider>
    <Router>
      <Layout>
        <Routes>
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
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/" element={<GamesPage />} />
        </Routes>
      </Layout>
    </Router>
    </Authenticator.Provider>
  )
}

export default App