import Graph from 'graphology'; 
import type { AbstractGraph } from 'graphology-types';

export const TYPE_COLORS: Record<string, string> = {
  Researcher: '#10b981',
  Group: '#3b82f6',
  MOU: '#f59e0b'
};

interface GraphNode {
  id: string;
  label: string;
  type: string;
  community?: number;
  data?: {
    theme?: string;
    [key: string]: any;
  };
}

interface GraphLink {
  source: string;
  target: string;
  label?: string;
}

/**
 * Bridge function to convert raw data into a Graphology instance for Sigma.js
 */
export function toSigmaGraph(data: { nodes: GraphNode[]; links: GraphLink[] }): Graph {
  const graph: AbstractGraph = new Graph();

  data.nodes.forEach((n) => {
    graph.addNode(n.id, {
      x: Math.random(),
      y: Math.random(),
      label: n.label,
      size: n.type === 'Group' ? 12 : 6,
      color: TYPE_COLORS[n.type] || '#94a3b8',
      type: n.type,
      theme: n.data?.theme,
      community: n.community,
      data: n.data
    });
  });

  data.links.forEach((l) => {
    if (graph.hasNode(l.source) && graph.hasNode(l.target)) {
      graph.addEdge(l.source, l.target, { size: 1, color: '#334155', label: l.label });
    }
  });

  return graph;
}