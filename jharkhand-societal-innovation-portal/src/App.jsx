import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatBot from './components/ChatBot';
import Home from './pages/Home';
import Explore from './pages/Explore';
import PostProblem from './pages/PostProblem';
import TrackProblem from './pages/TrackProblem';
import Login from './pages/Login';
import Register from './pages/Register';
import OrganizationDashboard from './pages/OrganizationDashboard';
import SolutionTracker from './pages/SolutionTracker';
import GovernmentDashboard from './pages/GovernmentDashboard';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app-container">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/post-problem" element={<PostProblem />} />
              <Route path="/track" element={<TrackProblem />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/organization" element={<OrganizationDashboard />} />
              <Route path="/solution-tracker" element={<SolutionTracker />} />
              <Route path="/government" element={<GovernmentDashboard />} />
            </Routes>
          </main>
          <Footer />
          <ChatBot />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}