import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Search, Building2, Shield, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div>
      {/* HERO SECTION WITH VIDEO BACKGROUND */}
      <div style={{ position: 'relative', width: '100%', height: '75vh', overflow: 'hidden', borderRadius: '16px', marginBottom: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.4)' }}
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-drone-view-of-a-rural-town-41551-large.mp4" type="video/mp4" />
          Your browser does not support video background.
        </video>

        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: 800, padding: '0 1.5rem' }}>
          <h1 style={{ fontSize: '2.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem', textShadow: '0 4px 12px rgba(0,0,0,0.6)' }}>
            PAL<span style={{ color: '#E03E1A' }}>A</span>SH Portal Jharkhand
          </h1>
          <p style={{ fontSize: '1.15rem', marginBottom: '2rem', opacity: 0.95, lineHeight: 1.6, textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}>
            A state-level collaborative platform empowering citizens, institutions, and government to resolve community challenges with AI auto-assignment and priority severity tracking.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/post-problem" className="btn btn-orange" style={{ padding: '0.8rem 1.8rem', fontSize: '1rem' }}>
              Report Issue Anonymously <ArrowRight size={18} />
            </Link>
            <Link to="/explore" className="btn" style={{ background: 'white', color: '#0C2619', padding: '0.8rem 1.8rem', fontSize: '1rem', fontWeight: 700 }}>
              Explore Portal Issues
            </Link>
          </div>
        </div>
      </div>

      {/* PORTAL FEATURES GRID */}
      <div className="grid-3" style={{ marginBottom: '3rem' }}>
        <div className="card" style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
          <AlertCircle size={40} color="#E03E1A" style={{ marginBottom: '1rem' }} />
          <h3 style={{ marginBottom: '0.5rem' }}>Voice & Anonymous Reporting</h3>
          <p style={{ fontSize: '0.88rem', color: '#6B675E' }}>Report issues in Hindi or Bengali via voice input. No mandatory personal details or emails required.</p>
        </div>

        <div className="card" style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
          <Building2 size={40} color="#0C2619" style={{ marginBottom: '1rem' }} />
          <h3 style={{ marginBottom: '0.5rem' }}>Severity & High Priority</h3>
          <p style={{ fontSize: '0.88rem', color: '#6B675E' }}>Repeated duplicate reports dynamically increase the severity meter, ensuring institutions act on critical problems first.</p>
        </div>

        <div className="card" style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
          <Shield size={40} color="#E03E1A" style={{ marginBottom: '1rem' }} />
          <h3 style={{ marginBottom: '0.5rem' }}>Government Oversight</h3>
          <p style={{ fontSize: '0.88rem', color: '#6B675E' }}>State officials monitor live solution progress, assigned handling organizations, and resolution timelines.</p>
        </div>
      </div>
    </div>
  );
}