import { RESEARCHERS, MOUS } from '../utils/mockData';
import { 
  analyzeMOU, 
  explainScore, 
  getRiskAssessment, 
  type MOUInput 
} from '../utils/feasibility-engine';

/**
 * Composable for intelligent researcher recommendations and MOU analysis.
 */
export const useRecommendation = () => {
  /**
   * recommendForMOU — Returns the Top-K researchers for a proposed MOU based on scoring logic.
   */
  const recommendForMOU = (mouInput: MOUInput, topK: number = 5) => {
    const analysis = analyzeMOU(mouInput, RESEARCHERS);
    return analysis.slice(0, topK);
  };

  /**
   * explainRecommendation — Provides a detailed breakdown of scores and risk assessment for a specific researcher.
   */
  const explainRecommendation = (researcherId: string, mouInput: MOUInput) => {
    const researcher = RESEARCHERS.find(r => r.id === researcherId);
    if (!researcher) return null;

    const breakdown = explainScore(researcher, mouInput);
    const risk = getRiskAssessment(researcherId, mouInput, MOUS, RESEARCHERS);

    return {
      researcher,
      breakdown,
      risk,
      summary: `Score of ${breakdown.total.toFixed(1)}/100 based on theme alignment and expertise overlap.`
    };
  };

  /**
   * compareResearchers — Compares multiple researchers side-by-side against the same MOU criteria.
   */
  const compareResearchers = (ids: string[], mouInput: MOUInput) => {
    return RESEARCHERS
      .filter(r => ids.includes(r.id))
      .map(r => {
        const breakdown = explainScore(r, mouInput);
        const risk = getRiskAssessment(r.id, mouInput, MOUS, RESEARCHERS);
        return {
          id: r.id,
          name: r.name,
          score: breakdown.total,
          breakdown,
          risk: risk?.overallRisk || 'Unknown'
        };
      })
      .sort((a, b) => b.score - a.score);
  };

  /**
   * findAlternativeResearchers — Finds suitable replacements for a researcher who might have high risk or saturation.
   */
  const findAlternativeResearchers = (id: string, mouInput: MOUInput, limit: number = 3) => {
    // Filter out the original researcher and find the next best matches
    const allRecommendations = analyzeMOU(mouInput, RESEARCHERS);
    
    return allRecommendations
      .filter(rec => rec.researcher.id !== id)
      .slice(0, limit);
  };

  return {
    recommendForMOU,
    explainRecommendation,
    compareResearchers,
    findAlternativeResearchers
  };
};