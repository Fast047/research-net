export interface MOUInput {
  theme: string;
  keywords: string[];
  budget: number;
}

export interface ScoreBreakdown {
  themeAlignment: number;
  expertiseOverlap: number;
  historicalSuccess: number;
  networkCentrality: number;
  budgetFit: number;
  total: number;
}

/**
 * Calculates a Jaccard Similarity score for keywords
 */
const calculateJaccard = (setA: string[], setB: string[]): number => {
  const a = new Set(setA.map(s => s.toLowerCase()));
  const b = new Set(setB.map(s => s.toLowerCase()));
  const intersection = new Set([...a].filter(x => b.has(x)));
  const union = new Set([...a, ...b]);
  return union.size === 0 ? 0 : (intersection.size / union.size) * 100;
};

/**
 * Calculates the breakdown for a specific researcher
 */
export const explainScore = (researcher: any, mouInput: MOUInput): ScoreBreakdown => {
  // 1. Theme Alignment (30%)
  const themeAlignment = (researcher.themes || []).includes(mouInput.theme) ? 100 : 20;

  // 2. Expertise Overlap (25%)
  const expertiseOverlap = calculateJaccard(mouInput.keywords, researcher.expertise || []);

  // 3. Historical Success (20%)
  // Based on hindex and existing experience score
  const historicalSuccess = Math.min(((researcher.hindex || 0) * 4) + ((researcher.exp_score || 0) / 2), 100);

  // 4. Network Centrality (15%)
  // If available, use PageRank/Centrality, otherwise fallback to a weight based on group influence
  const networkCentrality = researcher.pagerank ? researcher.pagerank * 1000 : (researcher.exp_score || 50);

  // 5. Budget Fit (10%)
  // High budget fits high h-index/exp. Low budget fits younger researchers.
  const expectedBudget = ((researcher.hindex || 1) * 2); // Simple heuristic: 1 h-index point ~ 2M budget
  const budgetDiff = Math.abs(mouInput.budget - expectedBudget);
  const budgetFit = Math.max(100 - (budgetDiff * 5), 0);

  const total = (
    (themeAlignment * 0.30) +
    (expertiseOverlap * 0.25) +
    (historicalSuccess * 0.20) +
    (networkCentrality * 0.15) +
    (budgetFit * 0.10)
  );

  return {
    themeAlignment,
    expertiseOverlap,
    historicalSuccess,
    networkCentrality,
    budgetFit,
    total
  };
};

/**
 * Core engine function to rank researchers for a proposed MOU
 */
export const analyzeMOU = (mouInput: MOUInput, researchers: any[]) => {
  return researchers
    .map(res => {
      const breakdown = explainScore(res, mouInput);
      return {
        researcher: res,
        score: breakdown.total,
        breakdown
      };
    })
    .sort((a, b) => b.score - a.score);
};

/**
 * Assesses risks based on current workload and expertise dependency
 */
export const getRiskAssessment = (researcherId: string, mouInput: MOUInput, allMous: any[], allResearchers: any[]) => {
  const researcher = allResearchers.find(r => r.id === researcherId);
  if (!researcher) return null;

  // 1. Saturation Risk: How many active MOUs does this person already have?
  const activeMous = allMous.filter(m => m.researchers?.includes(researcherId) && m.status === 'active');
  const saturation = activeMous.length >= 4 ? 'high' : activeMous.length >= 2 ? 'medium' : 'low';

  // 2. Dependency Risk: Is this person the only expert in this theme/keyword combo?
  const otherExperts = allResearchers.filter(r => 
    r.id !== researcherId && 
    r.themes?.includes(mouInput.theme) &&
    (r.expertise || []).some((e: string) => mouInput.keywords.includes(e))
  );
  const dependency = otherExperts.length === 0 ? 'high' : otherExperts.length < 2 ? 'medium' : 'low';

  // 3. Gap Risk: Score alignment vs Budget
  const score = explainScore(researcher, mouInput).total;
  const gap = score < 60 ? 'high' : score < 75 ? 'medium' : 'low';

  return {
    saturation,
    dependency,
    gap,
    overallRisk: (saturation === 'high' || dependency === 'high') ? 'High' : 
                 (saturation === 'medium' || gap === 'medium') ? 'Medium' : 'Low',
    details: {
      mouCount: activeMous.length,
      redundancyCount: otherExperts.length
    }
  };
};