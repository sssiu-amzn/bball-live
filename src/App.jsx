import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthenticator, Authenticator } from '@aws-amplify/ui-react';
import Layout from './components/Layout'
import AdminPage from './pages/AdminPage'
import GamesPage from './pages/GamesPage'
import GameDetailPage from './pages/GameDetailPage'
import SignUpPage from './pages/SignUpPage'

import { Amplify } from 'aws-amplify'
import { events } from 'aws-amplify/data'
import config from './amplify_outputs.json'

Amplify.configure(config)

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
          <Route path="/games/:id" element={<GameDetailPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/" element={<GamesPage />} />
        </Routes>
      </Layout>
    </Router>
    </Authenticator.Provider>
  )
}

export default App