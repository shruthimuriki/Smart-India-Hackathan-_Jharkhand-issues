import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { User, Building2, Shield } from 'lucide-react';

export default function Register() {
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const [activeRole, setActiveRole] = useState('citizen');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [orgId, setOrgId] = useState('');
  const [orgs, setOrgs] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.from('organizations').select('*').then(({ data }) => setOrgs(data || []));
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await signUp(email, password, name, activeRole, orgId || null);
      if (activeRole === 'government') navigate('/government');
      else if (activeRole === 'organization') navigate('/organization');
      else navigate('/explore');
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 480, margin: '2rem auto' }}>
      <div className="card">
        <h2 style={{ textAlign: 'center', marginBottom: '0.3rem' }}>Join PALASH Ecosystem</h2>
        <p style={{ textAlign: 'center', color: '#6B675E', fontSize: '0.85rem', marginBottom: '1.5rem' }}>Select user classification for account creation</p>

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

        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label>Full Name *</label>
            <input className="form-control" required value={name} onChange={e => setName(e.target.value)} placeholder="Full Name" />
          </div>

          <div className="form-group">
            <label>Email Address *</label>
            <input className="form-control" type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="email@domain.com" />
          </div>

          <div className="form-group">
            <label>Password *</label>
            <input className="form-control" type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
          </div>

          {activeRole === 'organization' && (
            <div className="form-group">
              <label>Select Associated University / Organization *</label>
              <select className="form-control" value={orgId} onChange={e => setOrgId(e.target.value)} required>
                <option value="">-- Select Registered Organization --</option>
                {orgs.map(o => <option key={o.id} value={o.id}>{o.name} ({o.district})</option>)}
              </select>
            </div>
          )}

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }} disabled={loading}>
            {loading ? 'Registering...' : 'Complete Registration'}
          </button>
        </form>

        <p style={{ marginTop: '1.2rem', textAlign: 'center', fontSize: '0.85rem', color: '#6B675E' }}>
          Already registered? <Link to="/login" style={{ color: '#E03E1A', fontWeight: 700 }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
}