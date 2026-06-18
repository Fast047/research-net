import { MOUS, PROJECTS, RESEARCHERS } from './mockData';

/**
 * Calculates the impact score for a specific MOU based on its budget
 * and associated projects.
 */
export const getImpactScore = (mouId: string) => {
  const mou = MOUS.find(m => m.id === mouId);
  if (!mou) return 0;

  // Calculate project-based impact
  const relatedProjects = (PROJECTS || []).filter((p: any) => p.mou_id === mouId);
  const projectValue = relatedProjects.reduce((sum: number, p: any) => sum + (p.budget || 0), 0);

  // Score heuristic: 20% of MOU budget + 50% of related project budgets + 5 points per project
  return Math.round(((mou.budget || 0) * 0.2) + (projectValue * 0.5) + (relatedProjects.length * 5));
};

/**
 * Returns the MOU with the highest calculated impact score.
 */
export const getTopImpactMOU = () => {
  if (!MOUS || MOUS.length === 0) return null;
  
  const scoredMous = MOUS.map(m => ({
    ...m,
    impactScore: getImpactScore(m.id)
  }));
  
  return scoredMous.sort((a, b) => b.impactScore - a.impactScore)[0];
};

/**
 * Calculates the research impact of a specific researcher.
 */
export const getResearcherImpact = (researcherId: string) => {
  const researcher = RESEARCHERS.find(r => r.id === researcherId);
  if (!researcher) return null;

  const relatedProjects = (PROJECTS || []).filter((p: any) => 
    p.researcher_ids?.includes(researcherId)
  );

  // Impact score = (H-index * 2) + (Experience Score) + (Number of Projects * 10)
  const score = (researcher.hindex * 2) + researcher.exp_score + (relatedProjects.length * 10);

  return {
    researcherName: researcher.name,
    score: Math.round(score),
    projectCount: relatedProjects.length,
    metrics: {
      hindex: researcher.hindex,
      experience: researcher.exp_score
    }
  };
};
