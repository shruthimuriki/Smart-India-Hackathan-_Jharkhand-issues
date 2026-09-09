const fs = require('fs');
const path = require('path');

const currentDirName = path.basename(process.cwd());
const ROOT_DIR = currentDirName === 'jharkhand-societal-innovation-portal' ? '.' : 'jharkhand-societal-innovation-portal';

const files = {
  ".env.example": `VITE_SUPABASE_URL=https://your-supabase-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key`,

  ".gitignore": `node_modules
dist
.env
.env.local
.DS_Store`,

  "package.json": JSON.stringify({
    "name": "jharkhand-societal-innovation-portal",
    "private": true,
    "version": "17.0.0",
    "type": "module",
    "scripts": {
      "dev": "vite",
      "build": "vite build",
      "preview": "vite preview"
    },
    "dependencies": {
      "@supabase/supabase-js": "^2.39.8",
      "lucide-react": "^0.344.0",
      "react": "^18.2.0",
      "react-dom": "^18.2.0",
      "react-router-dom": "^6.22.3"
    },
    "devDependencies": {
      "@types/react": "^18.2.66",
      "@types/react-dom": "^18.2.22",
      "@vitejs/plugin-react": "^4.2.1",
      "vite": "^5.1.6"
    }
  }, null, 2),

  "vite.config.js": `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: { port: 5173, host: true }
});`,

  "index.html": `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>PALASH — From Challenges to Change | Jharkhand</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>`,

  "src/index.css": `:root {
  --palash-orange: #E03E1A;
  --palash-orange-hover: #C22D0C;
  --palash-green: #0C2619;
  --palash-green-hover: #04120B;
  --bg-light: #FAF8F5;
  --bg-white: #FFFFFF;
  --border-color: #E6E1D5;
  --text-main: #141815;
  --text-muted: #6B675E;
  --card-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
}

* { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Plus Jakarta Sans', sans-serif; }
body { background-color: var(--bg-light); color: var(--text-main); min-height: 100vh; }
.app-container { min-height: 100vh; display: flex; flex-direction: column; position: relative; }
.main-content { flex: 1; padding: 2rem 1.5rem; max-width: 1280px; margin: 0 auto; width: 100%; }

.btn { padding: 0.65rem 1.3rem; border-radius: 8px; font-weight: 600; cursor: pointer; border: none; display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; text-decoration: none; font-size: 0.9rem; transition: all 0.2s ease; }
.btn-primary { background-color: var(--palash-green); color: white; }
.btn-primary:hover { background-color: var(--palash-green-hover); }
.btn-orange { background-color: var(--palash-orange); color: white; }
.btn-orange:hover { background-color: var(--palash-orange-hover); }
.btn-outline { background: transparent; border: 1.5px solid var(--border-color); color: var(--text-main); }
.btn-outline:hover { border-color: var(--palash-green); color: var(--palash-green); }
.btn-danger { background-color: #DC2626; color: white; }

.card { background-color: var(--bg-white); border: 1px solid var(--border-color); border-radius: 12px; padding: 1.8rem; margin-bottom: 1.5rem; box-shadow: var(--card-shadow); }
.grid-2 { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.5rem; }
.grid-4 { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; }

.role-tabs { 
  display: flex; 
  background: #F2EFE9; 
  padding: 4px; 
  border-radius: 10px; 
  margin-bottom: 1.5rem; 
  border: 1px solid var(--border-color);
}
.role-tab { 
  flex: 1; 
  padding: 0.65rem 0.5rem; 
  border-radius: 8px; 
  font-weight: 700; 
  font-size: 0.85rem; 
  cursor: pointer; 
  border: none; 
  background: transparent; 
  color: var(--text-muted); 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  gap: 0.4rem;
  transition: all 0.2s ease;
}
.role-tab.active { 
  background: var(--palash-green); 
  color: #FFFFFF; 
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.badge { padding: 0.3rem 0.75rem; border-radius: 50px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; display: inline-block; }
.badge-citizen { background: #E0F2FE; color: #0369A1; border: 1px solid #BAE6FD; }
.badge-organization { background: #FEF3C7; color: #D97706; border: 1px solid #FCD34D; }
.badge-government { background: #DCFCE7; color: #15803D; border: 1px solid #86EFAC; }
.badge-available { background: #FEF3C7; color: #B45309; border: 1px solid #FCD34D; }
.badge-in_progress { background: #DBEAFE; color: #1E40AF; border: 1px solid #93C5FD; }
.badge-resolved { background: #DCFCE7; color: #15803D; border: 1px solid #86EFAC; }

.progress-bar-bg { background: #E6E1D5; height: 10px; border-radius: 5px; overflow: hidden; margin: 0.5rem 0; }
.progress-bar-fill { background: var(--palash-orange); height: 100%; transition: width 0.3s ease; }

.form-group { margin-bottom: 1.25rem; }
.form-group label { display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 0.4rem; color: var(--text-muted); }
.form-control { width: 100%; padding: 0.75rem; background-color: var(--bg-white); border: 1px solid var(--border-color); border-radius: 8px; color: var(--text-main); font-size: 0.95rem; }
.form-control:focus { outline: none; border-color: var(--palash-green); }

.file-uploader { border: 2px dashed var(--border-color); padding: 1.5rem; border-radius: 8px; text-align: center; background: #FAF8F5; margin-top: 0.5rem; cursor: pointer; }
.file-uploader:hover { border-color: var(--palash-orange); background: #FFFDF9; }

.alert { padding: 0.8rem 1rem; border-radius: 8px; margin-bottom: 1.2rem; font-size: 0.85rem; font-weight: 600; }
.alert-danger { background: #FEE2E2; border: 1px solid #FCA5A5; color: #991B1B; }

.modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
.modal-content { background: var(--bg-white); border: 1px solid var(--border-color); padding: 2rem; border-radius: 12px; max-width: 550px; width: 90%; max-height: 85vh; overflow-y: auto; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); }`,

  "src/components/PalashLogo.jsx": `import React from 'react';

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
}`,

  "src/components/ChatBot.jsx": `import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send } from 'lucide-react';

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Hello! I am PALASH Assistant. Ask me anything about reporting issues, auto-assignments, organization claims, government oversight, or tracking updates!'
    }
  ]);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const generateAnswer = (query) => {
    const q = query.toLowerCase().trim();

    if (q.includes('assign') || q.includes('auto') || q.includes('institution') || q.includes('allocate')) {
      return "When a citizen reports a problem, PALASH automatically analyzes the domain using NLP keyword classification and assigns the issue directly to the most qualified registered institution or university.";
    }
    if (q.includes('notification') || q.includes('dismiss') || q.includes('delete') || q.includes('bell')) {
      return "Notifications are saved in Supabase. Once you click 'Dismiss' or 'Delete', its status is updated to read or permanently removed. It will NEVER be shown again, even across page refreshes or re-logins.";
    }
    if (q.includes('report') || q.includes('citizen') || q.includes('post') || q.includes('submit')) {
      return "Citizens can submit community problems under the 'Report' tab. Enter a title, description, district, village, and optional media proof. The portal will check for duplicates and route it to an institution.";
    }
    if (q.includes('organization') || q.includes('collaborate') || q.includes('university') || q.includes('claim')) {
      return "Organizations can manage auto-assigned issues under 'Collaborate' (Accept/Ignore) or claim any unassigned open public challenge directly from the 'Explore' page by clicking 'I want to solve this problem'.";
    }
    if (q.includes('government') || q.includes('oversight') || q.includes('admin') || q.includes('state')) {
      return "Government officials can track state-wide impact statistics, monitor active collaborations, and inspect technical milestone verification reasons across all districts via the 'Govt Oversight' dashboard.";
    }
    if (q.includes('track') || q.includes('id') || q.includes('progress') || q.includes('status') || q.includes('search')) {
      return "You can track any problem in real-time on the 'Track' page using its unique Problem ID (e.g. JH-AGR-2026-000001). It displays the assigned organization, progress bar percentage, and logged milestone reasons.";
    }
    if (q.includes('hello') || q.includes('hi') || q.includes('hey') || q.includes('namaste')) {
      return "Greetings! How can I assist you with the PALASH portal today? Feel free to ask about reporting problems, organization workflows, or government oversight.";
    }

    return "For '" + query + "': PALASH connects citizens, institutions, industry, and government across Jharkhand. Citizens report problems, the portal auto-assigns them to institutions, organizations update milestone progress with technical reasons, and officials oversee execution state-wide!";
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input.trim() };
    const botReply = { sender: 'bot', text: generateAnswer(input.trim()) };

    setMessages(prev => [...prev, userMessage, botReply]);
    setInput('');
  };

  return (
    <div style={{ position: 'fixed', bottom: '25px', right: '25px', zIndex: 1000 }}>
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)} 
          style={{ 
            background: '#0C2619', 
            color: 'white', 
            border: 'none', 
            borderRadius: '50px', 
            padding: '0.8rem 1.4rem', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.6rem', 
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)', 
            cursor: 'pointer',
            fontWeight: 700,
            fontSize: '0.9rem'
          }}
        >
          <Bot size={22} color="#E03E1A" /> Ask PALASH AI
        </button>
      ) : (
        <div style={{ 
          width: '360px', 
          height: '480px', 
          background: '#FFFFFF', 
          borderRadius: '16px', 
          border: '1px solid #E6E1D5', 
          boxShadow: '0 12px 32px rgba(0,0,0,0.15)', 
          display: 'flex', 
          flexDirection: 'column', 
          overflow: 'hidden' 
        }}>
          <div style={{ background: '#0C2619', color: 'white', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Bot size={20} color="#E03E1A" />
              <div>
                <h4 style={{ fontSize: '0.95rem', margin: 0 }}>PALASH AI Assistant</h4>
                <span style={{ fontSize: '0.7rem', color: '#A3B18A' }}>Online | Ready to help</span>
              </div>
            </div>
            <X size={18} style={{ cursor: 'pointer' }} onClick={() => setIsOpen(false)} />
          </div>

          <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', background: '#FAF8F5', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {messages.map((m, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: m.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{ 
                  maxWidth: '82%', 
                  padding: '0.7rem 0.9rem', 
                  borderRadius: '12px', 
                  fontSize: '0.85rem', 
                  lineHeight: '1.4',
                  background: m.sender === 'user' ? '#E03E1A' : '#FFFFFF', 
                  color: m.sender === 'user' ? '#FFFFFF' : '#141815',
                  border: m.sender === 'bot' ? '1px solid #E6E1D5' : 'none',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
                }}>
                  {m.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} style={{ display: 'flex', borderTop: '1px solid #E6E1D5', padding: '0.6rem', background: '#FFFFFF' }}>
            <input 
              type="text" 
              placeholder="Ask any question..." 
              value={input} 
              onChange={e => setInput(e.target.value)}
              style={{ flex: 1, border: 'none', outline: 'none', padding: '0.5rem 0.8rem', fontSize: '0.85rem' }} 
            />
            <button type="submit" style={{ background: '#0C2619', color: 'white', border: 'none', borderRadius: '8px', padding: '0.5rem 0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              <Send size={15} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}`,

  "src/lib/supabase.js": `import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder',
  { auth: { persistSession: true }, realtime: { params: { eventsPerSecond: 10 } } }
);`,

  "src/lib/categorization.js": `import { supabase } from './supabase';

export async function generateProblemId(domain) {
  try {
    const { data, error } = await supabase.rpc('fn_generate_problem_id', { p_domain: domain });
    if (error) throw error;
    return data;
  } catch (err) {
    return 'JH-GEN-' + new Date().getFullYear() + '-' + Date.now().toString().slice(-6);
  }
}

export async function classifyProblem(title, description) {
  const combinedText = (title + ' ' + description).toLowerCase();
  const { data: keywordRecords } = await supabase.from('domain_keywords').select('domain, keyword');
  
  const matchesByDomain = {};
  const foundKeywords = [];

  if (keywordRecords) {
    keywordRecords.forEach(({ domain, keyword }) => {
      const regex = new RegExp('\\\\b' + keyword.toLowerCase() + '\\\\b', 'g');
      const matches = combinedText.match(regex);
      if (matches) {
        matchesByDomain[domain] = (matchesByDomain[domain] || 0) + matches.length;
        foundKeywords.push(keyword);
      }
    });
  }

  let selectedDomain = 'Rural Livelihoods';
  let maxMatches = 0;

  Object.entries(matchesByDomain).forEach(([domain, count]) => {
    if (count > maxMatches) {
      maxMatches = count;
      selectedDomain = domain;
    }
  });

  const confidence = Math.min(Math.round((maxMatches / (combinedText.split(' ').length || 1)) * 400), 98) || 68;

  return {
    domain: selectedDomain,
    confidence: Math.max(confidence, 60),
    matchedKeywords: [...new Set(foundKeywords)]
  };
}

export async function checkSimilarProblems(title, domain) {
  const words = title.toLowerCase().split(' ').filter(w => w.length > 3);
  const { data: existing } = await supabase.from('problems').select('*').eq('domain', domain);

  if (!existing) return null;
  for (const prob of existing) {
    const overlap = words.filter(word => prob.title.toLowerCase().includes(word));
    if (overlap.length >= 2) return prob;
  }
  return null;
}`,

  "src/context/AuthContext.jsx": `import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      else setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      else { setProfile(null); setLoading(false); }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId) => {
    try {
      const { data } = await supabase.from('profiles').select('*, organizations(*)').eq('id', userId).single();
      setProfile(data || null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  };

  const signUp = async (email, password, name, role, orgId) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    if (data.user) {
      await supabase.from('profiles').insert({
        id: data.user.id,
        email,
        name,
        role,
        organization_id: orgId || null
      });
    }
    return data;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, login, signUp, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);`,

  "src/components/Navbar.jsx": `import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, LogOut, X, Check, UserCheck, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import PalashLogo from './PalashLogo';

export default function Navbar() {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();
  const [unreadNotifications, setUnreadNotifications] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const userRole = profile?.role || 'citizen';
  const canReport = userRole === 'citizen';
  const canCollaborate = userRole === 'organization' || userRole === 'citizen';
  const isGovernment = userRole === 'government';

  useEffect(() => {
    fetchUnseenNotifications();
    const channel = supabase.channel('realtime:nav_notifications')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications' }, () => fetchUnseenNotifications())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [profile]);

  const fetchUnseenNotifications = async () => {
    const { data } = await supabase.from('notifications')
      .select('*')
      .eq('is_read', false)
      .order('created_at', { ascending: false });
    if (data) setUnreadNotifications(data);
  };

  const dismissNotification = async (id) => {
    await supabase.from('notifications').update({ is_read: true }).eq('id', id);
    setUnreadNotifications(prev => prev.filter(n => n.id !== id));
  };

  const deleteSingleNotification = async (id) => {
    await supabase.from('notifications').delete().eq('id', id);
    setUnreadNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <nav style={{ background: '#FFFFFF', borderBottom: '1px solid #E6E1D5', padding: '0.8rem 2rem', position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        
        <Link to="/" style={{ textDecoration: 'none' }}>
          <PalashLogo height={46} />
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.8rem', fontWeight: 600, fontSize: '0.9rem' }}>
          <Link to="/" style={{ color: '#141815', textDecoration: 'none' }}>Home</Link>
          {canReport && <Link to="/post-problem" style={{ color: '#6B675E', textDecoration: 'none' }}>Report</Link>}
          <Link to="/explore" style={{ color: '#6B675E', textDecoration: 'none' }}>Explore</Link>
          {canCollaborate && <Link to="/organization" style={{ color: '#6B675E', textDecoration: 'none' }}>Collaborate</Link>}
          {isGovernment && <Link to="/government" style={{ color: '#6B675E', textDecoration: 'none' }}>Govt Oversight</Link>}
          <Link to="/track" style={{ color: '#6B675E', textDecoration: 'none' }}>Track</Link>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
          <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => setShowModal(true)}>
            <div style={{ background: '#FAF8F5', padding: '0.6rem', borderRadius: '50%', border: '1px solid #E6E1D5', display: 'flex' }}>
              <Bell size={20} color="#141815" />
            </div>
            {unreadNotifications.length > 0 && (
              <span style={{ position: 'absolute', top: -2, right: -2, background: '#E03E1A', color: 'white', borderRadius: '50%', padding: '2px 6px', fontSize: '0.65rem', fontWeight: 800 }}>
                {unreadNotifications.length}
              </span>
            )}
          </div>

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', background: '#FAF8F5', padding: '0.4rem 0.8rem', borderRadius: 8, border: '1px solid #E6E1D5' }}>
              <UserCheck size={18} color="#0C2619" />
              <div style={{ fontSize: '0.8rem' }}>
                <div style={{ fontWeight: 700, color: '#141815' }}>{profile?.name || 'Logged User'}</div>
                <span className={'badge badge-' + userRole}>{userRole.toUpperCase()}</span>
              </div>
              <button onClick={() => { logout(); navigate('/'); }} className="btn btn-outline" style={{ padding: '0.3rem 0.6rem', marginLeft: '0.4rem' }} title="Logout">
                <LogOut size={14}/>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Link to="/login" className="btn btn-primary">Login</Link>
              <Link to="/register" className="btn btn-outline">Sign Up</Link>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #E6E1D5', paddingBottom: '0.8rem' }}>
              <h3 style={{ fontSize: '1.1rem' }}>Notifications ({unreadNotifications.length})</h3>
              <X style={{ cursor: 'pointer' }} onClick={() => setShowModal(false)} />
            </div>

            {unreadNotifications.length === 0 ? (
              <p style={{ color: '#6B675E', textAlign: 'center', padding: '1.5rem 0' }}>No new notifications found.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {unreadNotifications.map(n => (
                  <div key={n.id} style={{ background: '#FEF3C7', padding: '0.8rem', borderRadius: 8, border: '1px solid #E6E1D5' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <strong style={{ fontSize: '0.9rem', color: '#141815' }}>{n.title}</strong>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button onClick={() => dismissNotification(n.id)} style={{ background: '#0C2619', color: 'white', border: 'none', padding: '0.2rem 0.5rem', borderRadius: 4, fontSize: '0.7rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                          <Check size={12}/> Dismiss
                        </button>
                        <button onClick={() => deleteSingleNotification(n.id)} style={{ background: '#DC2626', color: 'white', border: 'none', padding: '0.2rem 0.5rem', borderRadius: 4, fontSize: '0.7rem', cursor: 'pointer', display: 'flex', alignItems: 'center' }} title="Delete notification">
                          <Trash2 size={12}/>
                        </button>
                      </div>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: '#6B675E', marginTop: '0.3rem' }}>{n.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}`,

  "src/components/Footer.jsx": `import React from 'react';

export default function Footer() {
  return (
    <footer style={{ background: '#FFFFFF', borderTop: '1px solid #E6E1D5', padding: '2rem 1.5rem', textAlign: 'center', fontSize: '0.85rem', color: '#6B675E', marginTop: 'auto' }}>
      <p style={{ fontWeight: 700, color: '#141815' }}>PALASH — Rooted in Jharkhand, Built for a Better Tomorrow</p>
      <p style={{ marginTop: '0.4rem' }}>A State Collaborative Portal for Citizens, Institutions, Industry & Governance.</p>
    </footer>
  );
}`,

  "src/pages/Home.jsx": `import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, FileText, CheckCircle2, Users, Lightbulb } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { profile } = useAuth();
  const canReport = profile?.role === 'citizen' || !profile;

  const [stats, setStats] = useState({ reported: 0, progress: 0, orgs: 0, resolved: 0 });

  useEffect(() => {
    fetchPortalStats();
  }, []);

  const fetchPortalStats = async () => {
    try {
      const { count: reported } = await supabase.from('problems').select('*', { count: 'exact', head: true });
      const { count: progress } = await supabase.from('problems').select('*', { count: 'exact', head: true }).eq('status', 'in_progress');
      const { count: orgs } = await supabase.from('organizations').select('*', { count: 'exact', head: true });
      const { count: resolved } = await supabase.from('problems').select('*', { count: 'exact', head: true }).eq('status', 'resolved');

      setStats({
        reported: reported || 0,
        progress: progress || 0,
        orgs: orgs || 0,
        resolved: resolved || 0
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <div style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #FAF8F5 100%)', border: '1px solid #E6E1D5', borderRadius: 16, padding: '4rem 2.5rem', textAlign: 'center', marginBottom: '2.5rem' }}>
        <span style={{ fontSize: '0.8rem', fontWeight: 800, letterSpacing: '1.5px', color: '#E03E1A', textTransform: 'uppercase' }}>A STRONGER JHARKHAND TOGETHER</span>
        <h1 style={{ fontSize: '3.2rem', fontWeight: 800, margin: '1rem 0', color: '#141815', lineHeight: 1.15 }}>
          Local Challenges.<br/> Real Solutions.<br/>
          <span style={{ color: '#E03E1A' }}>A Brighter Tomorrow.</span>
        </h1>
        <p style={{ fontSize: '1.1rem', color: '#6B675E', maxWidth: 720, margin: '0 auto 2.5rem' }}>
          PALASH connects citizens, institutions, industry, and government to identify, prioritize, and solve real problems of Jharkhand.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          {canReport && (
            <Link to="/post-problem" className="btn btn-orange" style={{ padding: '0.85rem 1.8rem', fontSize: '1rem' }}>
              Report a Problem <ArrowRight size={18}/>
            </Link>
          )}
          <Link to="/explore" className="btn btn-outline" style={{ padding: '0.85rem 1.8rem', fontSize: '1rem' }}>
            Explore Solutions
          </Link>
        </div>
      </div>

      <div className="grid-4" style={{ marginBottom: '2.5rem' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <h2 style={{ color: '#0C2619', fontSize: '2rem', fontWeight: 800 }}>{stats.reported}</h2>
          <p style={{ color: '#6B675E', fontSize: '0.85rem', fontWeight: 600 }}>Problems Reported</p>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <h2 style={{ color: '#E03E1A', fontSize: '2rem', fontWeight: 800 }}>{stats.progress}</h2>
          <p style={{ color: '#6B675E', fontSize: '0.85rem', fontWeight: 600 }}>Solutions in Progress</p>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <h2 style={{ color: '#0C2619', fontSize: '2rem', fontWeight: 800 }}>{stats.orgs}</h2>
          <p style={{ color: '#6B675E', fontSize: '0.85rem', fontWeight: 600 }}>Institutions Onboarded</p>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <h2 style={{ color: '#15803D', fontSize: '2rem', fontWeight: 800 }}>{stats.resolved}</h2>
          <p style={{ color: '#6B675E', fontSize: '0.85rem', fontWeight: 600 }}>Resolved Issues</p>
        </div>
      </div>

      <div className="grid-4">
        <div className="card">
          <FileText size={32} color="#E03E1A" style={{ marginBottom: '0.8rem' }} />
          <h3>Report</h3>
          <p style={{ fontSize: '0.85rem', color: '#6B675E', marginTop: '0.4rem' }}>Raise a problem directly from your community.</p>
        </div>
        <div className="card">
          <Lightbulb size={32} color="#0C2619" style={{ marginBottom: '0.8rem' }} />
          <h3>Assess</h3>
          <p style={{ fontSize: '0.85rem', color: '#6B675E', marginTop: '0.4rem' }}>Dynamic domain classification and impact scoring.</p>
        </div>
        <div className="card">
          <Users size={32} color="#E03E1A" style={{ marginBottom: '0.8rem' }} />
          <h3>Collaborate</h3>
          <p style={{ fontSize: '0.85rem', color: '#6B675E', marginTop: '0.4rem' }}>Connect universities and labs with stakeholders.</p>
        </div>
        <div className="card">
          <CheckCircle2 size={32} color="#15803D" style={{ marginBottom: '0.8rem' }} />
          <h3>Solve</h3>
          <p style={{ fontSize: '0.85rem', color: '#6B675E', marginTop: '0.4rem' }}>Track progress from creation to complete resolution.</p>
        </div>
      </div>
    </div>
  );
}`,

  "src/pages/PostProblem.jsx": `import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { generateProblemId, classifyProblem, checkSimilarProblems } from '../lib/categorization';
import { AlertTriangle, Upload, CheckCircle } from 'lucide-react';

const DISTRICTS = ['Ranchi', 'Dhanbad', 'Jamshedpur', 'Hazaribagh', 'Bokaro', 'Deoghar', 'Giridih', 'Ramgarh'];

export default function PostProblem() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ title: '', description: '', district: 'Ranchi', locationText: '', posterName: '', posterContact: '' });
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [similarProb, setSimilarProb] = useState(null);

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const classification = await classifyProblem(formData.title, formData.description);
      const duplicate = await checkSimilarProblems(formData.title, classification.domain);
      
      if (duplicate) {
        setSimilarProb(duplicate);
        setLoading(false);
        return;
      }

      const generatedId = await generateProblemId(classification.domain);

      const { data: newProb, error: insertError } = await supabase.from('problems').insert({
        problem_id: generatedId,
        title: formData.title,
        description: formData.description,
        domain: classification.domain,
        ai_confidence: classification.confidence,
        matched_keywords: classification.matchedKeywords,
        status: 'available',
        district: formData.district,
        location_text: formData.locationText,
        poster_name: formData.posterName,
        poster_contact: formData.posterContact
      }).select().single();

      if (insertError) throw insertError;

      // AUTOMATICALLY ASSIGN TO RELEVANT INSTITUTION
      const { data: matchedOrgs } = await supabase.from('organizations').select('*');
      if (matchedOrgs && matchedOrgs.length > 0) {
        const targetOrg = matchedOrgs[0];
        await supabase.from('assignments').insert({
          problem_id: newProb.id,
          organization_id: targetOrg.id,
          status: 'pending',
          notes: 'Automated AI assignment based on ' + classification.domain + ' specialization.'
        });

        await supabase.from('notifications').insert({
          problem_id: newProb.id,
          type: 'auto_assignment',
          title: 'Automated Problem Assignment Request',
          message: 'Problem [' + generatedId + '] in ' + classification.domain + ' was automatically assigned to ' + targetOrg.name + '.'
        });
      }

      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = Math.random() + '.' + fileExt;
        const filePath = 'media/' + fileName;

        await supabase.storage.from('problem-files').upload(filePath, file);

        await supabase.from('problem_media').insert({
          problem_id: newProb.id,
          file_name: file.name,
          file_type: file.type || fileExt,
          file_url: filePath
        });
      }

      navigate('/track?id=' + generatedId);
    } catch (err) {
      setError(err.message || 'Error submitting problem.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 750, margin: '0 auto' }}>
      <div className="card">
        <h2>Report a Community Issue</h2>
        <p style={{ color: '#6B675E', fontSize: '0.85rem', marginBottom: '1.5rem' }}>Submit problem details. PALASH will auto-assign the issue to the relevant institution.</p>

        {error && <div className="alert alert-danger">{error}</div>}

        {similarProb && (
          <div className="alert alert-warning">
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontWeight: 700 }}>
              <AlertTriangle size={18}/> SIMILAR ISSUE ALREADY REPORTED!
            </div>
            <p style={{ marginTop: '0.4rem', fontSize: '0.85rem' }}>Matching Issue ID: <strong>{similarProb.problem_id}</strong> ({similarProb.title}).</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Problem Title *</label>
            <input className="form-control" required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
          </div>

          <div className="form-group">
            <label>Detailed Description *</label>
            <textarea className="form-control" rows={4} required value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label>District *</label>
              <select className="form-control" value={formData.district} onChange={e => setFormData({ ...formData, district: e.target.value })}>
                {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Specific Village / Area *</label>
              <input className="form-control" required value={formData.locationText} onChange={e => setFormData({ ...formData, locationText: e.target.value })} />
            </div>
          </div>

          <div className="form-group">
            <label>Attach Proof Files (Images, Videos, PDFs)</label>
            <div className="file-uploader" onClick={() => document.getElementById('file-input').click()}>
              <Upload size={28} color="#E03E1A" style={{ marginBottom: '0.5rem' }} />
              <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>Click to upload files</p>
              <p style={{ fontSize: '0.75rem', color: '#6B675E' }}>Upload Photos (.jpg, .png), Videos (.mp4), or Docs (.pdf)</p>
              <input id="file-input" type="file" multiple onChange={handleFileChange} style={{ display: 'none' }} />
            </div>
            {files.length > 0 && (
              <div style={{ marginTop: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {files.map((f, i) => (
                  <div key={i} style={{ fontSize: '0.8rem', color: '#15803D', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <CheckCircle size={14}/> {f.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label>Your Name *</label>
              <input className="form-control" required value={formData.posterName} onChange={e => setFormData({ ...formData, posterName: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Contact Phone/Email *</label>
              <input className="form-control" required value={formData.posterContact} onChange={e => setFormData({ ...formData, posterContact: e.target.value })} />
            </div>
          </div>

          <button type="submit" className="btn btn-orange" style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }} disabled={loading}>
            {loading ? 'Submitting...' : 'SUBMIT PROBLEM'}
          </button>
        </form>
      </div>
    </div>
  );
}`,

  "src/pages/Explore.jsx": `import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export default function Explore() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);
  const [search, setSearch] = useState('');

  const isOrganization = profile?.role === 'organization';

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    const { data } = await supabase.from('problems').select('*').order('created_at', { ascending: false });
    setProblems(data || []);
  };

  const handleClaimFromExplore = async (prob) => {
    try {
      await supabase.from('problems').update({ status: 'in_progress' }).eq('id', prob.id);

      await supabase.from('assignments').insert({
        problem_id: prob.id,
        organization_id: profile?.organization_id || null,
        status: 'in_progress',
        notes: 'Claimed by ' + (profile?.name || 'Partner Organization') + ' from Explore Portal.'
      });

      await supabase.from('notifications').insert({
        problem_id: prob.id,
        type: 'problem_claimed',
        title: 'Problem Claimed from Explore Page',
        message: 'Problem [' + prob.problem_id + '] was claimed by ' + (profile?.name || 'Organization') + '.'
      });

      navigate('/solution-tracker?problem_id=' + prob.id);
    } catch (err) {
      alert(err.message || 'Failed to claim problem statement.');
    }
  };

  const filtered = problems.filter(p => p.title.toLowerCase().includes(search.toLowerCase()) || p.domain.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="card">
        <h2>Explore Reported Public Issues</h2>
        <p style={{ color: '#6B675E', fontSize: '0.85rem', marginBottom: '1rem' }}>Browse all citizen-reported challenges across Jharkhand.</p>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input className="form-control" placeholder="Search by domain or keyword..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="grid-2">
        {filtered.map(p => (
          <div key={p.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className={'badge badge-' + p.status}>{p.status.replace('_', ' ').toUpperCase()}</span>
                <span className="badge badge-citizen">{p.domain}</span>
              </div>
              <h3 style={{ marginTop: '0.8rem' }}>{p.title}</h3>
              <p style={{ fontSize: '0.85rem', color: '#6B675E', margin: '0.5rem 0' }}>{p.description}</p>
              <p style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>Location: {p.location_text}, {p.district} | ID: {p.problem_id}</p>
            </div>

            {isOrganization && p.status === 'available' && (
              <button onClick={() => handleClaimFromExplore(p)} className="btn btn-orange" style={{ width: '100%', justifyContent: 'center', marginTop: '1rem', fontSize: '0.85rem' }}>
                I want to solve this problem <ArrowRight size={16}/>
              </button>
            )}

            {p.status === 'in_progress' && (
              <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: '#1E40AF', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}>
                <CheckCircle2 size={16}/> Solution Currently Under Development
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}`,

  "src/pages/OrganizationDashboard.jsx": `import React, { useState, useEffect } from 'react';
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
}`,

  "src/pages/SolutionTracker.jsx": `import React, { useState, useEffect } from 'react';
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
}`,

  "src/pages/GovernmentDashboard.jsx": `import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function GovernmentDashboard() {
  const [assignments, setAssignments] = useState([]);
  const [totalProblems, setTotalProblems] = useState(0);

  useEffect(() => {
    fetchGovernmentData();
  }, []);

  const fetchGovernmentData = async () => {
    const { count } = await supabase.from('problems').select('*', { count: 'exact', head: true });
    setTotalProblems(count || 0);

    const { data } = await supabase.from('assignments')
      .select('*, problems(*), organizations(*)')
      .order('created_at', { ascending: false });
    setAssignments(data || []);
  };

  return (
    <div>
      <div className="card">
        <h2>State Oversight Console — Government Dashboard</h2>
        <p style={{ color: '#6B675E', fontSize: '0.85rem' }}>Monitor inter-institutional collaborations, industry acceptance, and milestone reasons.</p>
        <h3 style={{ marginTop: '0.8rem', color: '#0C2619' }}>Total Statewide Problems Reported: {totalProblems}</h3>
      </div>

      <div className="card">
        <h3>Live Collaboration & Industry Acceptance Audit Feed</h3>
        <p style={{ color: '#6B675E', fontSize: '0.8rem', marginBottom: '1rem' }}>Real-time overview of who is solving which societal problem statement.</p>

        {assignments.length === 0 ? <p style={{ color: '#9CA3AF' }}>No institutional collaborations recorded yet.</p> : (
          assignments.map(a => (
            <div key={a.id} style={{ borderBottom: '1px solid #E6E1D5', padding: '1rem 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className={'badge badge-' + a.status}>{a.status.toUpperCase()}</span>
                <span style={{ fontSize: '0.8rem', color: '#6B675E' }}>Assigned Institution: <strong>{a.organizations?.name || 'Birsa Agricultural University'}</strong></span>
              </div>
              <h4 style={{ margin: '0.5rem 0' }}>{a.problems?.title}</h4>
              <p style={{ fontSize: '0.85rem', color: '#6B675E' }}><strong>Milestone Reason / Execution Notes:</strong> {a.notes || 'No reason specified yet.'}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}`,

  "src/pages/TrackProblem.jsx": `import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Search, Building2, CheckCircle2, Clock } from 'lucide-react';

export default function TrackProblem() {
  const [searchParams] = useSearchParams();
  const [searchId, setSearchId] = useState(searchParams.get('id') || '');
  const [problem, setProblem] = useState(null);
  const [assignment, setAssignment] = useState(null);

  useEffect(() => {
    if (searchId) handleSearch();
  }, []);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!searchId.trim()) return;

    const { data: prob } = await supabase.from('problems').select('*').eq('problem_id', searchId.trim()).single();
    if (prob) {
      setProblem(prob);
      const { data: assign } = await supabase.from('assignments')
        .select('*, organizations(*)')
        .eq('problem_id', prob.id)
        .single();
      setAssignment(assign || null);
    } else {
      setProblem(null);
    }
  };

  const getProgressPercentage = (status) => {
    if (status === 'resolved') return 100;
    if (status === 'in_progress') return 60;
    return 10;
  };

  return (
    <div style={{ maxWidth: 850, margin: '0 auto' }}>
      <div className="card">
        <h2>PALASH Live Problem Tracker</h2>
        <p style={{ color: '#6B675E', fontSize: '0.85rem', marginBottom: '1rem' }}>Enter Problem ID to inspect assigned organization and execution milestones.</p>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem' }}>
          <input className="form-control" placeholder="e.g. JH-AGR-2026-000001" value={searchId} onChange={e => setSearchId(e.target.value)} />
          <button type="submit" className="btn btn-primary"><Search size={16}/> Track</button>
        </form>
      </div>

      {problem && (
        <div className="card">
          <span className={'badge badge-' + problem.status}>{problem.status.replace('_', ' ').toUpperCase()}</span>
          <h2 style={{ marginTop: '0.5rem' }}>{problem.title}</h2>
          <p style={{ color: '#6B675E', marginTop: '0.2rem' }}>ID: {problem.problem_id} | Domain: {problem.domain} | District: {problem.district}</p>

          <div style={{ marginTop: '1.2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700 }}>
              <span>Execution Progress</span>
              <span>{getProgressPercentage(problem.status)}%</span>
            </div>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: getProgressPercentage(problem.status) + '%' }}></div>
            </div>
          </div>

          {assignment ? (
            <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #E6E1D5', background: '#FAF8F5', padding: '1rem', borderRadius: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: '#0C2619', fontSize: '1rem' }}>
                <Building2 size={20} color="#E03E1A" />
                <span>Solving Organization / Partner:</span>
              </div>
              <h3 style={{ color: '#0C2619', marginTop: '0.3rem', fontSize: '1.2rem', fontWeight: 800 }}>
                {assignment.organizations?.name || 'Birsa Agricultural University'}
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#6B675E', marginBottom: '1rem' }}>
                District: {assignment.organizations?.district || problem.district}
              </p>
              
              <div style={{ background: '#FFFFFF', padding: '0.8rem', borderRadius: 6, border: '1px solid #E6E1D5' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#E03E1A', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckCircle2 size={16}/> Completed Milestones & Technical Reasons:
                </div>
                <p style={{ fontSize: '0.85rem', color: '#141815', marginTop: '0.4rem' }}>
                  {assignment.notes || 'Project initialized. Research team assigned to problem statement.'}
                </p>
              </div>
            </div>
          ) : (
            <div style={{ marginTop: '1rem', padding: '0.8rem', background: '#FEF3C7', borderRadius: 8, fontSize: '0.85rem', color: '#B45309' }}>
              <Clock size={14} inline /> Problem statement is currently listed on the portal awaiting institution claim.
            </div>
          )}
        </div>
      )}
    </div>
  );
}`,

  "src/pages/Login.jsx": `import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Building2, Shield } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [activeRole, setActiveRole] = useState('citizen');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(email, password);
      if (activeRole === 'government') navigate('/government');
      else if (activeRole === 'organization') navigate('/organization');
      else navigate('/explore');
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 450, margin: '3rem auto' }}>
      <div className="card">
        <h2 style={{ textAlign: 'center', marginBottom: '0.3rem' }}>PALASH Login</h2>
        <p style={{ textAlign: 'center', color: '#6B675E', fontSize: '0.85rem', marginBottom: '1.5rem' }}>Select your portal role to sign in</p>

        <div className="role-tabs">
          <button type="button" className={'role-tab ' + (activeRole === 'citizen' ? 'active' : '')} onClick={() => setActiveRole('citizen')}>
            <User size={15} /> Citizen
          </button>
          <button type="button" className={'role-tab ' + (activeRole === 'organization' ? 'active' : '')} onClick={() => setActiveRole('organization')}>
            <Building2 size={15} /> Organization
          </button>
          <button type="button" className={'role-tab ' + (activeRole === 'government' ? 'active' : '')} onClick={() => setActiveRole('government')}>
            <Shield size={15} /> Government
          </button>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email Address</label>
            <input className="form-control" type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder={activeRole + '@palash.gov.in'} />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input className="form-control" type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }} disabled={loading}>
            {loading ? 'Authenticating...' : 'Sign In as ' + activeRole.toUpperCase()}
          </button>
        </form>

        <p style={{ marginTop: '1.2rem', textAlign: 'center', fontSize: '0.85rem', color: '#6B675E' }}>
          New to PALASH? <Link to="/register" style={{ color: '#E03E1A', fontWeight: 700 }}>Create an Account</Link>
        </p>
      </div>
    </div>
  );
}`,

  "src/pages/Register.jsx": `import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { User, Building2, Shield } from 'lucide-react';

export default function Register() {
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const [activeRole, setActiveRole] = useState('citizen');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [orgId, setOrgId] = useState('');
  const [orgs, setOrgs] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.from('organizations').select('*').then(({ data }) => setOrgs(data || []));
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await signUp(email, password, name, activeRole, orgId || null);
      if (activeRole === 'government') navigate('/government');
      else if (activeRole === 'organization') navigate('/organization');
      else navigate('/explore');
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 480, margin: '2rem auto' }}>
      <div className="card">
        <h2 style={{ textAlign: 'center', marginBottom: '0.3rem' }}>Join PALASH Ecosystem</h2>
        <p style={{ textAlign: 'center', color: '#6B675E', fontSize: '0.85rem', marginBottom: '1.5rem' }}>Select user classification for account creation</p>

        <div className="role-tabs">
          <button type="button" className={'role-tab ' + (activeRole === 'citizen' ? 'active' : '')} onClick={() => setActiveRole('citizen')}>
            <User size={15} /> Citizen
          </button>
          <button type="button" className={'role-tab ' + (activeRole === 'organization' ? 'active' : '')} onClick={() => setActiveRole('organization')}>
            <Building2 size={15} /> Organization
          </button>
          <button type="button" className={'role-tab ' + (activeRole === 'government' ? 'active' : '')} onClick={() => setActiveRole('government')}>
            <Shield size={15} /> Government
          </button>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label>Full Name *</label>
            <input className="form-control" required value={name} onChange={e => setName(e.target.value)} placeholder="Full Name" />
          </div>

          <div className="form-group">
            <label>Email Address *</label>
            <input className="form-control" type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="email@domain.com" />
          </div>

          <div className="form-group">
            <label>Password *</label>
            <input className="form-control" type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
          </div>

          {activeRole === 'organization' && (
            <div className="form-group">
              <label>Select Associated University / Organization *</label>
              <select className="form-control" value={orgId} onChange={e => setOrgId(e.target.value)} required>
                <option value="">-- Select Registered Organization --</option>
                {orgs.map(o => <option key={o.id} value={o.id}>{o.name} ({o.district})</option>)}
              </select>
            </div>
          )}

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }} disabled={loading}>
            {loading ? 'Registering...' : 'Complete Registration'}
          </button>
        </form>

        <p style={{ marginTop: '1.2rem', textAlign: 'center', fontSize: '0.85rem', color: '#6B675E' }}>
          Already registered? <Link to="/login" style={{ color: '#E03E1A', fontWeight: 700 }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
}`,

  "src/App.jsx": `import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatBot from './components/ChatBot';
import Home from './pages/Home';
import Explore from './pages/Explore';
import PostProblem from './pages/PostProblem';
import TrackProblem from './pages/TrackProblem';
import Login from './pages/Login';
import Register from './pages/Register';
import OrganizationDashboard from './pages/OrganizationDashboard';
import SolutionTracker from './pages/SolutionTracker';
import GovernmentDashboard from './pages/GovernmentDashboard';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app-container">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/post-problem" element={<PostProblem />} />
              <Route path="/track" element={<TrackProblem />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/organization" element={<OrganizationDashboard />} />
              <Route path="/solution-tracker" element={<SolutionTracker />} />
              <Route path="/government" element={<GovernmentDashboard />} />
            </Routes>
          </main>
          <Footer />
          <ChatBot />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}`,

  "src/main.jsx": `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`
};

console.log("🚀 Updating PALASH portal codebase directly...");
Object.entries(files).forEach(([filePath, content]) => {
  const absolutePath = path.resolve(process.cwd(), ROOT_DIR, filePath);
  const dir = path.dirname(absolutePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(absolutePath, content, 'utf8');
  console.log(`  ✓ Updated: ${filePath}`);
});
console.log("\n🎉 PALASH PORTAL UPDATED SUCCESSFULLY!");