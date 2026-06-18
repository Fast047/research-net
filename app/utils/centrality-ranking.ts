/**
 * Centrality & Ranking Engine
 * Provides utilities to rank and analyze entities within the research network.
 */

/**
 * Ranks researchers based on a specific metric.
 */
export const getResearcherRanking = (metric: 'hindex' | 'exp_score' = 'exp_score') => {
  return [...(RESEARCHERS || [])].sort((a: any, b: any) => (b[metric] || 0) - (a[metric] || 0));
};

/**
 * Ranks research groups based on a specific metric.
 */
export const getGroupRanking = (metric: 'hindex' | 'exp_score' = 'exp_score') => {
  return [...(GROUPS || [])].sort((a: any, b: any) => (b[metric] || 0) - (a[metric] || 0));
};

/**
 * Returns the top N entities of a specific type based on a metric.
 */
export const getTopEntities = (type: 'researcher' | 'group', metric: 'hindex' | 'exp_score' = 'exp_score', topN: number = 5) => {
  const list = type === 'researcher' ? getResearcherRanking(metric) : getGroupRanking(metric);
  return list.slice(0, topN);
};

/**
 * Generates a strength profile for a research group, ideal for Radar charts.
 */
export const getGroupStrengthProfile = (groupId: string) => {
  const group = (GROUPS || []).find((g: any) => g.id === groupId);
  if (!group) return null;

  const memberCount = (RESEARCHERS || []).filter((r: any) => r.group === groupId).length;
  const mouCount = (MOUS || []).filter((m: any) => m.matched_groups?.includes(groupId)).length;
  const color = (THEMES as any)?.[group.theme]?.color || '#3b82f6';

  return {
    labels: ['Expertise', 'Collaboration', 'Impact (H-Index)', 'MOU Activity', 'Thematic Reach'],
    datasets: [{
      label: group.short,
      data: [
        group.exp_score || 0,
        Math.min(100, memberCount * 12), // Normalized membership size
        Math.min(100, (group.hindex || 0) * 2.5), // Normalized H-index impact
        Math.min(100, mouCount * 20), // Normalized MOU participation
        (group.mou_ids?.length || 1) * 20 // Diversity of themes
      ],
      borderColor: color,
      backgroundColor: color + '33', // Adding transparency for radar fill
    }]
  };
};