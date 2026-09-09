import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Shield, CheckCircle, Clock, Building2, AlertTriangle, Eye, X } from 'lucide-react';

export default function GovernmentDashboard() {
  const [problems, setProblems] = useState([]);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [assignmentInfo, setAssignmentInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGovernmentData();
  }, []);

  const fetchGovernmentData = async () => {
    setLoading(true);
    // Fetch problems sorted by highest severity first
    const { data } = await supabase
      .from('problems')
      .select('*')
      .order('severity_score', { ascending: false });

    setProblems(data || []);
    setLoading(false);
  };

  const handleOpenProgressModal = async (prob) => {
    setSelectedProblem(prob);
    setAssignmentInfo(null);

    // Fetch assignment details and organization handling this problem
    const { data } = await supabase
      .from('assignments')
      .select('*, organization:organizations(*)')
      .eq('problem_id', prob.id)
      .maybeSingle();

    setAssignmentInfo(data || null);
  };

  return (
    <div style={{ maxWidth: 1050, margin: '0 auto' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2>Government Oversight Dashboard</h2>
        <p style={{ color: '#6B675E', fontSize: '0.85rem' }}>
          State-level view of community problems prioritized by Severity Meter score. Click any issue to view live solution progress and handling organization details.
        </p>
      </div>

      {loading ? (
        <p>Loading state metrics...</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {problems.map(prob => {
            const severity = prob.severity_score || 25;
            const duplicates = prob.duplicate_count || 1;

            return (
              <div key={prob.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderLeft: `6px solid ${severity > 50 ? '#DC2626' : '#0C2619'}` }}>
                <div style={{ flex: 1, minWidth: 280 }}>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.3rem' }}>
                    <span style={{ background: '#0C2619', color: 'white', padding: '0.2rem 0.5rem', borderRadius: 4, fontSize: '0.75rem', fontWeight: 700 }}>
                      ID: {prob.problem_id}
                    </span>
                    <span className={`badge ${prob.progress_status === 'resolved' ? 'badge-resolved' : 'badge-progress'}`}>
                      {prob.progress_status || 'Pending'}
                    </span>
                  </div>
                  <h3 style={{ margin: '0.2rem 0' }}>{prob.title}</h3>
                  <p style={{ fontSize: '0.82rem', color: '#6B675E', margin: 0 }}>District: {prob.district} | Domain: {prob.domain}</p>
                </div>

                {/* SEVERITY METER DISPLAY */}
                <div style={{ minWidth: 150 }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: severity > 50 ? '#DC2626' : '#0C2619' }}>
                    SEVERITY: {severity}% ({duplicates} reports)
                  </div>
                  <div style={{ width: '100%', height: 6, background: '#E6E1D5', borderRadius: 3, marginTop: '0.2rem', overflow: 'hidden' }}>
                    <div style={{ width: `${severity}%`, height: '100%', background: severity > 50 ? '#DC2626' : '#E03E1A' }} />
                  </div>
                </div>

                <button 
                  onClick={() => handleOpenProgressModal(prob)} 
                  className="btn btn-orange" 
                  style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <Eye size={16} /> View Progress & Org
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL FOR GOVERNMENT DETAILED PROGRESS VIEW */}
      {selectedProblem && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: 'white', borderRadius: 16, width: '100%', maxWidth: 600, padding: '1.8rem', boxShadow: '0 20px 40px rgba(0,0,0,0.3)', position: 'relative' }}>
            <X size={22} style={{ position: 'absolute', top: 20, right: 20, cursor: 'pointer' }} onClick={() => setSelectedProblem(null)} />

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#E03E1A', fontWeight: 700, marginBottom: '0.5rem' }}>
              <Shield size={20} /> Solution Progress Oversight
            </div>

            <h2 style={{ marginBottom: '0.3rem' }}>{selectedProblem.title}</h2>
            <p style={{ color: '#6B675E', fontSize: '0.85rem', marginBottom: '1.2rem' }}>
              Problem ID: <strong>{selectedProblem.problem_id}</strong>
            </p>

            <div style={{ background: '#FAF8F5', padding: '1rem', borderRadius: 8, border: '1px solid #E6E1D5', marginBottom: '1.2rem' }}>
              <p style={{ fontSize: '0.88rem', margin: 0 }}><strong>Description:</strong> {selectedProblem.description}</p>
            </div>

            {/* ORGANIZATION & PROGRESS TRACKING DETAILS */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.9rem' }}>
                <Building2 size={18} color="#0C2619" />
                <span><strong>Assigned Organization:</strong> {assignmentInfo?.organization?.name || 'Automated Processing queued...'}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.9rem' }}>
                <Clock size={18} color="#E03E1A" />
                <span><strong>Current Execution Status:</strong> <span style={{ textTransform: 'uppercase', fontWeight: 700 }}>{assignmentInfo?.status || selectedProblem.progress_status || 'Pending'}</span></span>
              </div>

              <div style={{ marginTop: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                  <span>Solution Completion Progress</span>
                  <span>{assignmentInfo?.progress_percentage || (selectedProblem.progress_status === 'resolved' ? 100 : 25)}%</span>
                </div>
                <div style={{ width: '100%', height: 10, background: '#E6E1D5', borderRadius: 5, overflow: 'hidden' }}>
                  <div style={{ width: `${assignmentInfo?.progress_percentage || (selectedProblem.progress_status === 'resolved' ? 100 : 25)}%`, height: '100%', background: '#15803D' }} />
                </div>
              </div>
            </div>

            <button onClick={() => setSelectedProblem(null)} className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem', justifyContent: 'center' }}>
              Close Oversight View
            </button>
          </div>
        </div>
      )}
    </div>
  );
}