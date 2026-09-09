import { supabase } from './supabase';

export async function classifyProblem(title, description) {
  const text = `${title} ${description}`.toLowerCase();
  
  if (text.includes('water') || text.includes('drain') || text.includes('pipe') || text.includes('pump')) {
    return { domain: 'Water & Sanitation', confidence: 0.92, matchedKeywords: ['water', 'sanitation'] };
  } else if (text.includes('road') || text.includes('bridge') || text.includes('pothole') || text.includes('traffic')) {
    return { domain: 'Infrastructure & Roads', confidence: 0.89, matchedKeywords: ['road', 'infrastructure'] };
  } else if (text.includes('school') || text.includes('teacher') || text.includes('education') || text.includes('book')) {
    return { domain: 'Education & Literacy', confidence: 0.91, matchedKeywords: ['education', 'school'] };
  } else if (text.includes('hospital') || text.includes('doctor') || text.includes('medicine') || text.includes('health')) {
    return { domain: 'Healthcare & Medical', confidence: 0.94, matchedKeywords: ['healthcare', 'medical'] };
  } else if (text.includes('light') || text.includes('electricity') || text.includes('power') || text.includes('wire')) {
    return { domain: 'Electricity & Energy', confidence: 0.88, matchedKeywords: ['electricity', 'energy'] };
  }
  
  return { domain: 'General Community Issues', confidence: 0.75, matchedKeywords: ['community'] };
}

export async function checkSimilarProblems(title, domain) {
  try {
    const { data } = await supabase
      .from('problems')
      .select('*')
      .eq('domain', domain);

    if (!data || data.length === 0) return null;

    const lowerTitle = title.toLowerCase();
    const match = data.find(p => {
      const existingTitle = p.title.toLowerCase();
      return existingTitle.includes(lowerTitle) || lowerTitle.includes(existingTitle);
    });

    return match || null;
  } catch (err) {
    console.error('Error checking duplicate problems:', err);
    return null;
  }
}

export async function processProblemSubmission(formData) {
  const classification = await classifyProblem(formData.title, formData.description);
  const duplicate = await checkSimilarProblems(formData.title, classification.domain);

  if (duplicate) {
    const newCount = (duplicate.duplicate_count || 1) + 1;
    const newSeverity = Math.min(100, newCount * 25);

    await supabase
      .from('problems')
      .update({
        duplicate_count: newCount,
        severity_score: newSeverity,
        status: 'assigned' // Ensure duplicate reflects assigned status
      })
      .eq('id', duplicate.id);

    return { isDuplicate: true, problem: duplicate, newCount, newSeverity };
  }

  const domainCode = classification.domain.substring(0, 3).toUpperCase();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const generatedId = `JH-${domainCode}-${randomNum}`;

  // Find available organization for direct assignment
  const { data: matchedOrgs } = await supabase.from('organizations').select('*');
  const targetOrg = matchedOrgs && matchedOrgs.length > 0 ? matchedOrgs[0] : null;

  // Insert problem with status 'assigned' directly if an org exists, else 'assigned'
  const initialStatus = targetOrg ? 'assigned' : 'assigned';

  const { data: newProb, error: insertError } = await supabase.from('problems').insert({
    problem_id: generatedId,
    title: formData.title,
    description: formData.description,
    domain: classification.domain,
    ai_confidence: classification.confidence,
    matched_keywords: classification.matchedKeywords,
    status: initialStatus,
    district: formData.district || 'Ranchi',
    location_text: formData.locationText || 'General Location',
    poster_name: formData.posterName || 'Anonymous Citizen',
    poster_contact: formData.posterContact || 'Not Provided',
    duplicate_count: 1,
    severity_score: 25,
    progress_status: 'assigned'
  }).select().single();

  if (insertError) throw insertError;

  // Direct Auto-Assignment to Organization
  if (targetOrg) {
    await supabase.from('assignments').insert({
      problem_id: newProb.id,
      organization_id: targetOrg.id,
      status: 'assigned',
      progress_percentage: 15,
      notes: `Direct automated assignment to ${targetOrg.name} upon citizen submission.`
    });

    await supabase.from('notifications').insert({
      problem_id: newProb.id,
      type: 'auto_assignment',
      title: 'Direct Problem Auto-Assigned',
      message: `Problem [${generatedId}] was directly assigned to ${targetOrg.name}.`
    });
  }

  return { isDuplicate: false, problem: newProb };
}