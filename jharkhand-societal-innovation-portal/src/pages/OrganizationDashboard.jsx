import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Clock, Check, X } from 'lucide-react';

export default function OrganizationDashboard() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [assignedInvites, setAssignedInvites] = useState([]);
  const [activeProjects, setActiveProjects] = useState([]);

  useEffect(() => {
    fetchAssignments();
  }, [profile]);

  const fetchAssignments = async () => {
    const { data: invites } = await supabase.from('assignments')
      .select('*, problems(*)')
      .eq('status', 'pending');
    setAssignedInvites(invites || []);

    const { data: active } = await supabase.from('problems')
      .select('*')
      .eq('status', 'in_progress');
    setActiveProjects(active || []);
  };

  const handleAcceptAssignment = async (invite) => {
    try {
      await supabase.from('assignments').update({ status: 'in_progress', notes: 'Assignment accepted by ' + (profile?.name || 'Institution') }).eq('id', invite.id);
      await supabase.from('problems').update({ status: 'in_progress' }).eq('id', invite.problem_id);

      await supabase.from('notifications').insert({
        problem_id: invite.problem_id,
        type: 'assignment_accepted',
        title: 'Assignment Accepted',
        message: 'Institution ' + (profile?.name || 'Partner') + ' accepted problem assignment.'
      });

      fetchAssignments();
      navigate('/solution-tracker?problem_id=' + invite.problem_id);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleIgnoreAssignment = async (invite) => {
    try {
      await supabase.from('assignments').update({ status: 'rejected', notes: 'Assignment ignored/declined.' }).eq('id', invite.id);
      
      await supabase.from('notifications').insert({
        problem_id: invite.problem_id,
        type: 'assignment_declined',
        title: 'Assignment Declined',
        message: 'Institution declined assignment request for problem ID ' + invite.problem_id
      });

      fetchAssignments();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <div className="card">
        <h2>PALASH Collaboration & Solution Portal</h2>
        <p style={{ color: '#6B675E', fontSize: '0.85rem' }}>Review automated problem assignments, accept/ignore tasks, and log milestone execution.</p>
      </div>

      <div className="grid-2">
        <div className="card">
          <h3>Automated Assignments ({assignedInvites.length})</h3>
          <p style={{ color: '#6B675E', fontSize: '0.8rem', marginBottom: '1rem' }}>Accept or ignore problem statements auto-assigned to your institution.</p>

          {assignedInvites.length === 0 ? <p style={{ fontSize: '0.85rem', color: '#9CA3AF' }}>No pending assignment invites.</p> : (
            assignedInvites.map(inv => (
              <div key={inv.id} style={{ border: '1px solid #E6E1D5', borderRadius: 8, padding: '1rem', marginBottom: '0.8rem', background: '#FEF3C7' }}>
                <span className="badge badge-available">PENDING ACCEPTANCE</span>
                <h4 style={{ margin: '0.4rem 0' }}>{inv.problems?.title}</h4>
                <p style={{ fontSize: '0.8rem', color: '#6B675E', marginBottom: '0.8rem' }}>{inv.problems?.description}</p>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => handleAcceptAssignment(inv)} className="btn btn-primary" style={{ flex: 1, justifyContent: 'center', fontSize: '0.8rem' }}>
                    <Check size={14}/> Accept & Solve
                  </button>
                  <button onClick={() => handleIgnoreAssignment(inv)} className="btn btn-danger" style={{ flex: 1, justifyContent: 'center', fontSize: '0.8rem' }}>
                    <X size={14}/> Ignore
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="card">
          <h3>Active In-Progress Solutions ({activeProjects.length})</h3>
          <p style={{ color: '#6B675E', fontSize: '0.8rem', marginBottom: '1rem' }}>Log milestone proof and manage deadlines.</p>

          {activeProjects.length === 0 ? <p style={{ fontSize: '0.85rem', color: '#9CA3AF' }}>No active solutions under development.</p> : (
            activeProjects.map(p => (
              <div key={p.id} style={{ border: '1px solid #E6E1D5', borderRadius: 8, padding: '1rem', marginBottom: '0.8rem', background: '#FAF8F5' }}>
                <span className="badge badge-in_progress">IN PROGRESS</span>
                <h4 style={{ margin: '0.4rem 0' }}>{p.title}</h4>
                <p style={{ fontSize: '0.8rem', color: '#6B675E', marginBottom: '0.8rem' }}>ID: {p.problem_id} | District: {p.district}</p>
                <button onClick={() => navigate('/solution-tracker?problem_id=' + p.id)} className="btn btn-orange" style={{ width: '100%', justifyContent: 'center', fontSize: '0.85rem' }}>
                  <Clock size={16}/> Open Solution Tracking Page
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}