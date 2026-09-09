import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Search, Filter, ArrowRight, ExternalLink } from 'lucide-react';

export default function Explore() {
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('All');

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
          Browse transparent societal issues reported across Jharkhand. Click on any card to view detailed progress and handling status.
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

      {/* CLICKABLE PROBLEM CARDS GRID */}
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
                  border: '1px solid #E6E1D5' 
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
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

                <div style={{ borderTop: '1px solid #F3F4F6', pt: '0.8rem', paddingTop: '0.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>
                    Location: {prob.location_text || prob.district} | ID: {prob.problem_id}
                  </span>
                  <ExternalLink size={16} color="#E03E1A" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}