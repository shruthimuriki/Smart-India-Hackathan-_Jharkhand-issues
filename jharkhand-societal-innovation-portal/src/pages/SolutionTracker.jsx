import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Send, ArrowLeft, AlertCircle } from 'lucide-react';

export default function SolutionTracker() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const problemDbId = searchParams.get('problem_id');

  const [problem, setProblem] = useState(null);
  const [progress, setProgress] = useState(25);
  const [deadline, setDeadline] = useState('2026-12-31');
  const [milestoneReason, setMilestoneReason] = useState('');
  const [reasonError, setReasonError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (problemDbId) fetchTrackerDetails();
  }, [problemDbId]);

  const fetchTrackerDetails = async () => {
    const { data: prob } = await supabase.from('problems').select('*').eq('id', problemDbId).single();
    if (prob) setProblem(prob);
  };

  const handleUpdateMilestone = async (e) => {
    e.preventDefault();
    setReasonError(null);

    if (!milestoneReason.trim() || milestoneReason.trim().length < 20) {
      setReasonError('A valid and detailed reason (at least 20 characters) is strictly required to confirm and submit milestone progress.');
      return;
    }

    setLoading(true);

    try {
      const isComplete = Number(progress) >= 100;
      const newStatus = isComplete ? 'resolved' : 'in_progress';

      await supabase.from('problems').update({ status: newStatus }).eq('id', problem.id);

      await supabase.from('assignments').upsert({
        problem_id: problem.id,
        status: newStatus,
        target_deadline: deadline,
        notes: 'Milestone (' + progress + '%): ' + milestoneReason
      });

      await supabase.from('notifications').insert({
        problem_id: problem.id,
        type: 'solution_update',
        title: isComplete ? 'Solution Resolved!' : 'Milestone Confirmed (' + progress + '%)',
        message: 'Reason Provided: ' + milestoneReason
      });

      alert('Milestone verified and submitted successfully!');
      fetchTrackerDetails();
    } catch (err) {
      alert(err.message || 'Failed to update tracking details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 850, margin: '0 auto' }}>
      <button onClick={() => navigate('/organization')} className="btn btn-outline" style={{ marginBottom: '1rem' }}>
        <ArrowLeft size={16}/> Back to Collaboration Portal
      </button>

      {problem && (
        <div>
          <div className="card">
            <span className={'badge badge-' + problem.status}>{problem.status.toUpperCase()}</span>
            <h2 style={{ margin: '0.5rem 0' }}>{problem.title}</h2>
            <p style={{ color: '#6B675E', fontSize: '0.9rem' }}>ID: {problem.problem_id} | Domain: {problem.domain} | District: {problem.district}</p>
            <p style={{ marginTop: '0.8rem', fontSize: '0.95rem' }}>{problem.description}</p>
          </div>

          <div className="card">
            <h3>Milestone Verification & Solution Tracker Console</h3>
            <p style={{ color: '#6B675E', fontSize: '0.85rem', marginBottom: '1.5rem' }}>A proper technical explanation is required to confirm milestone progress.</p>

            {reasonError && (
              <div className="alert alert-danger" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <AlertCircle size={18}/> {reasonError}
              </div>
            )}

            <form onSubmit={handleUpdateMilestone}>
              <div className="form-group">
                <label>Completion Percentage ({progress}%)</label>
                <input type="range" min="10" max="100" step="5" value={progress} onChange={e => setProgress(e.target.value)} style={{ width: '100%' }} />
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label>Target Execution Deadline *</label>
                  <input className="form-control" type="date" value={deadline} onChange={e => setDeadline(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label>Execution State</label>
                  <input className="form-control" value={progress >= 100 ? 'RESOLVED' : 'IN PROGRESS'} disabled />
                </div>
              </div>

              <div className="form-group">
                <label>Technical Confirmation Reason for Milestone Completion *</label>
                <textarea className="form-control" rows={4} required value={milestoneReason} onChange={e => setMilestoneReason(e.target.value)} placeholder="Provide detailed reasons explaining deliverables, field testing results, or research findings..." />
                <span style={{ fontSize: '0.75rem', color: '#6B675E' }}>Minimum 20 characters required for milestone validation.</span>
              </div>

              <button type="submit" className="btn btn-primary" disabled={loading}>
                <Send size={16}/> Confirm & Submit Milestone
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}