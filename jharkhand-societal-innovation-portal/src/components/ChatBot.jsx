import React, { useState, useRef, useEffect } from 'react';
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
}