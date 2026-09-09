import { supabase } from './supabase';

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
      const regex = new RegExp('\\b' + keyword.toLowerCase() + '\\b', 'g');
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
}