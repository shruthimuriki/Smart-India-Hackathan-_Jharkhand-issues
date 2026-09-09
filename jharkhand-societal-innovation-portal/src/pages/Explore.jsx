import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Search, Filter, ExternalLink, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function Explore() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [claimingId, setClaimingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('All');

  const isOrganization = user?.role === 'organization';

  useEffect(() => {
    fetchExploreProblems();
  }, []);

  const fetchExploreProblems = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('problems')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProblems(data || []);
    } catch (err) {
      console.error('Error loading explore page problems:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClaimProblem = async (e, problem) => {
    e.stopPropagation(); // Prevent card navigation click
    setClaimingId(problem.id);

    try {
      // 1. Get or create current organization record
      let orgId = user?.org_id;

      if (!orgId) {
        const { data: orgData } = await supabase
          .from('organizations')
          .select('id')
          .limit(1)
          .maybeSingle();

        orgId = orgData?.id;
      }

      // 2. Insert Assignment record
      const { error: assignErr } = await supabase.from('assignments').insert({
        problem_id: problem.id,
        organization_id: orgId || null,
        status: 'assigned',
        progress_percentage: 10,
        notes: `Problem taken up by organization (${user?.email || 'Registered Institution'})`
      });

      if (assignErr) throw assignErr;

      // 3. Update Problem status to 'assigned'
      const { error: probErr } = await supabase
        .from('problems')
        .update({ 
          status: 'assigned', 
          progress_status: 'assigned' 
        })
        .eq('id', problem.id);

      if (probErr) throw probErr;

      // 4. Optimistic UI update
      setProblems(prev =>
        prev.map(p =>
          p.id === problem.id ? { ...p, status: 'assigned', progress_status: 'assigned' } : p
        )
      );

      alert(`Successfully taken up Problem [${problem.problem_id}]! It is now assigned to your organization.`);
    } catch (err) {
      console.error('Error claiming problem:', err);
      alert('Failed to claim problem. Please try again.');
    } finally {
      setClaimingId(null);
    }
  };

  const filteredProblems = problems.filter(prob => {
    const matchesSearch = 
      (prob.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (prob.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (prob.problem_id || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDomain = selectedDomain === 'All' || prob.domain === selectedDomain;

    return matchesSearch && matchesDomain;
  });

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2>Explore Community Challenges</h2>
        <p style={{ color: '#6B675E', fontSize: '0.9rem' }}>
          {isOrganization 
            ? 'Select any open issue below and click "I Want to Solve This Problem" to claim responsibility.' 
            : 'Browse community problems across Jharkhand. Click any card to track progress.'}
        </p>
      </div>

      {/* SEARCH AND FILTER BAR */}
      <div className="card" style={{ padding: '1rem', marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 240, display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#FAF8F5', border: '1px solid #E6E1D5', borderRadius: 8, padding: '0.5rem 0.8rem' }}>
          <Search size={18} color="#6B675E" />
          <input 
            type="text" 
            placeholder="Search by title, description, or ID..." 
            value={searchTerm} 
            onChange={e => setSearchTerm(e.target.value)}
            style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.9rem' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={18} color="#0C2619" />
          <select 
            value={selectedDomain} 
            onChange={e => setSelectedDomain(e.target.value)}
            className="form-control" 
            style={{ width: 'auto', padding: '0.5rem 0.8rem' }}
          >
            <option value="All">All Domains</option>
            <option value="Water Resources">Water Resources</option>
            <option value="Water & Sanitation">Water & Sanitation</option>
            <option value="Rural Livelihoods">Rural Livelihoods</option>
            <option value="Infrastructure & Roads">Infrastructure & Roads</option>
            <option value="Education & Literacy">Education & Literacy</option>
            <option value="Healthcare & Medical">Healthcare & Medical</option>
          </select>
        </div>
      </div>

      {/* PROBLEM CARDS GRID */}
      {loading ? (
        <p>Loading portal issues...</p>
      ) : filteredProblems.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: '#6B675E' }}>No matching problems found.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {filteredProblems.map(prob => {
            const isAssigned = prob.status === 'assigned' || prob.progress_status === 'assigned' || prob.progress_status === 'in_progress' || prob.progress_status === 'resolved';

            return (
              <div 
                key={prob.id} 
                onClick={() => navigate(`/track?id=${prob.problem_id}`)}
                className="card" 
                style={{ 
                  cursor: 'pointer', 
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justify: 'space-between',
                  border: isAssigned ? '1px solid #2563EB' : '1px solid #E6E1D5' 
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                    <span 
                      style={{ 
                        background: isAssigned ? '#2563EB' : '#D97706', 
                        color: 'white', 
                        padding: '0.2rem 0.6rem', 
                        borderRadius: 20, 
                        fontSize: '0.7rem', 
                        fontWeight: 700,
                        textTransform: 'uppercase' 
                      }}
                    >
                      {isAssigned ? 'ASSIGNED' : 'AVAILABLE'}
                    </span>
                    <span 
                      style={{ 
                        background: '#EFF6FF', 
                        color: '#1D4ED8', 
                        padding: '0.2rem 0.6rem', 
                        borderRadius: 20, 
                        fontSize: '0.7rem', 
                        fontWeight: 700 
                      }}
                    >
                      {(prob.domain || 'GENERAL').toUpperCase()}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.4rem', color: '#0C2619' }}>{prob.title}</h3>
                  <p style={{ fontSize: '0.85rem', color: '#6B675E', marginBottom: '1rem', lineClamp: 2, WebkitLineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {prob.description}
                  </p>
                </div>

                <div>
                  {/* ORGANIZATION ACTION BUTTON */}
                  {isOrganization && !isAssigned && (
                    <button 
                      onClick={(e) => handleClaimProblem(e, prob)} 
                      disabled={claimingId === prob.id}
                      className="btn btn-orange" 
                      style={{ width: '100%', marginBottom: '0.8rem', fontSize: '0.82rem', justifyContent: 'center' }}
                    >
                      <ShieldCheck size={16} /> 
                      {claimingId === prob.id ? 'Taking Up Problem...' : 'I Want to Solve This Problem'}
                    </button>
                  )}

                  {isAssigned && (
                    <div style={{ fontSize: '0.75rem', color: '#2563EB', fontWeight: 700, marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <CheckCircle2 size={14} /> Taken Up by Organization
                    </div>
                  )}

                  <div style={{ borderTop: '1px solid #F3F4F6', paddingTop: '0.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>
                      Location: {prob.location_text || prob.district} | ID: {prob.problem_id}
                    </span>
                    <ExternalLink size={16} color="#E03E1A" />
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