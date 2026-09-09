import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, FileText, CheckCircle2, Users, Lightbulb } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { profile } = useAuth();
  const canReport = profile?.role === 'citizen' || !profile;

  const [stats, setStats] = useState({ reported: 0, progress: 0, orgs: 0, resolved: 0 });

  useEffect(() => {
    fetchPortalStats();
  }, []);

  const fetchPortalStats = async () => {
    try {
      const { count: reported } = await supabase.from('problems').select('*', { count: 'exact', head: true });
      const { count: progress } = await supabase.from('problems').select('*', { count: 'exact', head: true }).eq('status', 'in_progress');
      const { count: orgs } = await supabase.from('organizations').select('*', { count: 'exact', head: true });
      const { count: resolved } = await supabase.from('problems').select('*', { count: 'exact', head: true }).eq('status', 'resolved');

      setStats({
        reported: reported || 0,
        progress: progress || 0,
        orgs: orgs || 0,
        resolved: resolved || 0
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <div style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #FAF8F5 100%)', border: '1px solid #E6E1D5', borderRadius: 16, padding: '4rem 2.5rem', textAlign: 'center', marginBottom: '2.5rem' }}>
        <span style={{ fontSize: '0.8rem', fontWeight: 800, letterSpacing: '1.5px', color: '#E03E1A', textTransform: 'uppercase' }}>A STRONGER JHARKHAND TOGETHER</span>
        <h1 style={{ fontSize: '3.2rem', fontWeight: 800, margin: '1rem 0', color: '#141815', lineHeight: 1.15 }}>
          Local Challenges.<br/> Real Solutions.<br/>
          <span style={{ color: '#E03E1A' }}>A Brighter Tomorrow.</span>
        </h1>
        <p style={{ fontSize: '1.1rem', color: '#6B675E', maxWidth: 720, margin: '0 auto 2.5rem' }}>
          PALASH connects citizens, institutions, industry, and government to identify, prioritize, and solve real problems of Jharkhand.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          {canReport && (
            <Link to="/post-problem" className="btn btn-orange" style={{ padding: '0.85rem 1.8rem', fontSize: '1rem' }}>
              Report a Problem <ArrowRight size={18}/>
            </Link>
          )}
          <Link to="/explore" className="btn btn-outline" style={{ padding: '0.85rem 1.8rem', fontSize: '1rem' }}>
            Explore Solutions
          </Link>
        </div>
      </div>

      <div className="grid-4" style={{ marginBottom: '2.5rem' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <h2 style={{ color: '#0C2619', fontSize: '2rem', fontWeight: 800 }}>{stats.reported}</h2>
          <p style={{ color: '#6B675E', fontSize: '0.85rem', fontWeight: 600 }}>Problems Reported</p>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <h2 style={{ color: '#E03E1A', fontSize: '2rem', fontWeight: 800 }}>{stats.progress}</h2>
          <p style={{ color: '#6B675E', fontSize: '0.85rem', fontWeight: 600 }}>Solutions in Progress</p>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <h2 style={{ color: '#0C2619', fontSize: '2rem', fontWeight: 800 }}>{stats.orgs}</h2>
          <p style={{ color: '#6B675E', fontSize: '0.85rem', fontWeight: 600 }}>Institutions Onboarded</p>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <h2 style={{ color: '#15803D', fontSize: '2rem', fontWeight: 800 }}>{stats.resolved}</h2>
          <p style={{ color: '#6B675E', fontSize: '0.85rem', fontWeight: 600 }}>Resolved Issues</p>
        </div>
      </div>

      <div className="grid-4">
        <div className="card">
          <FileText size={32} color="#E03E1A" style={{ marginBottom: '0.8rem' }} />
          <h3>Report</h3>
          <p style={{ fontSize: '0.85rem', color: '#6B675E', marginTop: '0.4rem' }}>Raise a problem directly from your community.</p>
        </div>
        <div className="card">
          <Lightbulb size={32} color="#0C2619" style={{ marginBottom: '0.8rem' }} />
          <h3>Assess</h3>
          <p style={{ fontSize: '0.85rem', color: '#6B675E', marginTop: '0.4rem' }}>Dynamic domain classification and impact scoring.</p>
        </div>
        <div className="card">
          <Users size={32} color="#E03E1A" style={{ marginBottom: '0.8rem' }} />
          <h3>Collaborate</h3>
          <p style={{ fontSize: '0.85rem', color: '#6B675E', marginTop: '0.4rem' }}>Connect universities and labs with stakeholders.</p>
        </div>
        <div className="card">
          <CheckCircle2 size={32} color="#15803D" style={{ marginBottom: '0.8rem' }} />
          <h3>Solve</h3>
          <p style={{ fontSize: '0.85rem', color: '#6B675E', marginTop: '0.4rem' }}>Track progress from creation to complete resolution.</p>
        </div>
      </div>
    </div>
  );
}