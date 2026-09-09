import React from 'react';

export default function PalashLogo({ height = 46 }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.9rem', cursor: 'pointer' }}>
      <img 
        src="/palash-logo.jpg" 
        alt="PALASH Logo" 
        style={{ height: height, width: 'auto', borderRadius: '6px', objectFit: 'contain' }}
        onError={(e) => { e.target.style.display = 'none'; }}
      />
      <div style={{ display: 'flex', flexDirection: 'column', justify: 'center' }}>
        <div style={{ 
          fontSize: '1.45rem', 
          fontWeight: 900, 
          letterSpacing: '2.5px', 
          color: '#0C2619', 
          lineHeight: 1, 
          textTransform: 'uppercase',
          fontFamily: "'Plus Jakarta Sans', sans-serif" 
        }}>
          P<span style={{ color: '#E03E1A' }}>∧</span>L<span style={{ color: '#E03E1A' }}>∧</span>SH
        </div>
        <div style={{ 
          fontSize: '0.6rem', 
          fontWeight: 800, 
          color: '#0C2619', 
          letterSpacing: '0.8px', 
          marginTop: '3px',
          opacity: 0.85
        }}>
          — FROM CHALLENGES TO CHANGE —
        </div>
      </div>
    </div>
  );
}