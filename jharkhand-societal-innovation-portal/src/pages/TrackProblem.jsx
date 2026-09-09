import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Search, Building2, CheckCircle2, Clock } from 'lucide-react';

export default function TrackProblem() {
  const [searchParams] = useSearchParams();
  const [searchId, setSearchId] = useState(searchParams.get('id') || '');
  const [problem, setProblem] = useState(null);
  const [assignment, setAssignment] = useState(null);

  useEffect(() => {
    if (searchId) handleSearch();
  }, []);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!searchId.trim()) return;

    const { data: prob } = await supabase.from('problems').select('*').eq('problem_id', searchId.trim()).single();
    if (prob) {
      setProblem(prob);
      const { data: assign } = await supabase.from('assignments')
        .select('*, organizations(*)')
        .eq('problem_id', prob.id)
        .single();
      setAssignment(assign || null);
    } else {
      setProblem(null);
    }
  };

  const getProgressPercentage = (status) => {
    if (status === 'resolved') return 100;
    if (status === 'in_progress') return 60;
    return 10;
  };

  return (
    <div style={{ maxWidth: 850, margin: '0 auto' }}>
      <div className="card">
        <h2>PALASH Live Problem Tracker</h2>
        <p style={{ color: '#6B675E', fontSize: '0.85rem', marginBottom: '1rem' }}>Enter Problem ID to inspect assigned organization and execution milestones.</p>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem' }}>
          <input className="form-control" placeholder="e.g. JH-AGR-2026-000001" value={searchId} onChange={e => setSearchId(e.target.value)} />
          <button type="submit" className="btn btn-primary"><Search size={16}/> Track</button>
        </form>
      </div>

      {problem && (
        <div className="card">
          <span className={'badge badge-' + problem.status}>{problem.status.replace('_', ' ').toUpperCase()}</span>
          <h2 style={{ marginTop: '0.5rem' }}>{problem.title}</h2>
          <p style={{ color: '#6B675E', marginTop: '0.2rem' }}>ID: {problem.problem_id} | Domain: {problem.domain} | District: {problem.district}</p>

          <div style={{ marginTop: '1.2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700 }}>
              <span>Execution Progress</span>
              <span>{getProgressPercentage(problem.status)}%</span>
            </div>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: getProgressPercentage(problem.status) + '%' }}></div>
            </div>
          </div>

          {assignment ? (
            <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #E6E1D5', background: '#FAF8F5', padding: '1rem', borderRadius: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: '#0C2619', fontSize: '1rem' }}>
                <Building2 size={20} color="#E03E1A" />
                <span>Solving Organization / Partner:</span>
              </div>
              <h3 style={{ color: '#0C2619', marginTop: '0.3rem', fontSize: '1.2rem', fontWeight: 800 }}>
                {assignment.organizations?.name || 'Birsa Agricultural University'}
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#6B675E', marginBottom: '1rem' }}>
                District: {assignment.organizations?.district || problem.district}
              </p>
              
              <div style={{ background: '#FFFFFF', padding: '0.8rem', borderRadius: 6, border: '1px solid #E6E1D5' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#E03E1A', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckCircle2 size={16}/> Completed Milestones & Technical Reasons:
                </div>
                <p style={{ fontSize: '0.85rem', color: '#141815', marginTop: '0.4rem' }}>
                  {assignment.notes || 'Project initialized. Research team assigned to problem statement.'}
                </p>
              </div>
            </div>
          ) : (
            <div style={{ marginTop: '1rem', padding: '0.8rem', background: '#FEF3C7', borderRadius: 8, fontSize: '0.85rem', color: '#B45309' }}>
              <Clock size={14} inline /> Problem statement is currently listed on the portal awaiting institution claim.
            </div>
          )}
        </div>
      )}
    </div>
  );
}