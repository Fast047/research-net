import { getSkillGapReport } from '../utils/skill-gap';
import { getImpactScore, getResearcherImpact, getTopImpactMOU } from '../utils/impact-analysis';
import { getActivityTimeline, getGrowthRate, getFutureProjection } from '../utils/trend-timeline';
import { getGapReport, getSaturationRisk } from '../utils/gap-analysis';
import { getMOUDiversityScore, getCountryCoverage } from '../utils/partner-recommender';
import { getTopEntities, getGroupStrengthProfile } from '../utils/centrality-ranking';
import { getPotentialCollaborations } from '../utils/collaboration-clusters';

/**
 * Unified Analytics Composable
 * Provides a centralized interface for accessing various research network analytical engines.
 */
export const useAnalytics = () => {
  /**
   * Unified interface for retrieving analytics data based on type and parameters.
   * 
   * @param type - The type of analytics (e.g., 'skill-gap', 'impact', 'timeline', 'ranking')
   * @param params - Optional configuration parameters for the analytical engines.
   */
  const getAnalytics = (type: string, params: any = {}) => {
    switch (type) {
      case 'skill-gap':
        return getSkillGapReport();
      
      case 'impact':
        if (params.mouId) return getImpactScore(params.mouId);
        if (params.researcherId) return getResearcherImpact(params.researcherId);
        return getTopImpactMOU();

      case 'timeline':
        return getActivityTimeline(params.range);

      case 'growth':
        return getGrowthRate();

      case 'projection':
        return getFutureProjection(params.years);

      case 'gaps':
        return getGapReport();

      case 'saturation':
        return getSaturationRisk();

      case 'diversity':
        return getMOUDiversityScore();

      case 'countries':
        return getCountryCoverage();

      case 'ranking':
        return getTopEntities(
          params.entityType || 'researcher', 
          params.metric || 'exp_score', 
          params.limit || 5
        );

      case 'group-profile':
        return getGroupStrengthProfile(params.groupId);

      case 'collaborations':
        return getPotentialCollaborations(params.limit);

      default:
        console.warn(`[useAnalytics] Unknown analytics type: ${type}`);
        return null;
    }
  };

  return {
    getAnalytics
  };
};
