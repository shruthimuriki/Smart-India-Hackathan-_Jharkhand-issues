import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, LogIn } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isOrganization = user?.role === 'organization';
  const isGovernment = user?.role === 'government';
  const isCitizen = !isOrganization && !isGovernment;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header style={{ background: '#FFFFFF', borderBottom: '1px solid #E6E1D5', position: 'sticky', top: 0, zIndex: 1000 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0.8rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* LOGO */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <div>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0C2619', letterSpacing: '1px', fontFamily: 'serif' }}>
              P<span style={{ color: '#E03E1A' }}>Λ</span>L<span style={{ color: '#E03E1A' }}>Λ</span>SH
            </div>
            <div style={{ fontSize: '0.65rem', color: '#6B675E', fontWeight: 700, letterSpacing: '0.5px' }}>
              — FROM CHALLENGES TO CHANGE —
            </div>
          </div>
        </Link>

        {/* NAVIGATION LINKS */}
        <nav style={{ display: 'flex', gap: '1.8rem', alignItems: 'center', fontWeight: 600, fontSize: '0.9rem' }}>
          <Link to="/" style={{ color: location.pathname === '/' ? '#E03E1A' : '#0C2619', textDecoration: 'none' }}>
            Home
          </Link>
          <Link to="/post-problem" style={{ color: location.pathname === '/post-problem' ? '#E03E1A' : '#0C2619', textDecoration: 'none' }}>
            Report
          </Link>
          <Link to="/explore" style={{ color: location.pathname === '/explore' ? '#E03E1A' : '#0C2619', textDecoration: 'none' }}>
            Explore
          </Link>

          {!isCitizen && (
            <>
              <Link to="/organization" style={{ color: location.pathname === '/organization' ? '#E03E1A' : '#0C2619', textDecoration: 'none' }}>
                Dashboard
              </Link>
              <Link to="/track" style={{ color: location.pathname === '/track' ? '#E03E1A' : '#0C2619', textDecoration: 'none' }}>
                Track
              </Link>
            </>
          )}
        </nav>

        {/* ACCOUNT STATUS & LOGIN / LOGOUT BUTTONS */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <div style={{ background: '#FAF8F5', border: '1px solid #E6E1D5', borderRadius: 20, padding: '0.3rem 0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <User size={16} color="#0C2619" />
            <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>{user?.email ? user.email.split('@')[0] : 'Guest'}</span>
            <span style={{ background: isOrganization ? '#FEF3C7' : isGovernment ? '#DCFCE7' : '#E0F2FE', color: isOrganization ? '#D97706' : isGovernment ? '#15803D' : '#0369A1', fontSize: '0.65rem', fontWeight: 800, padding: '0.15rem 0.4rem', borderRadius: 10, textTransform: 'uppercase' }}>
              {isOrganization ? 'ORGANIZATION' : isGovernment ? 'GOVERNMENT' : 'CITIZEN'}
            </span>
          </div>

          {/* ALWAYS ACCESSIBLE LOGIN / SWITCH ROLE BUTTON */}
          <Link to="/login" className="btn" style={{ background: '#0C2619', color: 'white', fontSize: '0.78rem', padding: '0.4rem 0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem', textDecoration: 'none' }}>
            <LogIn size={14} /> Switch / Sign In
          </Link>

          {user && (
            <button onClick={handleLogout} style={{ background: '#FEE2E2', border: '1px solid #FCA5A5', padding: '0.4rem 0.7rem', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#DC2626', fontWeight: 700, fontSize: '0.78rem' }} title="Log Out">
              <LogOut size={14} /> Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
}