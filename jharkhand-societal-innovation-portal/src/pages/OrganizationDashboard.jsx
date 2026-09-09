import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Building2, AlertTriangle, RefreshCw, Users, Send, CheckCircle2, X } from 'lucide-react';

export default function OrganizationDashboard() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [actionMessage, setActionMessage] = useState(null);

  // Collaboration State
  const [selectedProbForCollab, setSelectedProbForCollab] = useState(null);
  const [collabTargetOrg, setCollabTargetOrg] = useState('');
  const [collabNotes, setCollabNotes] = useState('');
  const [collabSuccess, setCollabSuccess] = useState(false);

  useEffect(() => {
    fetchAssignedProblems();
  }, []);

  const fetchAssignedProblems = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('assignments')
        .select('*, problem:problems(*)');

      if (error) throw error;
      setAssignments(data || []);
    } catch (err) {
      console.error('Error fetching assignments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (assignmentId, problemId, newStatus, newPercentage) => {
    setUpdatingId(assignmentId);
    setActionMessage(null);

    try {
      // 1. Update assignment record
      const { error: assignErr } = await supabase
        .from('assignments')
        .update({ 
          status: newStatus, 
          progress_percentage: newPercentage, 
          last_updated: new Date().toISOString() 
        })
        .eq('id', assignmentId);

      if (assignErr) throw assignErr;

      // 2. Sync with parent problem status if problemId exists
      if (problemId) {
        await supabase
          .from('problems')
          .update({ 
            status: 'assigned', 
            progress_status: newStatus 
          })
          .eq('id', problemId);
      }

      // Optimistic state update so the UI responds immediately
      setAssignments(prev =>
        prev.map(item =>
          item.id === assignmentId
            ? { ...item, status: newStatus, progress_percentage: newPercentage }
            : item
        )
      );

      setActionMessage('Execution state updated successfully!');
      setTimeout(() => setActionMessage(null), 3000);
    } catch (err) {
      console.error('Failed to update execution status:', err);
      alert('Failed to update execution state. Please verify your Supabase database connections.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleSendCollaborationRequest = async (e) => {
    e.preventDefault();
    if (!selectedProbForCollab || !collabTargetOrg) return;

    try {
      const { error } = await supabase.from('collaborations').insert({
        problem_id: selectedProbForCollab.problem?.id || selectedProbForCollab.problem_id,
        requesting_org_id: selectedProbForCollab.organization_id || null,
        target_org_name: collabTargetOrg,
        notes: collabNotes,
        status: 'pending'
      });

      if (error) throw error;

      setCollabSuccess(true);
      setTimeout(() => {
        setCollabSuccess(false);
        setSelectedProbForCollab(null);
        setCollabTargetOrg('');
        setCollabNotes('');
      }, 1800);
    } catch (err) {
      console.error('Collaboration request failed:', err);
      alert('Could not submit collaboration request. Ensure the collaborations table exists in Supabase.');
    }
  };

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h2>Organization Execution Dashboard</h2>
          <p style={{ color: '#6B675E', fontSize: '0.85rem' }}>
            Directly assigned problems automatically marked as <strong>Assigned</strong>. Request inter-institutional collaboration as needed.
          </p>
        </div>
        <button onClick={fetchAssignedProblems} className="btn" style={{ background: '#FAF8F5', border: '1px solid #E6E1D5' }}>
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {actionMessage && (
        <div className="alert alert-success" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle2 size={18} /> {actionMessage}
        </div>
      )}

      {loading ? (
        <p>Loading assigned tasks...</p>
      ) : assignments.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <Building2 size={40} color="#6B675E" />
          <p style={{ marginTop: '1rem' }}>No problems currently assigned.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          {assignments.map(item => {
            const prob = item.problem || {};
            const severity = prob.severity_score || 25;
            const duplicates = prob.duplicate_count || 1;

            return (
              <div key={item.id} className="card" style={{ borderLeft: `6px solid ${severity > 50 ? '#DC2626' : '#0C2619'}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.8rem' }}>
                  <div>
                    <span style={{ background: '#0C2619', color: 'white', padding: '0.2rem 0.6rem', borderRadius: 4, fontSize: '0.75rem', fontWeight: 700 }}>
                      ID: {prob.problem_id || 'N/A'}
                    </span>
                    <span className="badge badge-progress" style={{ marginLeft: '0.5rem', background: '#2563EB', color: 'white' }}>
                      ASSIGNED
                    </span>
                    <h3 style={{ marginTop: '0.4rem', marginBottom: '0.2rem' }}>{prob.title || 'Untitled Community Issue'}</h3>
                    <p style={{ fontSize: '0.85rem', color: '#6B675E' }}>{prob.district || 'General'} • {prob.domain || 'General'}</p>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: severity > 50 ? '#DC2626' : '#0C2619', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <AlertTriangle size={14} /> SEVERITY: {severity}%
                    </div>
                    <div style={{ width: 120, height: 8, background: '#E6E1D5', borderRadius: 4, overflow: 'hidden', marginTop: '0.3rem' }}>
                      <div style={{ width: `${severity}%`, height: '100%', background: severity > 50 ? '#DC2626' : '#E03E1A' }} />
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#6B675E', marginTop: '0.2rem' }}>{duplicates} Duplicate Report(s)</div>
                  </div>
                </div>

                <p style={{ fontSize: '0.9rem', marginBottom: '1.2rem', background: '#FAF8F5', padding: '0.8rem', borderRadius: 8 }}>
                  {prob.description || 'No detailed description provided.'}
                </p>

                {/* CONTROLS & COLLABORATION BUTTON */}
                <div style={{ background: '#FAF8F5', padding: '1rem', borderRadius: 8, border: '1px solid #E6E1D5', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>Execution State:</label>
                    <span className={`badge ${item.status === 'resolved' ? 'badge-resolved' : 'badge-progress'}`} style={{ textTransform: 'uppercase', padding: '0.4rem 0.8rem' }}>
                      {item.status || 'assigned'} ({item.progress_percentage || 15}%)
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button 
                      onClick={() => setSelectedProbForCollab(item)}
                      className="btn" 
                      style={{ background: '#1E3A8A', color: 'white', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                    >
                      <Users size={15} /> Ask to Collaborate
                    </button>
                    <button 
                      onClick={() => handleStatusUpdate(item.id, prob.id, 'in_progress', 50)} 
                      disabled={updatingId === item.id} 
                      className="btn" 
                      style={{ background: '#0C2619', color: 'white', fontSize: '0.8rem' }}
                    >
                      {updatingId === item.id ? 'Updating...' : 'In Progress (50%)'}
                    </button>
                    <button 
                      onClick={() => handleStatusUpdate(item.id, prob.id, 'resolved', 100)} 
                      disabled={updatingId === item.id} 
                      className="btn btn-orange" 
                      style={{ fontSize: '0.8rem' }}
                    >
                      {updatingId === item.id ? 'Updating...' : 'Resolved (100%)'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* COLLABORATION REQUEST MODAL */}
      {selectedProbForCollab && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: 'white', borderRadius: 16, width: '100%', maxWidth: 520, padding: '1.8rem', boxShadow: '0 20px 40px rgba(0,0,0,0.3)', position: 'relative' }}>
            <X size={20} style={{ position: 'absolute', top: 20, right: 20, cursor: 'pointer' }} onClick={() => setSelectedProbForCollab(null)} />

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1E3A8A', fontWeight: 700, marginBottom: '0.5rem' }}>
              <Users size={20} /> Request Institutional Collaboration
            </div>

            <h3 style={{ marginBottom: '0.3rem' }}>{selectedProbForCollab.problem?.title || 'Selected Community Issue'}</h3>
            <p style={{ color: '#6B675E', fontSize: '0.82rem', marginBottom: '1.2rem' }}>
              Problem ID: <strong>{selectedProbForCollab.problem?.problem_id || 'N/A'}</strong>
            </p>

            {collabSuccess ? (
              <div className="alert alert-success" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={18} /> Collaboration Request Sent Successfully!
              </div>
            ) : (
              <form onSubmit={handleSendCollaborationRequest}>
                <div className="form-group">
                  <label>Select Institute / Department to Collaborate With *</label>
                  <select 
                    className="form-control" 
                    required 
                    value={collabTargetOrg} 
                    onChange={e => setCollabTargetOrg(e.target.value)}
                  >
                    <option value="">-- Choose Partner Institute --</option>
                    <option value="BIT Mesra Innovation Cell">BIT Mesra Innovation Cell</option>
                    <option value="Jharkhand Road Development Corporation">Jharkhand Road Development Corporation</option>
                    <option value="Public Health Engineering Department (PHED)">Public Health Engineering Department (PHED)</option>
                    <option value="Ranchi Municipal Corporation">Ranchi Municipal Corporation</option>
                    <option value="NIT Jamshedpur Technical Cell">NIT Jamshedpur Technical Cell</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Collaboration Scope / Requirement Details *</label>
                  <textarea 
                    className="form-control" 
                    rows={3} 
                    required 
                    value={collabNotes} 
                    onChange={e => setCollabNotes(e.target.value)} 
                    placeholder="Specify machinery, manpower, or technical assistance required..."
                  />
                </div>

                <button type="submit" className="btn" style={{ width: '100%', background: '#1E3A8A', color: 'white', justifyContent: 'center', marginTop: '0.5rem' }}>
                  <Send size={16} /> Send Collaboration Request
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}