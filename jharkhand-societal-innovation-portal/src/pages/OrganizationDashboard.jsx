import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Building2, CheckCircle, Clock, AlertTriangle, RefreshCw } from 'lucide-react';

export default function OrganizationDashboard() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchAssignedProblems();
  }, []);

  const fetchAssignedProblems = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('assignments')
      .select('*, problem:problems(*)');
    setAssignments(data || []);
    setLoading(false);
  };

  const handleStatusUpdate = async (assignmentId, problemId, newStatus, newPercentage) => {
    setUpdatingId(assignmentId);
    
    // Update assignment record
    await supabase
      .from('assignments')
      .update({ status: newStatus, progress_percentage: newPercentage, last_updated: new Date() })
      .eq('id', assignmentId);

    // Sync with problem status
    await supabase
      .from('problems')
      .update({ progress_status: newStatus })
      .eq('id', problemId);

    await fetchAssignedProblems();
    setUpdatingId(null);
  };

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h2>Organization Execution Dashboard</h2>
          <p style={{ color: '#6B675E', fontSize: '0.85rem' }}>Manage assigned community challenges and update execution state in real-time.</p>
        </div>
        <button onClick={fetchAssignedProblems} className="btn" style={{ background: '#FAF8F5', border: '1px solid #E6E1D5' }}>
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {loading ? (
        <p>Loading assigned tasks...</p>
      ) : assignments.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <Building2 size={40} color="#6B675E" />
          <p style={{ marginTop: '1rem' }}>No problems assigned yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          {assignments.map(item => {
            const prob = item.problem || {};
            const severity = prob.severity_score || 25;
            const duplicates = prob.duplicate_count || 1;

            return (
              <div key={item.id} className="card" style={{ borderLeft: `6px solid ${severity > 50 ? '#DC2626' : '#E03E1A'}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.8rem' }}>
                  <div>
                    <span style={{ background: '#0C2619', color: 'white', padding: '0.2rem 0.6rem', borderRadius: 4, fontSize: '0.75rem', fontWeight: 700 }}>
                      ID: {prob.problem_id || 'N/A'}
                    </span>
                    <h3 style={{ marginTop: '0.4rem', marginBottom: '0.2rem' }}>{prob.title}</h3>
                    <p style={{ fontSize: '0.85rem', color: '#6B675E' }}>{prob.district} • {prob.domain}</p>
                  </div>

                  {/* SEVERITY METER */}
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: severity > 50 ? '#DC2626' : '#0C2619', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <AlertTriangle size={14} /> SEVERITY METER: {severity}%
                    </div>
                    <div style={{ width: 120, height: 8, background: '#E6E1D5', borderRadius: 4, overflow: 'hidden', marginTop: '0.3rem' }}>
                      <div style={{ width: `${severity}%`, height: '100%', background: severity > 50 ? '#DC2626' : '#E03E1A' }} />
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#6B675E', marginTop: '0.2rem' }}>{duplicates} Duplicate Report(s)</div>
                  </div>
                </div>

                <p style={{ fontSize: '0.9rem', marginBottom: '1.2rem', background: '#FAF8F5', padding: '0.8rem', borderRadius: 8 }}>
                  {prob.description}
                </p>

                {/* EXECUTION STATE PROGRESS CONTROLS */}
                <div style={{ background: '#FAF8F5', padding: '1rem', borderRadius: 8, border: '1px solid #E6E1D5', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>Current Execution State:</label>
                    <span className={`badge ${item.status === 'resolved' ? 'badge-resolved' : 'badge-progress'}`} style={{ textTransform: 'uppercase', padding: '0.4rem 0.8rem' }}>
                      {item.status || 'pending'} ({item.progress_percentage || 0}%)
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                      onClick={() => handleStatusUpdate(item.id, prob.id, 'in_progress', 50)} 
                      disabled={updatingId === item.id} 
                      className="btn" 
                      style={{ background: '#0C2619', color: 'white', fontSize: '0.8rem' }}
                    >
                      Set In Progress (50%)
                    </button>
                    <button 
                      onClick={() => handleStatusUpdate(item.id, prob.id, 'resolved', 100)} 
                      disabled={updatingId === item.id} 
                      className="btn btn-orange" 
                      style={{ fontSize: '0.8rem' }}
                    >
                      Mark Resolved (100%)
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}