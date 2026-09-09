import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, LogOut, X, Check, UserCheck, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import PalashLogo from './PalashLogo';

export default function Navbar() {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();
  const [unreadNotifications, setUnreadNotifications] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const userRole = profile?.role || 'citizen';
  const canReport = userRole === 'citizen';
  const canCollaborate = userRole === 'organization' || userRole === 'citizen';
  const isGovernment = userRole === 'government';

  useEffect(() => {
    fetchUnseenNotifications();
    const channel = supabase.channel('realtime:nav_notifications')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications' }, () => fetchUnseenNotifications())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [profile]);

  const fetchUnseenNotifications = async () => {
    const { data } = await supabase.from('notifications')
      .select('*')
      .eq('is_read', false)
      .order('created_at', { ascending: false });
    if (data) setUnreadNotifications(data);
  };

  const dismissNotification = async (id) => {
    await supabase.from('notifications').update({ is_read: true }).eq('id', id);
    setUnreadNotifications(prev => prev.filter(n => n.id !== id));
  };

  const deleteSingleNotification = async (id) => {
    await supabase.from('notifications').delete().eq('id', id);
    setUnreadNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <nav style={{ background: '#FFFFFF', borderBottom: '1px solid #E6E1D5', padding: '0.8rem 2rem', position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        
        <Link to="/" style={{ textDecoration: 'none' }}>
          <PalashLogo height={46} />
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.8rem', fontWeight: 600, fontSize: '0.9rem' }}>
          <Link to="/" style={{ color: '#141815', textDecoration: 'none' }}>Home</Link>
          {canReport && <Link to="/post-problem" style={{ color: '#6B675E', textDecoration: 'none' }}>Report</Link>}
          <Link to="/explore" style={{ color: '#6B675E', textDecoration: 'none' }}>Explore</Link>
          {canCollaborate && <Link to="/organization" style={{ color: '#6B675E', textDecoration: 'none' }}>Collaborate</Link>}
          {isGovernment && <Link to="/government" style={{ color: '#6B675E', textDecoration: 'none' }}>Govt Oversight</Link>}
          <Link to="/track" style={{ color: '#6B675E', textDecoration: 'none' }}>Track</Link>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
          <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => setShowModal(true)}>
            <div style={{ background: '#FAF8F5', padding: '0.6rem', borderRadius: '50%', border: '1px solid #E6E1D5', display: 'flex' }}>
              <Bell size={20} color="#141815" />
            </div>
            {unreadNotifications.length > 0 && (
              <span style={{ position: 'absolute', top: -2, right: -2, background: '#E03E1A', color: 'white', borderRadius: '50%', padding: '2px 6px', fontSize: '0.65rem', fontWeight: 800 }}>
                {unreadNotifications.length}
              </span>
            )}
          </div>

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', background: '#FAF8F5', padding: '0.4rem 0.8rem', borderRadius: 8, border: '1px solid #E6E1D5' }}>
              <UserCheck size={18} color="#0C2619" />
              <div style={{ fontSize: '0.8rem' }}>
                <div style={{ fontWeight: 700, color: '#141815' }}>{profile?.name || 'Logged User'}</div>
                <span className={'badge badge-' + userRole}>{userRole.toUpperCase()}</span>
              </div>
              <button onClick={() => { logout(); navigate('/'); }} className="btn btn-outline" style={{ padding: '0.3rem 0.6rem', marginLeft: '0.4rem' }} title="Logout">
                <LogOut size={14}/>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Link to="/login" className="btn btn-primary">Login</Link>
              <Link to="/register" className="btn btn-outline">Sign Up</Link>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #E6E1D5', paddingBottom: '0.8rem' }}>
              <h3 style={{ fontSize: '1.1rem' }}>Notifications ({unreadNotifications.length})</h3>
              <X style={{ cursor: 'pointer' }} onClick={() => setShowModal(false)} />
            </div>

            {unreadNotifications.length === 0 ? (
              <p style={{ color: '#6B675E', textAlign: 'center', padding: '1.5rem 0' }}>No new notifications found.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {unreadNotifications.map(n => (
                  <div key={n.id} style={{ background: '#FEF3C7', padding: '0.8rem', borderRadius: 8, border: '1px solid #E6E1D5' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <strong style={{ fontSize: '0.9rem', color: '#141815' }}>{n.title}</strong>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button onClick={() => dismissNotification(n.id)} style={{ background: '#0C2619', color: 'white', border: 'none', padding: '0.2rem 0.5rem', borderRadius: 4, fontSize: '0.7rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                          <Check size={12}/> Dismiss
                        </button>
                        <button onClick={() => deleteSingleNotification(n.id)} style={{ background: '#DC2626', color: 'white', border: 'none', padding: '0.2rem 0.5rem', borderRadius: 4, fontSize: '0.7rem', cursor: 'pointer', display: 'flex', alignItems: 'center' }} title="Delete notification">
                          <Trash2 size={12}/>
                        </button>
                      </div>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: '#6B675E', marginTop: '0.3rem' }}>{n.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}