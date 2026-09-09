import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function GovernmentDashboard() {
  const [assignments, setAssignments] = useState([]);
  const [totalProblems, setTotalProblems] = useState(0);

  useEffect(() => {
    fetchGovernmentData();
  }, []);

  const fetchGovernmentData = async () => {
    const { count } = await supabase.from('problems').select('*', { count: 'exact', head: true });
    setTotalProblems(count || 0);

    const { data } = await supabase.from('assignments')
      .select('*, problems(*), organizations(*)')
      .order('created_at', { ascending: false });
    setAssignments(data || []);
  };

  return (
    <div>
      <div className="card">
        <h2>State Oversight Console — Government Dashboard</h2>
        <p style={{ color: '#6B675E', fontSize: '0.85rem' }}>Monitor inter-institutional collaborations, industry acceptance, and milestone reasons.</p>
        <h3 style={{ marginTop: '0.8rem', color: '#0C2619' }}>Total Statewide Problems Reported: {totalProblems}</h3>
      </div>

      <div className="card">
        <h3>Live Collaboration & Industry Acceptance Audit Feed</h3>
        <p style={{ color: '#6B675E', fontSize: '0.8rem', marginBottom: '1rem' }}>Real-time overview of who is solving which societal problem statement.</p>

        {assignments.length === 0 ? <p style={{ color: '#9CA3AF' }}>No institutional collaborations recorded yet.</p> : (
          assignments.map(a => (
            <div key={a.id} style={{ borderBottom: '1px solid #E6E1D5', padding: '1rem 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className={'badge badge-' + a.status}>{a.status.toUpperCase()}</span>
                <span style={{ fontSize: '0.8rem', color: '#6B675E' }}>Assigned Institution: <strong>{a.organizations?.name || 'Birsa Agricultural University'}</strong></span>
              </div>
              <h4 style={{ margin: '0.5rem 0' }}>{a.problems?.title}</h4>
              <p style={{ fontSize: '0.85rem', color: '#6B675E' }}><strong>Milestone Reason / Execution Notes:</strong> {a.notes || 'No reason specified yet.'}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}