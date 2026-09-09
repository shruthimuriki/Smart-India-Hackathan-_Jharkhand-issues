import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ChatBot from './components/ChatBot';
import Home from './pages/Home';
import PostProblem from './pages/PostProblem';
import Explore from './pages/Explore';
import TrackProblem from './pages/TrackProblem';
import OrganizationDashboard from './pages/OrganizationDashboard';
import GovernmentDashboard from './pages/GovernmentDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import { AuthProvider } from './context/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#FDFBF7' }}>
          <Navbar />
          
          <main style={{ flex: 1, padding: '2rem 1.5rem', maxWidth: 1200, margin: '0 auto', width: '100%' }}>
            <Routes>
              {/* Common Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/explore" element={<Explore />} />

              {/* Citizen Routes */}
              <Route path="/post-problem" element={<PostProblem />} />

              {/* Organization & Collaborate Routes */}
              <Route path="/organization" element={<OrganizationDashboard />} />
              <Route path="/collaborate" element={<OrganizationDashboard />} />

              {/* Track & Government Routes */}
              <Route path="/track" element={<TrackProblem />} />
              <Route path="/government" element={<GovernmentDashboard />} />

              {/* Fallback Catch-all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <ChatBot />
        </div>
      </Router>
    </AuthProvider>
  );
}