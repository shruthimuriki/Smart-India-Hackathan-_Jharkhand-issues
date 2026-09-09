import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Building2, Shield } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [activeRole, setActiveRole] = useState('citizen');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(email, password);
      if (activeRole === 'government') navigate('/government');
      else if (activeRole === 'organization') navigate('/organization');
      else navigate('/explore');
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 450, margin: '3rem auto' }}>
      <div className="card">
        <h2 style={{ textAlign: 'center', marginBottom: '0.3rem' }}>PALASH Login</h2>
        <p style={{ textAlign: 'center', color: '#6B675E', fontSize: '0.85rem', marginBottom: '1.5rem' }}>Select your portal role to sign in</p>

        <div className="role-tabs">
          <button type="button" className={'role-tab ' + (activeRole === 'citizen' ? 'active' : '')} onClick={() => setActiveRole('citizen')}>
            <User size={15} /> Citizen
          </button>
          <button type="button" className={'role-tab ' + (activeRole === 'organization' ? 'active' : '')} onClick={() => setActiveRole('organization')}>
            <Building2 size={15} /> Organization
          </button>
          <button type="button" className={'role-tab ' + (activeRole === 'government' ? 'active' : '')} onClick={() => setActiveRole('government')}>
            <Shield size={15} /> Government
          </button>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email Address</label>
            <input className="form-control" type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder={activeRole + '@palash.gov.in'} />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input className="form-control" type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }} disabled={loading}>
            {loading ? 'Authenticating...' : 'Sign In as ' + activeRole.toUpperCase()}
          </button>
        </form>

        <p style={{ marginTop: '1.2rem', textAlign: 'center', fontSize: '0.85rem', color: '#6B675E' }}>
          New to PALASH? <Link to="/register" style={{ color: '#E03E1A', fontWeight: 700 }}>Create an Account</Link>
        </p>
      </div>
    </div>
  );
}