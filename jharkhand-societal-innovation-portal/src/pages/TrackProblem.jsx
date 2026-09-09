import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Building2, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function TrackProblem() {
  const [searchParams] = useSearchParams();
  const problemIdParam = searchParams.get('id');
  const navigate = useNavigate();
  const { user } = useAuth();

  const [problem, setProblem] = useState(null);
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);

  const isOrganization = user?.role === 'organization';

  useEffect(() => {
    if (problemIdParam) {
      fetchProblemDetails();
    }
  }, [problemIdParam]);

  const fetchProblemDetails = async () => {
    setLoading(true);
    try {
      // 1. Fetch Problem Record
      const { data: probData, error: probErr } = await supabase
        .from('problems')
        .select('*')
        .eq('problem_id', problemIdParam)
        .maybeSingle();

      if (probErr) throw probErr;
      setProblem(probData);

      if (probData) {
        // 2. Fetch Active Assignment Record
        const { data: assignData } = await supabase
          .from('assignments')
          .select('*, organization:organizations(*)')
          .eq('problem_id', probData.id)
          .maybeSingle();

        setAssignment(assignData || null);
      }
    } catch (err) {
      console.error('Error fetching problem details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClaimProblem = async () => {
    if (!problem) return;
    setClaiming(true);

    try {
      let orgId = user?.org_id;
      if (!orgId) {
        const { data: orgData } = await supabase.from('organizations').select('id').limit(1).maybeSingle();
        orgId = orgData?.id;
      }

      // 1. Insert Assignment
      await supabase.from('assignments').insert({
        problem_id: problem.id,
        organization_id: orgId || null,
        status: 'assigned',
        progress_percentage: 25,
        notes: `Taken up by organization (${user?.email || 'Partner Institute'})`
      });

      // 2. Explicitly update problem table status to 'assigned'
      await supabase.from('problems').update({
        status: 'assigned',
        progress_status: 'assigned'
      }).eq('id', problem.id);

      // Refresh data
      await fetchProblemDetails();
      alert('Successfully taken up problem! Status updated to ASSIGNED.');
    } catch (err) {
      console.error('Error claiming problem:', err);
      alert('Failed to update status.');
    } finally {
      setClaiming(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '3rem', textAlign: 'center' }}>Loading problem details...</div>;
  }

  if (!problem) {
    return (
      <div style={{ maxWidth: 800, margin: '2rem auto' }} className="card">
        <h2>Problem Not Found</h2>
        <p style={{ color: '#6B675E' }}>No problem found matching ID: {problemIdParam}</p>
        <button onClick={() => navigate('/explore')} className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Back to Explore
        </button>
      </div>
    );
  }

  // FORCE DYNAMIC ASSIGNED STATUS CHECK
  const isTakenUp = 
    Boolean(assignment) || 
    problem.status === 'assigned' || 
    problem.progress_status === 'assigned' || 
    problem.progress_status === 'in_progress' || 
    problem.progress_status === 'resolved';

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <button 
        onClick={() => navigate('/explore')} 
        className="btn" 
        style={{ background: '#FAF8F5', border: '1px solid #E6E1D5', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
      >
        <ArrowLeft size={16} /> Back to Collaboration Portal
      </button>

      {/* TOP HEADER CARD WITH DYNAMIC BADGE */}
      <div className="card" style={{ marginBottom: '1.5rem', borderLeft: `6px solid ${isTakenUp ? '#2563EB' : '#D97706'}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
          
          {/* THE STATUS BADGE: SWITCHES DYNAMICALLY TO ASSIGNED */}
          <span 
            style={{ 
              background: isTakenUp ? '#2563EB' : '#D97706', 
              color: 'white', 
              padding: '0.35rem 0.9rem', 
              borderRadius: 20, 
              fontSize: '0.78rem', 
              fontWeight: 800,
              letterSpacing: '0.5px',
              textTransform: 'uppercase'
            }}
          >
            {isTakenUp ? 'ASSIGNED' : 'AVAILABLE'}
          </span>

          {isOrganization && !isTakenUp && (
            <button 
              onClick={handleClaimProblem} 
              disabled={claiming}
              className="btn btn-orange" 
              style={{ fontSize: '0.85rem' }}
            >
              <ShieldCheck size={16} /> {claiming ? 'Updating...' : 'I Want to Solve This Problem'}
            </button>
          )}
        </div>

        <h1 style={{ fontSize: '1.8rem', marginBottom: '0.4rem', color: '#0C2619' }}>{problem.title}</h1>
        <p style={{ fontSize: '0.85rem', color: '#6B675E', marginBottom: '1rem' }}>
          ID: <strong>{problem.problem_id}</strong> | Domain: <strong>{problem.domain}</strong> | District: <strong>{problem.district}</strong>
        </p>

        <p style={{ background: '#FAF8F5', padding: '1rem', borderRadius: 8, fontSize: '0.95rem', lineHeight: '1.5' }}>
          {problem.description}
        </p>
      </div>

      {/* MILESTONE CONSOLE */}
      <div className="card">
        <h3 style={{ marginBottom: '0.3rem' }}>Milestone Verification & Solution Tracker Console</h3>
        <p style={{ color: '#6B675E', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
          A proper technical explanation is required to confirm milestone progress.
        </p>

        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', fontWeight: 700, marginBottom: '0.4rem' }}>
            <span>Completion Percentage ({assignment?.progress_percentage || (isTakenUp ? 25 : 0)}%)</span>
          </div>
          <div style={{ width: '100%', height: 10, background: '#E6E1D5', borderRadius: 5, overflow: 'hidden' }}>
            <div 
              style={{ 
                width: `${assignment?.progress_percentage || (isTakenUp ? 25 : 0)}%`, 
                height: '100%', 
                background: '#2563EB',
                transition: 'width 0.3s ease' 
              }} 
            />
          </div>
        </div>

        <div className="grid-2">
          <div className="form-group">
            <label>Target Execution Deadline *</label>
            <input className="form-control" readOnly value="31-12-2026" />
          </div>

          <div className="form-group">
            <label>Execution State</label>
            <input 
              className="form-control" 
              readOnly 
              value={isTakenUp ? (assignment?.status || problem.progress_status || 'IN PROGRESS').toUpperCase() : 'PENDING ASSIGNMENT'} 
              style={{ fontWeight: 700, color: isTakenUp ? '#2563EB' : '#D97706' }}
            />
          </div>
        </div>

        {isTakenUp && (
          <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', padding: '0.8rem 1rem', borderRadius: 8, display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#1E40AF', marginTop: '1rem' }}>
            <Building2 size={18} />
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>
              Handling Organization: {assignment?.organization?.name || user?.email || 'Assigned Partner Organization'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}