import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { generateProblemId, classifyProblem, checkSimilarProblems } from '../lib/categorization';
import { AlertTriangle, Upload, CheckCircle, Mic, MicOff, Languages } from 'lucide-react';

const DISTRICTS = ['Ranchi', 'Dhanbad', 'Jamshedpur', 'Hazaribagh', 'Bokaro', 'Deoghar', 'Giridih', 'Ramgarh'];

export default function PostProblem() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ 
    title: '', 
    description: '', 
    district: 'Ranchi', 
    locationText: '', 
    posterName: '', 
    posterContact: '' 
  });
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [similarProb, setSimilarProb] = useState(null);

  const [isListening, setIsListening] = useState(false);
  const [speechLanguage, setSpeechLanguage] = useState('hi-IN');
  const [activeVoiceTarget, setActiveVoiceTarget] = useState('description');
  const [translating, setTranslating] = useState(false);

  const translateToEnglish = async (text, sourceLang) => {
    if (!text || sourceLang.startsWith('en')) return text;
    setTranslating(true);
    try {
      const langPair = `${sourceLang.split('-')[0]}|en`;
      const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langPair}`);
      const data = await res.json();
      setTranslating(false);
      return data?.responseData?.translatedText || text;
    } catch (err) {
      console.error('Translation error:', err);
      setTranslating(false);
      return text;
    }
  };

  const startSpeechRecognition = (targetField) => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = speechLanguage;
    recognition.interimResults = false;

    setActiveVoiceTarget(targetField);
    setIsListening(true);
    recognition.start();

    recognition.onresult = async (event) => {
      const spokenTranscript = event.results[0][0].transcript;
      setIsListening(false);
      const translatedEnglishText = await translateToEnglish(spokenTranscript, speechLanguage);

      setFormData(prev => ({
        ...prev,
        [targetField]: prev[targetField] ? `${prev[targetField]} ${translatedEnglishText}` : translatedEnglishText
      }));
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
  };

  const handleFileChange = (e) => setFiles(Array.from(e.target.files));

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
        poster_name: formData.posterName.trim() || 'Anonymous Citizen',
        poster_contact: formData.posterContact.trim() || 'Not Provided'
      }).select().single();

      if (insertError) throw insertError;

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
        <p style={{ color: '#6B675E', fontSize: '0.85rem', marginBottom: '1.2rem' }}>
          Submit problem details. Citizens can post anonymously without providing personal contact details.
        </p>

        <div style={{ background: '#FAF8F5', border: '1px solid #E6E1D5', borderRadius: 8, padding: '0.8rem 1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 700, color: '#0C2619' }}>
            <Languages size={18} color="#E03E1A" />
            <span>Voice Input Language:</span>
          </div>
          <select 
            className="form-control" 
            style={{ width: 'auto', padding: '0.3rem 0.6rem', fontSize: '0.85rem' }} 
            value={speechLanguage} 
            onChange={(e) => setSpeechLanguage(e.target.value)}
          >
            <option value="hi-IN">Hindi (हिंदी)</option>
            <option value="bn-IN">Bengali (বাংলা)</option>
            <option value="en-IN">English (India)</option>
          </select>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        {similarProb && (
          <div className="alert alert-warning">
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontWeight: 700 }}>
              <AlertTriangle size={18}/> SIMILAR ISSUE ALREADY REPORTED!
            </div>
            <p style={{ marginTop: '0.4rem', fontSize: '0.85rem' }}>
              Matching Issue ID: <strong>{similarProb.problem_id}</strong> ({similarProb.title}).
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <label style={{ margin: 0 }}>Problem Title *</label>
              <button 
                type="button" 
                onClick={() => startSpeechRecognition('title')}
                style={{ background: isListening && activeVoiceTarget === 'title' ? '#DC2626' : '#0C2619', color: 'white', border: 'none', padding: '0.3rem 0.7rem', borderRadius: 6, fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer' }}
              >
                {isListening && activeVoiceTarget === 'title' ? <MicOff size={14} /> : <Mic size={14} />}
                {isListening && activeVoiceTarget === 'title' ? 'Listening...' : 'Speak Title'}
              </button>
            </div>
            <input 
              className="form-control" 
              required 
              value={formData.title} 
              onChange={e => setFormData({ ...formData, title: e.target.value })} 
              placeholder="e.g. Broken water pipeline in village"
            />
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <label style={{ margin: 0 }}>Detailed Description *</label>
              <button 
                type="button" 
                onClick={() => startSpeechRecognition('description')}
                style={{ background: isListening && activeVoiceTarget === 'description' ? '#DC2626' : '#0C2619', color: 'white', border: 'none', padding: '0.3rem 0.7rem', borderRadius: 6, fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer' }}
              >
                {isListening && activeVoiceTarget === 'description' ? <MicOff size={14} /> : <Mic size={14} />}
                {isListening && activeVoiceTarget === 'description' ? 'Listening...' : 'Speak Description'}
              </button>
            </div>
            <textarea 
              className="form-control" 
              rows={4} 
              required 
              value={formData.description} 
              onChange={e => setFormData({ ...formData, description: e.target.value })} 
              placeholder="Provide complete details..."
            />
            {translating && <p style={{ fontSize: '0.75rem', color: '#E03E1A', marginTop: '0.3rem', fontWeight: 600 }}>Translating spoken speech to English...</p>}
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

          {/* OPTIONAL CITIZEN CONTACT DETAILS */}
          <div className="grid-2">
            <div className="form-group">
              <label>Your Name (Optional)</label>
              <input className="form-control" value={formData.posterName} onChange={e => setFormData({ ...formData, posterName: e.target.value })} placeholder="Anonymous Citizen" />
            </div>
            <div className="form-group">
              <label>Contact Phone/Email (Optional)</label>
              <input className="form-control" value={formData.posterContact} onChange={e => setFormData({ ...formData, posterContact: e.target.value })} placeholder="Not Provided" />
            </div>
          </div>

          <button type="submit" className="btn btn-orange" style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }} disabled={loading || translating}>
            {loading ? 'Submitting...' : 'SUBMIT PROBLEM (ANONYMOUS)'}
          </button>
        </form>
      </div>
    </div>
  );
}