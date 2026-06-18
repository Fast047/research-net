import Graph from 'graphology';
import louvain from 'graphology-communities-louvain';
import { RESEARCHERS } from './mockData';

/**
 * Calculates a collaboration suitability score between two researchers.
 * Score is based on expertise overlap, thematic alignment, and institutional diversity.
 */
export const getCollaborationScore = (r1: any, r2: any): number => {
  const getJaccard = (a: string[], b: string[]) => {
    const setA = new Set(a.map(s => s.toLowerCase()));
    const setB = new Set(b.map(s => s.toLowerCase()));
    const intersection = new Set([...setA].filter(x => setB.has(x)));
    const union = new Set([...setA, ...setB]);
    return union.size === 0 ? 0 : intersection.size / union.size;
  };

  // 1. Expertise similarity (weight: 50 points)
  // Measures how well their skillsets overlap or complement.
  const expertiseScore = getJaccard(r1.expertise || [], r2.expertise || []) * 50;

  // 2. Thematic alignment (weight: 30 points)
  // Measures if they work within the same strategic research pillars.
  const r1Themes = r1.themes || (r1.score_by_theme ? Object.keys(r1.score_by_theme) : []);
  const r2Themes = r2.themes || (r2.score_by_theme ? Object.keys(r2.score_by_theme) : []);
  const themeScore = getJaccard(r1Themes, r2Themes) * 30;

  // 3. Synergy bonus (weight: 20 points)
  // Different institutions provide higher cross-pollination value.
  const synergyBonus = r1.inst !== r2.inst ? 20 : 5;

  return Math.min(100, Math.round(expertiseScore + themeScore + synergyBonus));
};

/**
 * Detects research communities using the Louvain algorithm.
 * Groups researchers based on existing collaborative links (e.g., shared Research Group).
 */
export const getCommunities = () => {
  const graph = new Graph();

  RESEARCHERS.forEach((r:any) => {
    graph.addNode(r.id, { name: r.name });
  });

  // Build edges based on shared groups as a proxy for current collaboration
  RESEARCHERS.forEach((r1, i) => {
    RESEARCHERS.slice(i + 1).forEach((r2:any) => {
      if (r1.group === r2.group) {
        graph.mergeEdge(r1.id, r2.id);
      }
    });
  });

  // Returns a mapping of { nodeKey: communityIndex }
  return louvain(graph);
};

/**
 * Identifies high-potential collaborations between researchers who aren't currently connected.
 */
export const getPotentialCollaborations = (limit: number = 10) => {
  const potentials: Array<{ r1: any, r2: any, score: number }> = [];
  
  // Create a set of existing connections to filter them out
  const existingConnections = new Set<string>();
  RESEARCHERS.forEach((r, i) => {
    RESEARCHERS.forEach(other => {
      if (r.id !== other.id && r.group === other.group) {
        const pair = [r.id, other.id].sort().join(':');
        existingConnections.add(pair);
      }
    });
  });

  for (let i = 0; i < RESEARCHERS.length; i++) {
    for (let j = i + 1; j < RESEARCHERS.length; j++) {
      const r1 = RESEARCHERS[i] as any;
      const r2 = RESEARCHERS[j] as any;
      
      if (!existingConnections.has(`${r1.id}:${r2.id}`)) {
        const score = getCollaborationScore(r1, r2);
        // We only consider pairs with significant potential synergy
        if (score > 45) {
          potentials.push({ r1, r2, score });
        }
      }
    }
  }

  return potentials
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
};