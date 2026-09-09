import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export default function Explore() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);
  const [search, setSearch] = useState('');

  const isOrganization = profile?.role === 'organization';

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    const { data } = await supabase.from('problems').select('*').order('created_at', { ascending: false });
    setProblems(data || []);
  };

  const handleClaimFromExplore = async (prob) => {
    try {
      await supabase.from('problems').update({ status: 'in_progress' }).eq('id', prob.id);

      await supabase.from('assignments').insert({
        problem_id: prob.id,
        organization_id: profile?.organization_id || null,
        status: 'in_progress',
        notes: 'Claimed by ' + (profile?.name || 'Partner Organization') + ' from Explore Portal.'
      });

      await supabase.from('notifications').insert({
        problem_id: prob.id,
        type: 'problem_claimed',
        title: 'Problem Claimed from Explore Page',
        message: 'Problem [' + prob.problem_id + '] was claimed by ' + (profile?.name || 'Organization') + '.'
      });

      navigate('/solution-tracker?problem_id=' + prob.id);
    } catch (err) {
      alert(err.message || 'Failed to claim problem statement.');
    }
  };

  const filtered = problems.filter(p => p.title.toLowerCase().includes(search.toLowerCase()) || p.domain.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="card">
        <h2>Explore Reported Public Issues</h2>
        <p style={{ color: '#6B675E', fontSize: '0.85rem', marginBottom: '1rem' }}>Browse all citizen-reported challenges across Jharkhand.</p>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input className="form-control" placeholder="Search by domain or keyword..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="grid-2">
        {filtered.map(p => (
          <div key={p.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className={'badge badge-' + p.status}>{p.status.replace('_', ' ').toUpperCase()}</span>
                <span className="badge badge-citizen">{p.domain}</span>
              </div>
              <h3 style={{ marginTop: '0.8rem' }}>{p.title}</h3>
              <p style={{ fontSize: '0.85rem', color: '#6B675E', margin: '0.5rem 0' }}>{p.description}</p>
              <p style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>Location: {p.location_text}, {p.district} | ID: {p.problem_id}</p>
            </div>

            {isOrganization && p.status === 'available' && (
              <button onClick={() => handleClaimFromExplore(p)} className="btn btn-orange" style={{ width: '100%', justifyContent: 'center', marginTop: '1rem', fontSize: '0.85rem' }}>
                I want to solve this problem <ArrowRight size={16}/>
              </button>
            )}

            {p.status === 'in_progress' && (
              <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: '#1E40AF', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}>
                <CheckCircle2 size={16}/> Solution Currently Under Development
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}