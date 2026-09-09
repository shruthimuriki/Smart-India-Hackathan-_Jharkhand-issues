import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Building2, Shield, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div>
      {/* HERO SECTION WITH SCENIC BACKGROUND IMAGE */}
      <div 
        style={{ 
          position: 'relative', 
          width: '100%', 
          minHeight: '75vh', 
          borderRadius: '16px', 
          marginBottom: '2.5rem', 
          display: 'flex', 
          alignItems: 'center', 
          justify: 'center', 
          color: 'white',
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.65)), url("/hero-bg.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          boxShadow: '0 12px 30px rgba(0,0,0,0.2)',
          padding: '2rem 1rem'
        }}
      >
        {/* DARK BACKDROP CONTAINER FOR OPTIMAL TEXT READABILITY */}
        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: 820, background: 'rgba(12, 38, 25, 0.65)', backdropFilter: 'blur(6px)', padding: '2.5rem 2rem', borderRadius: 16, border: '1px solid rgba(255, 255, 255, 0.2)' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '1rem', color: '#FFFFFF', textShadow: '0 4px 12px rgba(0,0,0,0.8)' }}>
            PAL<span style={{ color: '#FF5733' }}>A</span>SH PORTAL JHARKHAND
          </h1>
          
          <p style={{ fontSize: '1.15rem', marginBottom: '2rem', color: '#F3F4F6', lineHeight: 1.6, textShadow: '0 2px 8px rgba(0,0,0,0.8)', fontWeight: 500 }}>
            A state-level collaborative platform empowering citizens, institutions, and government to resolve community challenges with AI auto-assignment and priority severity tracking.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/post-problem" className="btn btn-orange" style={{ padding: '0.9rem 2rem', fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 15px rgba(224, 62, 26, 0.4)' }}>
              Report Issue Anonymously <ArrowRight size={18} />
            </Link>
            <Link to="/explore" className="btn" style={{ background: '#FFFFFF', color: '#0C2619', padding: '0.9rem 2rem', fontSize: '1rem', fontWeight: 800 }}>
              Explore Portal Issues
            </Link>
          </div>
        </div>
      </div>

      {/* PORTAL FEATURES GRID */}
      <div className="grid-3" style={{ marginBottom: '3rem' }}>
        <div className="card" style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
          <AlertCircle size={40} color="#E03E1A" style={{ margin: '0 auto 1rem auto' }} />
          <h3 style={{ marginBottom: '0.5rem', color: '#0C2619' }}>Voice & Anonymous Reporting</h3>
          <p style={{ fontSize: '0.88rem', color: '#6B675E' }}>Report issues in Hindi or Bengali via voice input. No mandatory personal details or emails required.</p>
        </div>

        <div className="card" style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
          <Building2 size={40} color="#0C2619" style={{ margin: '0 auto 1rem auto' }} />
          <h3 style={{ marginBottom: '0.5rem', color: '#0C2619' }}>Severity & High Priority</h3>
          <p style={{ fontSize: '0.88rem', color: '#6B675E' }}>Repeated duplicate reports dynamically increase the severity meter, ensuring institutions act on critical problems first.</p>
        </div>

        <div className="card" style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
          <Shield size={40} color="#E03E1A" style={{ margin: '0 auto 1rem auto' }} />
          <h3 style={{ marginBottom: '0.5rem', color: '#0C2619' }}>Government Oversight</h3>
          <p style={{ fontSize: '0.88rem', color: '#6B675E' }}>State officials monitor live solution progress, assigned handling organizations, and resolution timelines.</p>
        </div>
      </div>
    </div>
  );
}