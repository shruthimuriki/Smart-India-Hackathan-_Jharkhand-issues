import React, { useState } from 'react';
import { MessageSquare, X, Send, Mic, MicOff, CheckCircle2, Sparkles } from 'lucide-react';
import { processProblemSubmission } from '../lib/categorization';

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Namaste! I am PALASH AI Assistant. You can speak or type your community problem here, and I can automatically submit it to the portal for you!' }
  ]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const startVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'hi-IN'; // Accepts Hindi / English
    recognition.interimResults = false;

    setIsListening(true);
    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setInput('');

    // Check if the input contains a problem report intent
    if (userMsg.length > 10 && (userMsg.toLowerCase().includes('problem') || userMsg.toLowerCase().includes('issue') || userMsg.toLowerCase().includes('broken') || userMsg.toLowerCase().includes('repair') || userMsg.toLowerCase().includes('water') || userMsg.toLowerCase().includes('road'))) {
      setIsSubmitting(true);
      setMessages(prev => [...prev, { sender: 'bot', text: '⚡ Processing your spoken voice/text and submitting it to the PALASH Portal automatically...' }]);

      try {
        const result = await processProblemSubmission({
          title: userMsg.substring(0, 40) + '...',
          description: userMsg,
          district: 'Ranchi',
          locationText: 'Voice Assistant Direct Submission',
          posterName: 'Anonymous Voice Citizen',
          posterContact: 'Voice Input'
        });

        if (result.isDuplicate) {
          setMessages(prev => [...prev, { 
            sender: 'bot', 
            text: `⚠️ Similar issue detected! We incremented the duplicate counter for Problem ID [${result.problem.problem_id}]. Severity increased to ${result.newSeverity}%! Priority boosted for organization assignment.` 
          }]);
        } else {
          setMessages(prev => [...prev, { 
            sender: 'bot', 
            text: `✅ Problem successfully registered! Generated ID: [${result.problem.problem_id}]. It has been automatically classified and queued for high-priority assignment.` 
          }]);
        }
      } catch (err) {
        setMessages(prev => [...prev, { sender: 'bot', text: 'Error registering your problem. Please try again or use the Report page.' }]);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // Normal Chat Assistance
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          sender: 'bot', 
          text: 'I can help you report issues! Try saying: "There is a broken water pipe in Ranchi" or "The road is damaged in Bokaro".' 
        }]);
      }, 600);
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: 25, right: 25, zIndex: 9999 }}>
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)} 
          className="btn btn-orange" 
          style={{ borderRadius: '50px', padding: '0.8rem 1.4rem', boxShadow: '0 8px 20px rgba(224, 62, 26, 0.4)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}
        >
          <Sparkles size={20} /> Ask PALASH AI (Voice enabled)
        </button>
      )}

      {isOpen && (
        <div style={{ width: 360, height: 480, background: '#FFFFFF', borderRadius: 16, boxShadow: '0 12px 32px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', border: '1px solid #E6E1D5', overflow: 'hidden' }}>
          {/* Header */}
          <div style={{ background: '#0C2619', color: 'white', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.95rem' }}>
              <Sparkles size={18} color="#E03E1A" /> PALASH AI Assistant
            </div>
            <X size={20} style={{ cursor: 'pointer' }} onClick={() => setIsOpen(false)} />
          </div>

          {/* Messages body */}
          <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.8rem', background: '#FAF8F5' }}>
            {messages.map((m, idx) => (
              <div key={idx} style={{ alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start', background: m.sender === 'user' ? '#E03E1A' : '#FFFFFF', color: m.sender === 'user' ? '#FFFFFF' : '#0C2619', padding: '0.7rem 0.9rem', borderRadius: 12, maxWidth: '85%', fontSize: '0.82rem', border: m.sender === 'bot' ? '1px solid #E6E1D5' : 'none', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                {m.text}
              </div>
            ))}
          </div>

          {/* Controls */}
          <div style={{ padding: '0.8rem', borderTop: '1px solid #E6E1D5', background: 'white', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <button 
              type="button" 
              onClick={startVoiceInput} 
              style={{ background: isListening ? '#DC2626' : '#0C2619', color: 'white', border: 'none', padding: '0.6rem', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              title="Speak your problem"
            >
              {isListening ? <MicOff size={18} /> : <Mic size={18} />}
            </button>
            <input 
              style={{ flex: 1, border: '1px solid #E6E1D5', padding: '0.6rem', borderRadius: 8, fontSize: '0.85rem', outline: 'none' }} 
              placeholder="Speak or type your issue..." 
              value={input} 
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              disabled={isSubmitting}
            />
            <button 
              onClick={handleSend} 
              style={{ background: '#E03E1A', color: 'white', border: 'none', padding: '0.6rem', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              disabled={isSubmitting}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}